import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source=await readFile(new URL("./worker.js",import.meta.url),"utf8");
const {default:worker}=await import("data:text/javascript;base64,"+Buffer.from(source).toString("base64"));

const valid={name:"Sensitive Test Name",email:"sensitive-test@example.com",message:"Confidential enquiry details.",topic:"general",locale:"en",website:"",consent:true,token:"fake-test-token"};
const env={FORM_ENABLED:"true",TURNSTILE_SECRET:"fake",RESEND_API_KEY:"fake",FROM_EMAIL:"noreply@example.com",CONTACT_RATE_LIMITER:{limit:async()=>({success:true})}};
const req=(origin="https://www.liffey-consulting.com",body=valid)=>new Request("https://worker.example/",{method:"POST",headers:{Origin:origin,"Content-Type":"application/json"},body:JSON.stringify(body)});
async function capture(request,environment){
 const entries=[];
 const oldWarn=console.warn,oldError=console.error;
 console.warn=(...args)=>entries.push({level:"warn",args});
 console.error=(...args)=>entries.push({level:"error",args});
 try{
  const response=await worker.fetch(request,environment);
  return {status:response.status,entries};
 }finally{console.warn=oldWarn;console.error=oldError;}
}
test("invalid origin emits only controlled status and error code",async()=>{
 const r=await capture(req("https://untrusted.example"),env);
 assert.equal(r.status,403);
 assert.equal(r.entries.length,1);
 assert.deepEqual(JSON.parse(r.entries[0].args[0]),{event:"contact_form_failure",status:403,code:"origin"});
 assert.ok(!JSON.stringify(r.entries).includes("Sensitive Test Name"));
 assert.ok(!JSON.stringify(r.entries).includes("sensitive-test@example.com"));
 assert.ok(!JSON.stringify(r.entries).includes("Confidential enquiry details"));
});
test("missing configuration emits coarse 503 without secrets",async()=>{
 const r=await capture(req(),{FORM_ENABLED:"false",RESEND_API_KEY:"super-secret"});
 assert.equal(r.status,503);
 assert.equal(r.entries.length,1);
 assert.deepEqual(JSON.parse(r.entries[0].args[0]),{event:"contact_form_failure",status:503,code:"not_configured"});
 assert.ok(!JSON.stringify(r.entries).includes("super-secret"));
});
test("honeypot success emits no error event",async()=>{
 const r=await capture(req(undefined,{...valid,website:"honeypot"}),env);
 assert.equal(r.status,200);
 assert.equal(r.entries.length,0);
});
