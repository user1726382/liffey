/* Contact form integration: the button remains disabled until a real Turnstile site key is configured. */
(()=>{
 const cfg=window.LIFFEY_CONTACT_CONFIG||{},form=document.getElementById("liffey-enquiry");
 if(!form)return;
 const status=document.getElementById("liffey-form-status"),button=form.querySelector('button[type="submit"]'),de=cfg.locale==="de";
 const say=(en,deText)=>{status.textContent=de?deText:en};
 if(!cfg.siteKey||cfg.siteKey.startsWith("REPLACE_")){say("Contact form is being configured. Please email info@liffey-consulting.com.","Kontaktformular wird eingerichtet. Bitte schreiben Sie an info@liffey-consulting.com.");return}
 const script=document.createElement("script");script.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";script.async=true;script.defer=true;
 script.onload=()=>{
  if(!window.turnstile){say("Verification unavailable.","Verifizierung nicht verfügbar.");return}
  window.turnstile.render("#liffey-turnstile",{sitekey:cfg.siteKey,action:"contact",callback:()=>{button.disabled=false}, "expired-callback":()=>{button.disabled=true}});
 };
 script.onerror=()=>say("Verification unavailable.","Verifizierung nicht verfügbar.");
 document.head.appendChild(script);
 form.addEventListener("submit",async e=>{
  e.preventDefault();if(button.disabled)return;
  const data=new FormData(form),token=window.turnstile?.getResponse();
  if(!token){say("Complete spam verification.","Bitte Spam-Schutz bestätigen.");return}
  button.disabled=true;say("Sending…","Wird gesendet…");
  try{
   const resp=await fetch(cfg.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:data.get("name"),email:data.get("email"),topic:data.get("topic"),message:data.get("message"),website:data.get("website"),locale:cfg.locale,consent:data.get("consent")==="on",token})});
   const result=await resp.json();
   if(!resp.ok||!result.ok)throw new Error("submission_failed");
   form.reset();say("Thank you. Your enquiry was submitted.","Vielen Dank. Ihre Anfrage wurde übermittelt.");
  }catch{say("Delivery failed. Please email info@liffey-consulting.com.","Versand fehlgeschlagen. Bitte schreiben Sie an info@liffey-consulting.com.")}
  finally{window.turnstile?.reset();button.disabled=true}
 });
})();
