export default {
 async fetch(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = ["https://www.liffey-consulting.com","https://liffey-consulting.com"];
  const headers = {"Access-Control-Allow-Origin": allowed.includes(origin) ? origin : allowed[0], "Vary":"Origin","Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"};
  const reply=(status,body)=>new Response(JSON.stringify(body),{status,headers});
  if(request.method==="OPTIONS") return allowed.includes(origin)?new Response(null,{status:204,headers:{...headers,"Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type"}}):reply(403,{error:"origin"});
  if(request.method!=="POST") return reply(405,{error:"method"});
  if(!allowed.includes(origin)) return reply(403,{error:"origin"});
  if(!env.FORM_ENABLED || env.FORM_ENABLED!=="true") return reply(503,{error:"not_configured"});
  if(!env.TURNSTILE_SECRET || !env.RESEND_API_KEY || !env.FROM_EMAIL) return reply(503,{error:"not_configured"});
  if(Number(request.headers.get("content-length")||0)>12000) return reply(413,{error:"too_large"});
  let data;try{data=await request.json()}catch{return reply(400,{error:"invalid_json"})}
  const name=String(data.name||"").trim(), email=String(data.email||"").trim(), message=String(data.message||"").trim(), topic=String(data.topic||""), locale=data.locale==="de"?"de":"en";
  const topics={general:"info@liffey-consulting.com",recruitment:"recruitment@liffey-consulting.com",career:"recruitment@liffey-consulting.com",consulting:"consulting@liffey-consulting.com",marketing:"consulting@liffey-consulting.com",privacy:"privacy@liffey-consulting.com",legal:"legal@liffey-consulting.com"};
  if(data.website) return reply(200,{ok:true});
  if(name.length<2||name.length>120||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||message.length<10||message.length>5000||!Object.hasOwn(topics,topic)||data.consent!==true) return reply(400,{error:"invalid_fields"});
  const ip=request.headers.get("CF-Connecting-IP")||"";
  const challenge=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:env.TURNSTILE_SECRET,response:String(data.token||""),remoteip:ip})});
  if(!challenge.ok)return reply(403,{error:"verification_failed"});const result=await challenge.json();if(!result.success || !["www.liffey-consulting.com","liffey-consulting.com"].includes(result.hostname) || result.action!=="contact")return reply(403,{error:"verification_failed"});
  const send=async(to,subject,text,replyTo)=>fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":"Bearer "+env.RESEND_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({from:env.FROM_EMAIL,to:[to],subject,text,...(replyTo?{reply_to:replyTo}:{})})});
  const safe=s=>s.replace(/[\r\n]/g," ").slice(0,200);
  const inbox=await send(topics[topic],"Website enquiry: "+safe(topic),`Topic: ${topic}\nName: ${name}\nEmail: ${email}\nLanguage: ${locale}\n\n${message}`,email);
  if(!inbox.ok){console.error("Inbound delivery failed",inbox.status);return reply(502,{error:"delivery_failed"})}
  // Acknowledgement is best-effort; do not misrepresent its failure as a failed submission.
  const acknowledgement=locale==="de"?"Vielen Dank für Ihre Nachricht. Wir haben Ihre Anfrage erhalten und melden uns so bald wie möglich.":"Thank you for contacting Liffey Consulting. We received your enquiry and will respond as soon as possible.";
  const auto=await send(email,locale==="de"?"Ihre Anfrage bei Liffey Consulting":"Your enquiry to Liffey Consulting",acknowledgement+"\n\nLiffey Consulting");
  if(!auto.ok)console.error("Acknowledgement delivery failed",auto.status);
  return reply(200,{ok:true});
 }
};