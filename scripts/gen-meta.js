// files.json + meta.json + sitemap.xml — एक ही script (workflow में भी यही चलती है)
const fs=require("fs"),path=require("path"),cp=require("child_process");
function walk(d,a){if(!fs.existsSync(d))return a;for(const n of fs.readdirSync(d)){const f=path.join(d,n);if(fs.statSync(f).isDirectory())walk(f,a);else a.push(f.split(path.sep).join("/"));}return a;}
let files=[];walk("tests",files);walk("notes",files);
files=files.filter(p=>{const l=p.toLowerCase();return /^tests\/.+\.html?$/.test(l)||/^notes\/.+\.(html?|pdf)$/.test(l);});
files.sort();
fs.writeFileSync("files.json",JSON.stringify(files)+"\n");
function addedDate(p){
  try{ const out=cp.execSync(`git log --diff-filter=A --format=%cI --follow -- "${p.replace(/"/g,'\\"')}"`,{encoding:"utf8"}).trim().split("\n").filter(Boolean); const d=out[out.length-1]; return d?d.slice(0,10):null; }catch(e){ return null; }
}
const meta={generated:new Date().toISOString().slice(0,10),files:{}};
for(const p of files){
  const m={added:addedDate(p)};
  if(/\.html?$/i.test(p)){
    const src=fs.readFileSync(p,"utf8");
    const i=src.indexOf("const TEST = {");
    if(i>=0){
      const start=i+"const TEST = ".length; const end=src.indexOf("\n",start);
      let line=src.slice(start,end<0?undefined:end).trim(); if(line.endsWith(";"))line=line.slice(0,-1);
      try{ const T=JSON.parse(line); m.kind="test"; m.id=T.testId||null; m.title=T.shortTitle||T.title||null; m.q=Array.isArray(T.questions)?T.questions.length:0; m.min=T.durationMinutes||null; m.marks=T.marksPerQuestion??null; m.neg=T.negativeMarks??null; m.bi=!!(T.questions&&T.questions[0]&&T.questions[0].question_en); }catch(e){ m.kind="test"; }
    } else { m.kind="chapter"; }
  } else { m.kind="pdf"; }
  meta.files[p]=m;
}
fs.writeFileSync("meta.json",JSON.stringify(meta)+"\n");
const host="https://bodhiclasses.org";
const enc=p=>host+"/"+p.split("/").map(encodeURIComponent).join("/");
const urls=[`<url><loc>${host}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`].concat(files.map(p=>`<url><loc>${enc(p)}</loc>${meta.files[p].added?`<lastmod>${meta.files[p].added}</lastmod>`:""}<changefreq>monthly</changefreq><priority>0.7</priority></url>`));
fs.writeFileSync("sitemap.xml",`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
console.log("files:",files.length,"tests:",Object.values(meta.files).filter(x=>x.kind==="test").length,"questions:",Object.values(meta.files).reduce((s,x)=>s+(x.q||0),0));
