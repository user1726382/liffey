import { Resolver } from "node:dns/promises";
import { pathToFileURL } from "node:url";

export const domain="liffey-consulting.com";
export const selectors=["selector1","selector2"];

export function evaluate({spfTxt=[],dmarcTxt=[],mx=[],dkim={}}){
 const checks=[];
 const add=(name,pass,detail)=>checks.push({name,status:pass?"PASS":"FAIL",detail});
 const spf=spfTxt.filter(x=>/^v=spf1(?:\s|$)/i.test(x.trim()));
 add("SPF exactly one",spf.length===1,"Count: "+spf.length);
 add("SPF authorizes Microsoft 365",spf.length===1 && /(?:^|\s)include:spf\.protection\.outlook\.com(?:\s|$)/i.test(spf[0]||""),"Microsoft 365 SPF include");
 add("SPF does not allow all",spf.length===1 && !/(?:^|\s)\+all(?:\s|$)/i.test(spf[0]||""),"No +all mechanism");
 const dmarc=dmarcTxt.filter(x=>/^v=DMARC1(?:;|\s|$)/i.test(x.trim()));
 add("DMARC exactly one",dmarc.length===1,"Count: "+dmarc.length);
 const policy=dmarc[0]?.match(/(?:^|;)\s*p\s*=\s*(none|quarantine|reject)\b/i)?.[1]?.toLowerCase();
 add("DMARC policy valid",Boolean(policy),policy||"missing");
 for(const selector of selectors){
  const targets=dkim[selector]||[];
  add("Microsoft DKIM CNAME "+selector,targets.length===1 && /\.dkim\.mail\.microsoft\.?$/i.test(targets[0]),targets.length===1?"Target is Microsoft DKIM":"Missing, duplicate or unexpected target");
 }
 add("Microsoft 365 MX",mx.some(x=>/\.mail\.protection\.outlook\.com\.?$/i.test(x.exchange||"")),"Microsoft 365 MX present");
 return {checks,warnings:[...(policy==="none"?["DMARC policy is monitoring-only (p=none); assess alignment and reports before enforcement."]:[]),"DNSSEC and DKIM signing status cannot be established by DNS CNAME checks alone; verify registrar DS and Microsoft 365 DKIM status separately."],passed:checks.every(x=>x.status==="PASS")};
}

async function query(resolve,description){
 for(let attempt=0;attempt<3;attempt++){
  try{return await resolve();}catch(e){
   if(e?.code==="ENODATA"||e?.code==="ENOTFOUND")return [];
   if(attempt===2)throw new Error(description+": "+String(e?.code||e?.message||e));
   await new Promise(r=>setTimeout(r,500*(attempt+1)));
  }
 }
}
export async function inspect(){
 const dns=new Resolver();
 const [spf,dmarc,mx,first,second]=await Promise.all([
  query(()=>dns.resolveTxt(domain),"SPF"),
  query(()=>dns.resolveTxt("_dmarc."+domain),"DMARC"),
  query(()=>dns.resolveMx(domain),"MX"),
  query(()=>dns.resolveCname("selector1._domainkey."+domain),"selector1"),
  query(()=>dns.resolveCname("selector2._domainkey."+domain),"selector2")
 ]);
 return evaluate({spfTxt:spf.map(x=>x.join("")),dmarcTxt:dmarc.map(x=>x.join("")),mx,dkim:{selector1:first,selector2:second}});
}

if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href){
 try{
  const report=await inspect();
  console.log(JSON.stringify({domain,checkedAt:new Date().toISOString(),...report},null,2));
  if(!report.passed)process.exitCode=1;
 }catch(e){console.error("DNS mail authentication audit failed:",e.message);process.exitCode=2;}
}
