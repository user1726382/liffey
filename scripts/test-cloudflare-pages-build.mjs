import assert from "node:assert/strict";
import { readdir, stat, readFile } from "node:fs/promises";
import { join, extname } from "node:path";
const output=join(process.cwd(),"dist");
async function exists(p){try{await stat(join(output,p));return true}catch{return false}}
for(const path of ["index.html","404.html","robots.txt","sitemap.xml","legal/de/impressum.html","legal/en/privacy.html","assets/contact-form.js","roles/roles.json","_headers",".well-known/security.txt"]){
 assert.ok(await exists(path),"Required public file missing: "+path);
}
for(const path of [".github","contact-worker","scripts","LAUNCH_CHECKLIST.md","roles/README.md","CNAME","compliance"]){
 assert.equal(await exists(path),false,"Internal file/directory must not be published: "+path);
}
let count=0;
async function scan(dir){
 for(const entry of await readdir(join(output,dir),{withFileTypes:true})){
  const rel=join(dir,entry.name);
  if(entry.isDirectory())await scan(rel);
  else{
   count++;
   assert.ok(![".md",".env",".yaml",".yml",".toml",".py",".sh"].includes(extname(entry.name).toLowerCase()),"Unexpected file extension: "+rel);
   assert.ok(!entry.name.startsWith(".") || rel===".well-known/security.txt","Unexpected hidden file: "+rel);
  }
 }
}
await scan("");
assert.ok(count>=50,"Unexpectedly small static output: "+count);
const headers=await readFile(join(output,"_headers"),"utf8");
assert.match(headers,/Content-Security-Policy: base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'/);
const disclosure=await readFile(join(output,".well-known/security.txt"),"utf8");
assert.match(disclosure,/Contact: mailto:security@liffey-consulting\.com/);
assert.match(disclosure,/Canonical: https:\/\/www\.liffey-consulting\.com\/\.well-known\/security\.txt/);
assert.match(disclosure,/Expires: 2027-05-19T23:59:00Z/);
for(const file of ["robots.txt","sitemap.xml"]){
 const content=await readFile(join(output,file),"utf8");
 if(!(process.env.LIFFEY_PAGES_STAGING==="1" && file==="robots.txt")) assert.ok(content.includes("https://www.liffey-consulting.com"),"Canonical domain missing in "+file);
 assert.ok(!content.includes("user1726382.github.io/website"),"Legacy domain leaked in "+file);
}
if(process.env.LIFFEY_PAGES_STAGING==="1"){
 const homepage=await readFile(join(output,"index.html"),"utf8");
 assert.ok(homepage.includes('<meta name="robots" content="noindex,nofollow">'),"Staging homepage must be noindex");
 assert.match(headers,/X-Robots-Tag: noindex, nofollow/);
 const robots=await readFile(join(output,"robots.txt"),"utf8");
 assert.equal(robots,"User-agent: *\nDisallow: /\n");
 for(const path of ["contact/index.html","de/kontakt/index.html"]){
  const html=await readFile(join(output,path),"utf8");
  assert.match(html,/<form id="liffey-enquiry" inert aria-disabled="true"/);
  assert.ok(!html.includes("liffey-contact-form.leoedwalshe.workers.dev"),"Production Worker URL exposed in staging: "+path);
  assert.match(html,/siteKey:""/);
  assert.match(html,/form is disabled|Formular ist deaktiviert/);
 }
 for(const path of ["legal/en/imprint.html","legal/de/impressum.html","legal/en/privacy.html","legal/de/datenschutz.html"]){
  const html=await readFile(join(output,path),"utf8");
  assert.ok(html.includes("Gustav-Adolf-Straße 13, 63069 Offenbach am Main"),"Confirmed address absent: "+path);
 }
}

console.log("Validated "+count+" public output files, security headers, disclosure metadata and canonical SEO URLs; internal repository files excluded.");
