import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source=await readFile(new URL("./worker.js",import.meta.url),"utf8");
const {default:worker}=await import("data:text/javascript;base64,"+Buffer.from(source).toString("base64"));

const valid={name:"Test User",email:"test@example.com",message:"A sufficiently long business enquiry.",topic:"general",locale:"en",website:"",consent:true,token:"test-token"};
const env=(limiter=async()=>({success:true}))=>({
 FORM_ENABLED:"true",TURNSTILE_SECRET:"test-secret",RESEND_API_KEY:"test-api-key",FROM_EMAIL:"noreply@example.com",
 CONTACT_RATE_LIMITER:{limit:limiter}
});
const request=(body=valid,headers={})=>new Request("https://example.workers.dev/",{
 method:"POST",headers:{"Origin":"https://www.liffey-consulting.com","Content-Type":"application/json","CF-Connecting-IP":"192.0.2.10",...headers},
 body:typeof body==="string"?body:JSON.stringify(body)
});
async function invoke(body=valid,config={}){
 const calls=[];let emails=0;
 const original=globalThis.fetch;
 globalThis.fetch=async (url)=>{
  const target=String(url);calls.push(target);
  if(target.includes("/siteverify")){
   if(config.turnstileThrow)throw new Error("Turnstile unavailable");
   if(config.turnstileStatus)return new Response("{}",{status:config.turnstileStatus});
   if(config.turnstileMalformed)return new Response("invalid-json",{status:200});
   return new Response(JSON.stringify({success:config.turnstileSuccess!==false,hostname:"www.liffey-consulting.com",action:"contact"}),{status:200,headers:{"Content-Type":"application/json"}});
  }
  if(target==="https://api.resend.com/emails"){emails++;if((emails===1&&config.inboxThrow)||(emails===2&&config.ackThrow))throw new Error("Resend unavailable");return new Response("{}",{status:emails===1?(config.inboxStatus||200):(config.ackStatus||200)});}
  throw new Error("Unexpected outbound request: "+target);
 };
 try{
  const response=await worker.fetch(request(body,config.headers),config.workerEnv||env());
  return {status:response.status,data:await response.json(),calls,emails};
 }finally{globalThis.fetch=original;}
}
test("valid enquiry is verified and delivered",async()=>{
 const r=await invoke();assert.equal(r.status,200);assert.equal(r.data.ok,true);assert.equal(r.emails,2);
});
test("rate limit blocks before Turnstile and Resend",async()=>{
 let key;const r=await invoke(valid,{workerEnv:env(async ({key:k})=>{key=k;return {success:false};})});
 assert.equal(r.status,429);assert.equal(r.data.error,"rate_limited");assert.equal(key,"192.0.2.10");assert.equal(r.calls.length,0);
});
test("missing rate limit binding fails closed",async()=>{
 const e=env();delete e.CONTACT_RATE_LIMITER;
 const r=await invoke(valid,{workerEnv:e});assert.equal(r.status,503);assert.equal(r.calls.length,0);
});
test("rate limit service exception fails closed",async()=>{
 const r=await invoke(valid,{workerEnv:env(async()=>{throw new Error("service down");})});
 assert.equal(r.status,503);assert.equal(r.data.error,"temporarily_unavailable");assert.equal(r.calls.length,0);
});
test("invalid origin is rejected",async()=>{
 const r=await invoke(valid,{headers:{Origin:"https://evil.example"}});assert.equal(r.status,403);assert.equal(r.calls.length,0);
});
test("invalid JSON and non-object JSON are rejected",async()=>{
 for(const input of ["{","null","[]"]){const r=await invoke(input);assert.equal(r.status,400);assert.equal(r.calls.length,0);}
});
test("body size is enforced even without Content-Length",async()=>{
 const r=await invoke({...valid,message:"x".repeat(13000)});
 assert.equal(r.status,413);assert.equal(r.calls.length,0);
});
test("failed Turnstile does not send email",async()=>{
 const r=await invoke(valid,{turnstileSuccess:false});assert.equal(r.status,403);assert.equal(r.emails,0);
});
test("failed inbound delivery returns 502",async()=>{
 const r=await invoke(valid,{inboxStatus:503});assert.equal(r.status,502);assert.equal(r.emails,1);
});
test("failed acknowledgement does not misrepresent successful inbound delivery",async()=>{
 const r=await invoke(valid,{ackStatus:503});assert.equal(r.status,200);assert.equal(r.data.ok,true);assert.equal(r.emails,2);
});

test("unsupported media type is rejected before parsing or external calls",async()=>{
 const r=await invoke(valid,{headers:{"Content-Type":"text/plain"}});
 assert.equal(r.status,415);assert.equal(r.calls.length,0);
});
test("missing or oversized Turnstile token is rejected without external calls",async()=>{
 for(const token of ["", "x".repeat(2049)]){
  const r=await invoke({...valid,token});
  assert.equal(r.status,400);assert.equal(r.calls.length,0);
 }
});
test("Turnstile network, HTTP and malformed-response failures fail closed",async()=>{
 for(const options of [{turnstileThrow:true},{turnstileStatus:503},{turnstileMalformed:true}]){
  const r=await invoke(valid,options);
  assert.equal(r.status,503);assert.equal(r.data.error,"verification_unavailable");assert.equal(r.emails,0);
 }
});
test("Resend inbound network failure returns 502 without a false success",async()=>{
 const r=await invoke(valid,{inboxThrow:true});
 assert.equal(r.status,502);assert.equal(r.data.error,"delivery_failed");assert.equal(r.emails,1);
});
test("Resend acknowledgement network failure preserves successful inbound delivery",async()=>{
 const r=await invoke(valid,{ackThrow:true});
 assert.equal(r.status,200);assert.equal(r.data.ok,true);assert.equal(r.emails,2);
});
