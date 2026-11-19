import test from "node:test";
import assert from "node:assert/strict";
import {evaluate} from "./check-mail-auth.mjs";
const valid={
 spfTxt:["v=spf1 include:spf.protection.outlook.com ~all"],
 dmarcTxt:["v=DMARC1; p=none; pct=100"],
 mx:[{exchange:"liffeyconsulting-com01e.mail.protection.outlook.com",priority:0}],
 dkim:{selector1:["selector1-liffeyconsulting-com01e._domainkey.liffeyconsulting.k-v1.dkim.mail.microsoft"],selector2:["selector2-liffeyconsulting-com01e._domainkey.liffeyconsulting.k-v1.dkim.mail.microsoft"]}
};
test("valid Microsoft 365 mail DNS passes, with DMARC monitoring warning",()=>{
 const r=evaluate(valid);assert.equal(r.passed,true);assert.ok(r.warnings.some(x=>x.includes("p=none")));
});
test("duplicate SPF fails",()=>{
 const r=evaluate({...valid,spfTxt:[...valid.spfTxt,"v=spf1 -all"]});
 assert.equal(r.passed,false);assert.equal(r.checks[0].status,"FAIL");
});
test("missing selector fails",()=>{
 const r=evaluate({...valid,dkim:{...valid.dkim,selector2:[]}});
 assert.equal(r.passed,false);assert.equal(r.checks.find(x=>x.name.includes("selector2")).status,"FAIL");
});
test("missing DMARC fails",()=>{
 assert.equal(evaluate({...valid,dmarcTxt:[]}).passed,false);
});
test("reject DMARC removes monitoring-only warning",()=>{
 const r=evaluate({...valid,dmarcTxt:["v=DMARC1; p=reject"]});
 assert.equal(r.passed,true);assert.ok(!r.warnings.some(x=>x.includes("p=none")));
});
test("unauthorized MX fails",()=>{
 assert.equal(evaluate({...valid,mx:[{exchange:"mx.attacker.invalid"}]}).passed,false);
});
