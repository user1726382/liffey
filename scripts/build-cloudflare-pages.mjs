// Build an explicit public-only static output for Cloudflare Pages.
// Never point Pages at the repository root: it contains internal docs and Worker source.
import { copyFile, mkdir, readdir, rm, writeFile, readFile } from "node:fs/promises";
import { extname, join, relative, dirname } from "node:path";

const root=process.cwd(), output=join(root,"dist");
const publicDirs=["about","assets","blog","consulting","contact","de","employers","insights","legal","news","roles","salary-guide","working-in-ireland"];
const publicRootFiles=["index.html","404.html","robots.txt","sitemap.xml"];
const publicExt=new Set([".html",".css",".js",".json",".svg",".png",".jpg",".jpeg",".webp",".gif",".avif",".ico",".woff",".woff2",".txt",".xml"]);
let count=0;
async function copyPublicFile(rel){
 const src=join(root,rel),dest=join(output,rel);
 await mkdir(dirname(dest),{recursive:true});
 await copyFile(src,dest);count++;
}
async function walk(rel){
 for(const entry of await readdir(join(root,rel),{withFileTypes:true})){
  const path=join(rel,entry.name);
  if(entry.isSymbolicLink())throw new Error("Refusing symbolic link in public tree: "+path);
  if(entry.isDirectory()){
   if(entry.name.startsWith("."))continue;
   await walk(path);
  }else if(entry.isFile() && !entry.name.startsWith(".") && publicExt.has(extname(entry.name).toLowerCase())){
   await copyPublicFile(path);
  }
 }
}
await rm(output,{recursive:true,force:true});
for(const file of publicRootFiles)await copyPublicFile(file);
for(const dir of publicDirs)await walk(dir);
// Headers only for Pages; test them with a preview deployment before DNS cutover.
await writeFile(join(output,"_headers"),`/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'
`);

// Publish security disclosure metadata only in the public build, never secrets.
await mkdir(join(output,".well-known"),{recursive:true});
await writeFile(join(output,".well-known","security.txt"),`Contact: mailto:security@liffey-consulting.com
Expires: 2027-05-19T23:59:00Z
Canonical: https://www.liffey-consulting.com/.well-known/security.txt
Preferred-Languages: en, de
`);

// The source still contains the old GitHub Pages preview domain.
// Rewrite only these exact historic absolute URLs in the built sitemap/robots.
const oldBase="https://user1726382.github.io/website";
const newBase="https://www.liffey-consulting.com";
for(const name of ["robots.txt","sitemap.xml"]){
 const file=join(output,name),before=await readFile(file,"utf8");
 if(!before.includes(oldBase))throw new Error(name+": expected legacy hostname not found; review before changing migration transform");
 await writeFile(file,before.replaceAll(oldBase,newBase));
}

// Staging-only protection: public preview must not be indexed or send contact requests.
if(process.env.LIFFEY_PAGES_STAGING==="1"){
 const headersPath=join(output,"_headers");
 await writeFile(headersPath,(await readFile(headersPath,"utf8"))+"  X-Robots-Tag: noindex, nofollow\n");
 await writeFile(join(output,"robots.txt"),"User-agent: *\nDisallow: /\n");
 for(const [page,locale] of [["contact/index.html","en"],["de/kontakt/index.html","de"]]){
  const file=join(output,page);
  let html=await readFile(file,"utf8");
  if(!html.includes('<form id="liffey-enquiry"'))throw new Error("Staging form missing: "+page);
  if(!html.includes("https://liffey-contact-form.leoedwalshe.workers.dev"))throw new Error("Staging Worker URL not found: "+page);
  html=html.replace('<form id="liffey-enquiry"','<form id="liffey-enquiry" inert aria-disabled="true"');
  html=html.replace(/<script>window\.LIFFEY_CONTACT_CONFIG=\{[^<]*\};<\/script>/,
   '<script>window.LIFFEY_CONTACT_CONFIG={endpoint:"",siteKey:"",locale:"'+locale+'"};</script>');
  html=html.replace('<h2>'+(locale==="de"?"Kontaktformular":"Contact form")+'</h2>',
   '<h2>'+(locale==="de"?"Kontaktformular":"Contact form")+'</h2><p role="status"><strong>'+
   (locale==="de"?"Vorschau: Dieses Formular ist deaktiviert.":"Staging preview: this form is disabled.")+
   '</strong></p>');
  await writeFile(file,html);
 }
}

console.log("Cloudflare Pages build: copied "+count+" public files into "+relative(root,output));
