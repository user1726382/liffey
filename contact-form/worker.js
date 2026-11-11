// Cloudflare Worker contact endpoint. Deploy only after legal/security approval.
// Required secrets: RESEND_API_KEY, TURNSTILE_SECRET_KEY
// Required vars: ALLOWED_ORIGIN, MAIL_FROM (verified sender), CONTACT_TO
const json=(obj,status=200,headers={})=>new Response(JSON.stringify(obj),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store",...headers}});
const clean=(x,max)=>typeof x==="string"?x.trim().slice(0,max):"";
const escapeHtml=s=>s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export default {
 async fetch(request,env){
  const origin=request.headers.get("Origin")||"";
  const allowed=env.ALLOWED_ORIGIN;
  const cors=origin===allowed?{"Access-Control-Allow-Origin":allowed,"Vary":"Origin"}:{};
  if(request.method==="OPTIONS")return origin===allowed?new Response(null,{status:204,headers:{"Access-Control-Allow-Origin":allowed,"Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type","Access-Control-Max-Age":"600","Vary":"Origin"}}):new Response(null,{status:403});
  if(request.method!=="POST")return json({error:"Method not allowed"},405,cors);
  if(!allowed||origin!==allowed)return json({error:"Origin not allowed"},403);
  if(!env.RESEND_API_KEY||!env.TURNSTILE_SECRET_KEY||!env.MAIL_FROM||!env.CONTACT_TO)return json({error:"Service unavailable"},503,cors);
  if(Number(request.headers.get("content-length")||0)>12000)return json({error:"Request too large"},413,cors);
  let body;try{body=await request.json()}catch{return json({error:"Invalid request"},400,cors)}
  const name=clean(body.name,120),email=clean(body.email,254),topic=clean(body.topic,80),message=clean(body.message,4000);
  if(body.website)return json({ok:true},200,cors); // honeypot
  if(!name||name.length<2||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!["recruitment","market-entry","marketing","general"].includes(topic)||message.length<10||message.length>4000)return json({error:"Please check the fields"},400,cors);
  const token=clean(body.turnstileToken,2048);
  if(!token)return json({error:"Spam verification required"},400,cors);
  const form=new FormData();form.set("secret",env.TURNSTILE_SECRET_KEY);form.set("response",token);
  const ip=request.headers.get("CF-Connecting-IP");if(ip)form.set("remoteip",ip);
  let verification;try{const r=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{method:"POST",body:form});verification=await r.json()}catch{return json({error:"Verification unavailable"},503,cors)}
  if(!verification.success)return json({error:"Spam verification failed"},400,cors);
  // The sender must be a verified domain/address at the email service.
  const html="<h2>New Liffey Consulting enquiry</h2><p><b>Name:</b> "+escapeHtml(name)+"</p><p><b>Email:</b> "+escapeHtml(email)+"</p><p><b>Topic:</b> "+escapeHtml(topic)+"</p><p style='white-space:pre-wrap'>"+escapeHtml(message)+"</p>";
  let response;try{response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":"Bearer "+env.RESEND_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({from:env.MAIL_FROM,to:[env.CONTACT_TO],reply_to:email,subject:"Liffey enquiry: "+topic,html})})}catch{return json({error:"Delivery unavailable"},502,cors)}
  if(!response.ok)return json({error:"Delivery failed"},502,cors);
  return json({ok:true},200,cors);
 }
};
