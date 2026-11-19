import assert from "node:assert/strict";
import { readdir, stat } from "node:fs/promises";
import { join, extname } from "node:path";
const output=join(process.cwd(),"dist");
async function exists(p){try{await stat(join(output,p));return true}catch{return false}}
for(const path of ["index.html","404.html","robots.txt","sitemap.xml","legal/de/impressum.html","legal/en/privacy.html","assets/contact-form.js","roles/roles.json","_headers"]){
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
   assert.ok(!entry.name.startsWith(".") || entry.name==="_headers","Unexpected hidden file: "+rel);
  }
 }
}
await scan("");
assert.ok(count>=50,"Unexpectedly small static output: "+count);
console.log("Validated "+count+" public output files; internal repository files excluded.");
