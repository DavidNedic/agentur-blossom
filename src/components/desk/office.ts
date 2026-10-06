// @ts-nocheck
// Virtual office for the Promet desk: graphite desk surface with real time-of-day light,
// window blinds, clouds, dust, passing car lights at night, a living desk
// (coffee, laptop sleep, phone pings, greeting by time) and Higgsfield 3D props (three.js).
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import type { DeskPhysics } from "./physics";

export function createOffice(bgCanvas: HTMLCanvasElement, deskEl: HTMLElement, physics?: DeskPhysics) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let dead = false;
  const extra: HTMLElement[] = [], tms: any[] = [], ints: any[] = [], offs: (() => void)[] = [];
  const _st = (f: any, ms?: number) => { const id = setTimeout(() => { if (!dead) f(); }, ms); tms.push(id); return id; };
  const _si = (f: any, ms?: number) => { const id = setInterval(() => { if (!dead) f(); }, ms); ints.push(id); return id; };
  const _on = (t: string, f: any, o?: any) => { window.addEventListener(t, f, o); offs.push(() => window.removeEventListener(t, f, o)); };
  const _don = (t: string, f: any) => { document.addEventListener(t, f); offs.push(() => document.removeEventListener(t, f)); };
  // living desk
  // ---- living desk: coffee, laptop, phone, greeting by time of day ----
  window.__tod=(()=>{
    const root=document.documentElement;
    const cup=document.querySelector('.o-cup');if(cup){const s=document.createElement('span');s.className='steam';s.innerHTML='<i></i><i></i><i></i>';cup.appendChild(s);extra.push(s);}
    const lapScr=document.querySelector('.o-lap .scr');if(lapScr){const z=document.createElement('div');z.className='zz';z.innerHTML='<svg viewBox="380 520 1030 1460" aria-hidden="true"><polygon points="420,560 507,1805 791,1504 1017,1941 1213,1842 996,1419 1370,1393"/></svg>';lapScr.appendChild(z);extra.push(z);}
    const ph=document.querySelector('.o-phone'),scr=ph&&ph.querySelector('.scr');let note;
    if(scr){note=document.createElement('div');note.className='note';scr.appendChild(note);extra.push(note);}
    const card=document.querySelector('.o-card'),top=card.querySelector('.top span'),h1=card.querySelector('h1'),bot=card.querySelector('.bot span');
    const COPY={
      jutro:{g:'Dobro jutro',a:'Hajde na',b:'kafu.',t:'Uz kafu pričamo o tvom poslu i ciljevima.<br>Onda pravimo sajt.'},
      dan:{g:'Dobar dan',a:'Hajde na',b:'sastanak.',t:'Prvo pričamo o tvom poslu i ciljevima.<br>Onda pravimo sajt.'},
      vece:{g:'Dobro veče',a:'Hajde sutra',b:'na sastanak.',t:'Javi se večeras, vidimo se sutra.<br>Prvo pričamo, onda pravimo sajt.'},
      noc:{g:'Kasno je',a:'Ostavi',b:'poruku.',t:'Odgovaram ujutru.<br>Onda idemo na sastanak.'}};
    const phase=T=>T>=5&&T<11?'jutro':T>=11&&T<17?'dan':T>=17&&T<22?'vece':'noc';
    let cur=null,lastShx=null;
    function apply(p){if(p===cur)return;cur=p;root.dataset.tod=p;const c=COPY[p];
      top.textContent=c.g;
      h1.innerHTML='<span>'+c.a+'</span><br><em><span>'+c.b+'</span></em>';
      h1.style.fontSize=p==='vece'?'calc(70px*var(--s))':'';
      bot.innerHTML=c.t;h1.setAttribute('aria-label',c.a+' '+c.b);}
    function shadows(T,day){const k=Math.min(1,Math.max(0,(T-6)/13));
      const x=day>.5?Math.round((1-2*k)*22):10, y=day>.5?Math.round(14+Math.abs(1-2*k)*-4+8):20;
      if(x!==lastShx){lastShx=x;root.style.setProperty('--shx',x+'px');root.style.setProperty('--shy',y+'px');}}
    // phone pings now and then
    const MSG=['online prodavnica','sajt za restoran','sistem za magacin','kasa za radnju','sajt za salon','rezervacije online'];let mi=0;
    function ping(){if(!ph||document.hidden)return;note.innerHTML='<small>Novi upit</small>'+MSG[mi++%MSG.length];
      ph.classList.add('ping','buzz');_st(()=>ph.classList.remove('buzz'),1100);_st(()=>ph.classList.remove('ping'),4200);}
    function sched(){_st(()=>{ping();sched();},(cur==='noc'?45000:22000)+Math.random()*14000);}
    _st(()=>{ping();sched();},6500);
    return {update(T){apply(phase(T));const day=(T>=6.5&&T<19.5)?1:0;shadows(T,day);},sleeping:()=>cur==='noc'};
  })();

  // ---- virtual office: walnut desk + real time-of-day light ----
  (()=>{
    const root=document.documentElement;
    const cv=bgCanvas;cv.id='bg';cv.setAttribute('aria-hidden','true');
    const lv=document.createElement('canvas');lv.id='lightfx';lv.setAttribute('aria-hidden','true');
    deskEl.after(lv);extra.push(lv);
    const opt={antialias:false,premultipliedAlpha:false};
    const gl=cv.getContext('webgl',opt),gl2=lv.getContext('webgl',opt);
    if(!gl||!gl2){root.dataset.bg='kontur';return;}
    const VS='attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
    const NOISE=`precision highp float;
float h1(float n){return fract(sin(n)*43758.5453);}
float h2(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*f*(f*(f*6.-15.)+10.);
  return mix(mix(h2(i),h2(i+vec2(1,0)),u.x),mix(h2(i+vec2(0,1)),h2(i+vec2(1,1)),u.x),u.y)*2.-1.;}
float fbm(vec2 p){float s=0.,a=.5;mat2 r=mat2(.8,.6,-.6,.8);for(int i=0;i<6;i++){s+=a*vn(p);p=r*p*2.02+17.;a*=.5;}return s;}
`;
    const WOOD=NOISE+`uniform vec2 R;uniform float D;uniform int M;
vec3 wood(vec2 p){
  float ph=230.;float id=floor(p.y/ph);float ly=p.y-id*ph;
  float sx=h1(id*7.13)*3000.;float len=1500.+h1(id*3.1)*900.;
  float jx=mod(p.x+sx,len);float bid=id*31.+floor((p.x+sx)/len);
  vec2 q=vec2(p.x+sx+h1(bid)*9000.,ly+h1(bid*1.7)*400.);
  float w=fbm(vec2(q.x*.0016,q.y*.012))*2.6+fbm(vec2(q.x*.006,q.y*.03))*.35;
  float r=fract(q.y*.034+w);
  float late=smoothstep(.55,.95,r)*(1.-smoothstep(.95,1.,r));
  float fib=vn(vec2(q.x*.012,q.y*.85))*.5+vn(vec2(q.x*.03,q.y*1.9))*.3;
  float pore=smoothstep(.62,.9,vn(vec2(q.x*.045,q.y*1.25)))*smoothstep(.2,.6,vn(vec2(q.x*.004,q.y*.05))*.5+.5);
  float fig=fbm(vec2(q.x*.0009,q.y*.004));
  vec3 early=vec3(.255,.165,.105),lw=vec3(.15,.092,.058),warm=vec3(.34,.22,.13);
  vec3 c=mix(early,warm,clamp(fig*.6+.35,0.,1.)*.55);
  c=mix(c,lw,late*.8);c*=1.+fib*.07;c=mix(c,lw*.7,pore*.55);c*=.92+h1(bid*2.3)*.16;
  float e=min(min(ly,ph-ly),min(jx,len-jx));c*=mix(.35,1.,smoothstep(.5,2.2,e));
  c+=vec3(.05,.035,.02)*(1.-smoothstep(2.,3.5,ly))*step(1.5,ly)*step(2.,min(jx,len-jx));
  return c;}
vec3 graphite(vec2 p){float lo=fbm(p*.0018)*.6+fbm(p*.007)*.25;float gr=vn(p*1.1)*.5+vn(p*2.7)*.3;
  return vec3(.19,.195,.21)*(1.+lo*.10+gr*.035);}
vec3 linen(vec2 p){vec2 q=p*vec2(1.,1.)+vec2(fbm(p*.01)*3.,fbm(p*.01+9.)*3.);
  float tx=sin(q.x*2.6)*.5+.5,ty=sin(q.y*2.6)*.5+.5;float over=step(.5,fract(floor(q.x/2.42)*.5+floor(q.y/2.42)*.5));
  float th=mix(tx,ty,over);float slub=vn(vec2(p.x*.05,p.y*1.3))*.5+vn(vec2(p.x*1.3,p.y*.05))*.5;
  float lo=fbm(p*.003);return vec3(.15,.148,.145)*(1.+(th-.5)*.16+slub*.07+lo*.08);}
vec3 cement(vec2 p){float a=fbm(p*.0022)*.7;vec2 r=mat2(.9,.43,-.43,.9)*p;float tr=fbm(vec2(r.x*.0035,r.y*.012))*.5;
  float sp=fbm(p*.03)*.25+vn(p*.9)*.12+vn(p*2.3)*.06;float spot=smoothstep(.55,.9,vn(p*.06))*.08;
  return vec3(.19,.188,.185)*(1.+a*.16+tr*.12+sp*.18-spot);}
void main(){vec2 p=gl_FragCoord.xy/D;p.y=R.y/D-p.y;vec3 c=M==0?graphite(p):M==1?cement(p):M==2?linen(p):wood(p);
gl_FragColor=vec4(c,1.);}`;
    const LIGHT=NOISE+`uniform vec2 R;uniform float D,T,S;uniform vec4 G;uniform vec2 LP;
float leaves(vec2 q){float s=0.;for(int i=0;i<10;i++){float fi=float(i);
  float a=-2.75+fi*.24+sin(S*.7+fi*1.7)*.035;float r=90.+h1(fi*3.7)*110.;
  vec2 dir=vec2(cos(a),sin(a));vec2 d=q-dir*r;vec2 e=vec2(dot(d,dir),dot(d,vec2(-dir.y,dir.x)));
  float L=length(e/vec2(58.+h1(fi)*20.,17.));s=max(s,1.-smoothstep(.75,1.25,L));
  float st=abs(dot(q,vec2(-dir.y,dir.x)));s=max(s,(1.-smoothstep(1.5,4.,st))*step(0.,dot(q,dir))*step(dot(q,dir),r-40.)*.8);}
  return s;}
float fbm3(vec2 p){return vn(p)*.55+vn(p*2.03+7.)*.28+vn(p*4.1+13.)*.14;}
float gSun;vec3 gSunC;
float dust(vec2 p){vec2 c=floor(p/64.);float h=h2(c);vec2 o=(vec2(.25)+.5*vec2(h2(c+5.),h2(c+9.))+.18*vec2(sin(S*.21+h*30.),cos(S*.17+h*21.)))*64.;
  float r=.7+h2(c+3.)*1.5;float d=length(p-c*64.-o);return (1.-smoothstep(r*.4,r,d))*(.45+.55*sin(S*1.1+h*40.))*step(.35,h);}
vec3 light(vec2 p,out float sunAmt){
  float Wd=R.x/D,Hd=R.y/D;
  float day=smoothstep(5.5,7.5,T)*(1.-smoothstep(18.,20.5,T));
  float gold=clamp(exp(-pow((T-7.4)/1.5,2.))+exp(-pow((T-18.4)/1.5,2.)),0.,1.);
  float k=clamp((T-6.)/13.,0.,1.);float skew=mix(.6,-.6,k);
  float x=p.x-(p.y-Hd*.5)*skew;float cx=mix(.05,.85,k)*Wd;float hw=Wd*(.16+.07*gold);
  float m=smoothstep(cx-hw-50.,cx-hw+50.,x)*(1.-smoothstep(cx+hw-50.,cx+hw+50.,x));
  m*=smoothstep(Hd*.0,Hd*.14,p.y)*(1.-smoothstep(Hd*.84,Hd*1.,p.y));
  m*=1.-.92*(1.-smoothstep(4.,16.,abs(x-cx)));
  float f=fract(p.y/31.+x*.0004);float sl=smoothstep(.12,.38,f)*(1.-smoothstep(.62,.88,f));
  m*=mix(.18,1.,sl);
  m*=1.-.85*leaves(vec2(x-(cx-hw*.55),p.y-Hd*.97));
  float cl=smoothstep(-.3,.35,fbm3(p*.0012+vec2(S*.02,S*.007)));
  float sun=m*day*(.75+.25*(1.-gold))*mix(.42,1.,cl);sunAmt=sun;gSun=sun;
  float ny=smoothstep(Hd*.0,Hd*.14,p.y)*(1.-smoothstep(Hd*.84,Hd*1.,p.y));
  float x2=p.x-(p.y-Hd*.5)*.4;float f2=fract(p.y/31.+x2*.0004);float sl2=mix(.15,1.,smoothstep(.12,.38,f2)*(1.-smoothstep(.62,.88,f2)));
  float p1=fract(S/13.),p2=fract(S/21.+.5);
  float car=step(p1,.3)*exp(-pow((x2-mix(-.25,1.25,p1/.3)*Wd)/150.,2.))*sin(3.1416*p1/.3)
           +step(p2,.22)*exp(-pow((x2-mix(1.25,-.25,p2/.22)*Wd)/120.,2.))*sin(3.1416*p2/.22)*.8;
  car*=ny*sl2*(1.-day);
  vec3 sunC=mix(vec3(1.,.95,.86),vec3(1.,.62,.34),gold);gSunC=sunC;
  vec3 amb=mix(vec3(.3,.34,.46),mix(vec3(1.05,1.04,1.02),vec3(.98,.86,.8),gold),day);
  vec2 lp=LP;float dl=length(p-lp)/max(Wd,Hd);
  float lamp=exp(-dl*dl*7.)*(1.-day)*1.35;vec3 lampC=vec3(1.,.74,.44);
  vec2 c=G.xy+G.zw*.5;vec2 dd=abs(p-c)-G.zw*.5;float sd=length(max(dd,0.))+min(max(dd.x,dd.y),0.);
  float glow=exp(-max(sd,0.)/90.)*(1.-day)*(G.z>0.?1.:0.);
  return amb+sunC*sun*1.05+lampC*lamp+vec3(.45,.68,1.)*glow+vec3(1.,.88,.72)*car*.75;}
`;
    const COMP=LIGHT+`uniform sampler2D W;
void main(){vec2 p=gl_FragCoord.xy/D;p.y=R.y/D-p.y;float s;
  vec3 c=texture2D(W,gl_FragCoord.xy/R).rgb*light(p,s);c+=gSunC*dust(p)*gSun*.35;
  vec2 v=p/(R/D)-.5;c*=1.-dot(v,v)*.55;c+=(h2(gl_FragCoord.xy+fract(S))-.5)/255.;gl_FragColor=vec4(c,1.);}`;
    const OVER=LIGHT+`void main(){vec2 p=gl_FragCoord.xy/D;p.y=R.y/D-p.y;float s;
  vec3 l=light(p,s);l+=gSunC*dust(p)*gSun*1.6;vec3 o=clamp(.5+(l-vec3(1.))*.42,0.,1.);gl_FragColor=vec4(o,1.);}`;
    function prog(g,fs){const sh=(t,s)=>{const o=g.createShader(t);g.shaderSource(o,s);g.compileShader(o);if(!g.getShaderParameter(o,g.COMPILE_STATUS))throw g.getShaderInfoLog(o);return o;};
      const p=g.createProgram();g.attachShader(p,sh(g.VERTEX_SHADER,VS));g.attachShader(p,sh(g.FRAGMENT_SHADER,fs));g.linkProgram(p);
      const b=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,b);g.bufferData(g.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),g.STATIC_DRAW);
      const u={};['R','D','T','S','G','W','M','LP'].forEach(n=>u[n]=g.getUniformLocation(p,n));return {p,u,a:g.getAttribLocation(p,'a'),b};}
    function use(g,P){g.useProgram(P.p);g.bindBuffer(g.ARRAY_BUFFER,P.b);g.enableVertexAttribArray(P.a);g.vertexAttribPointer(P.a,2,g.FLOAT,false,0,0);}
    let PW,PC,PO;try{PW=prog(gl,WOOD);PC=prog(gl,COMP);PO=prog(gl2,OVER);}catch(e){console.warn(e);root.dataset.bg='kontur';return;}
    const tex=gl.createTexture(),fbo=gl.createFramebuffer();
    let w=0,h=0,d=1,lw=0,lh=0,surf=0;
    function bake(){d=Math.min(devicePixelRatio||1,1.25);w=Math.round(innerWidth*d);h=Math.round(innerHeight*d);cv.width=w;cv.height=h;
      gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
      [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER].forEach(x=>gl.texParameteri(gl.TEXTURE_2D,x,gl.NEAREST));
      [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T].forEach(x=>gl.texParameteri(gl.TEXTURE_2D,x,gl.CLAMP_TO_EDGE));
      gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tex,0);
      gl.viewport(0,0,w,h);use(gl,PW);gl.uniform2f(PW.u.R,w,h);gl.uniform1f(PW.u.D,d);gl.uniform1i(PW.u.M,surf);gl.drawArrays(gl.TRIANGLES,0,3);
      gl.bindFramebuffer(gl.FRAMEBUFFER,null);
      const ld=Math.min(1,d);lw=Math.round(innerWidth*ld*.5);lh=Math.round(innerHeight*ld*.5);lv.width=lw;lv.height=lh;}
    const lap=document.querySelector('.o-lap');
    let hours=null,live=true,fc=0;
    const nowH=()=>{const n=new Date();return n.getHours()+n.getMinutes()/60;};
    function frame(t){const T=live?nowH():hours,S=t/1000;
      const r=lap&&!window.__tod.sleeping()?lap.getBoundingClientRect():{left:0,top:0,width:0,height:0};
      gl.viewport(0,0,w,h);use(gl,PC);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);
      gl.uniform1i(PC.u.W,0);gl.uniform2f(PC.u.R,w,h);gl.uniform1f(PC.u.D,d);gl.uniform1f(PC.u.T,T);gl.uniform1f(PC.u.S,S);gl.uniform4f(PC.u.G,r.left,r.top,r.width,r.height*.62);const lpp=window.__lampPool||[innerWidth-260,innerHeight*.6];gl.uniform2f(PC.u.LP,lpp[0],lpp[1]);
      gl.drawArrays(gl.TRIANGLES,0,3);
      if((fc++)%2===0){const ld=lw/innerWidth;gl2.viewport(0,0,lw,lh);use(gl2,PO);gl2.uniform2f(PO.u.R,lw,lh);gl2.uniform1f(PO.u.D,ld);gl2.uniform1f(PO.u.T,T);gl2.uniform1f(PO.u.S,S);gl2.uniform4f(PO.u.G,r.left,r.top,r.width,r.height*.62);gl2.uniform2f(PO.u.LP,lpp[0],lpp[1]);
      gl2.drawArrays(gl2.TRIANGLES,0,3);}
      window.__T=T;window.__tod.update(T);root.style.setProperty('--night',(1-Math.min(1,Math.max(0,(T-5.5)/2))*(1-Math.min(1,Math.max(0,(T-18)/2.5)))).toFixed(3));}
    let last=0,run=true;
    function loop(t){if(!run||dead)return;if(t-last>50||reduce){last=t;frame(t);}if(!reduce)requestAnimationFrame(loop);}
    bake();requestAnimationFrame(loop);
    if(reduce)_si(()=>frame(performance.now()),60000);
    _on('resize',()=>{clearTimeout(window.__bk);window.__bk=_st(()=>{bake();frame(performance.now());},150);});
    _don('visibilitychange',()=>{if(document.hidden)run=false;else if(!run){run=true;requestAnimationFrame(loop);}});
    root.dataset.bg='office';
        surf=0;root.dataset.surf='graphit';bake();
  })();
  // 3D props
  (()=>{



const cv=document.createElement('canvas');cv.id='props3d';cv.setAttribute('aria-hidden','true');
(document.getElementById('lightfx')||deskEl).after(cv);extra.push(cv);
let renderer;try{renderer=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});}catch(e){cv.remove();return;}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
const scene=new THREE.Scene();
const cam=new THREE.PerspectiveCamera(28,1,.1,200);cam.up.set(0,0,-1);
// 1 unit = 100 css px on the desk plane
const catcher=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.42}));
catcher.rotation.x=-Math.PI/2;catcher.receiveShadow=true;scene.add(catcher);
const hemi=new THREE.HemisphereLight(0xffffff,0x3a2e26,1.1);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffffff,2.2);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
Object.assign(sun.shadow.camera,{left:-14,right:14,top:10,bottom:-10,near:.5,far:60});sun.shadow.bias=-.0004;sun.shadow.radius=6;scene.add(sun,sun.target);
const fill=new THREE.PointLight(0xffb070,0,8,1.5);scene.add(fill);
const bulb=new THREE.SpotLight(0xffc48a,0,14,Math.PI/3.2,.6,1.2);bulb.castShadow=true;bulb.shadow.mapSize.set(512,512);bulb.shadow.bias=-.0005;scene.add(bulb,bulb.target);
const M=(c,r=.8,m=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});
const cast=o=>{o.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true;}});return o;};
// ---------- procedural fallbacks (replaced by Higgsfield GLBs when present) ----------
function fbPlant(){const g=new THREE.Group();
  const pot=new THREE.Mesh(new THREE.CylinderGeometry(.62,.5,1.0,48),M(0x3a3c40,.9));pot.position.y=.5;g.add(pot);
  const soil=new THREE.Mesh(new THREE.CircleGeometry(.58,40),M(0x2a1d14,1));soil.rotation.x=-Math.PI/2;soil.position.y=.95;g.add(soil);
  const leafShape=()=>{const s=new THREE.Shape();s.moveTo(0,0);s.bezierCurveTo(.55,.15,.75,.75,0,1.35);s.bezierCurveTo(-.75,.75,-.55,.15,0,0);
    for(let i=0;i<4;i++){const h=new THREE.Path();const y=.35+i*.22;h.absellipse(.38-i*.03,y,.07,.045,0,Math.PI*2);s.holes.push(h);const h2=new THREE.Path();h2.absellipse(-.38+i*.03,y,.07,.045,0,Math.PI*2);s.holes.push(h2);}return s;};
  const geo=new THREE.ShapeGeometry(leafShape(),24);const pos=geo.attributes.position;
  for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i);pos.setZ(i,-x*x*.35+Math.sin(y*2.2)*.06);}geo.computeVertexNormals();
  const lm=M(0x2f5a2c,.55);lm.side=THREE.DoubleSide;
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2+.3,len=1.2+Math.random()*.6;
    const stem=new THREE.Mesh(new THREE.CylinderGeometry(.025,.035,len,8),M(0x40652f,.7));
    const piv=new THREE.Group();piv.position.y=.95;piv.rotation.y=a;g.add(piv);
    stem.position.set(0,len/2,0);const st=new THREE.Group();st.rotation.z=-(.55+Math.random()*.35);st.add(stem);piv.add(st);
    const leaf=new THREE.Mesh(geo,lm);leaf.scale.setScalar(1.1+Math.random()*.4);leaf.position.y=len;leaf.rotation.set(-Math.PI/2+.5,0,Math.PI/2);st.add(leaf);}
  g.userData.h=2.6;return g;}
function fbLamp(){const g=new THREE.Group(),bk=M(0x1b1c1f,.45,.3);
  const base=new THREE.Mesh(new THREE.CylinderGeometry(.42,.46,.08,48),bk);base.position.y=.04;g.add(base);
  const a1=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,1.6,12),bk);a1.position.set(.25,.8,.0);a1.rotation.z=-.32;g.add(a1);
  const a2=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,1.4,12),bk);a2.position.set(1.05,1.55,0);a2.rotation.z=1.15;g.add(a2);
  const sh=new THREE.Mesh(new THREE.ConeGeometry(.3,.45,40,1,true),bk);sh.material.side=THREE.DoubleSide;sh.position.set(1.7,1.25,0);sh.rotation.z=.5;g.add(sh);
  const bl=new THREE.Mesh(new THREE.SphereGeometry(.1,16,12),new THREE.MeshStandardMaterial({color:0xfff2dd,emissive:0xffc48a,emissiveIntensity:0}));bl.position.set(1.66,1.17,0);g.add(bl);
  g.userData.bulb=bl;g.userData.head=new THREE.Vector3(1.66,1.1,0);g.userData.h=1.9;return g;}
function fbPhones(){const g=new THREE.Group(),mt=M(0x3b3d42,.6),pad=M(0x232427,.95);
  const band=new THREE.Mesh(new THREE.TorusGeometry(.75,.07,16,64,Math.PI),mt);band.rotation.x=-Math.PI/2;band.position.y=.08;g.add(band);
  for(const s of[-1,1]){const c=new THREE.Mesh(new THREE.CylinderGeometry(.36,.36,.22,40),mt);c.position.set(s*.75,.2,.05);c.rotation.z=Math.PI/2*0;g.add(c);
    const p=new THREE.Mesh(new THREE.TorusGeometry(.26,.09,16,40),pad);p.rotation.x=Math.PI/2;p.position.set(s*.75,.33,.05);g.add(p);}
  g.userData.h=.45;return g;}
function fbVase(){const g=new THREE.Group();const pts=[];for(let i=0;i<=20;i++){const t=i/20;pts.push(new THREE.Vector2(.08+Math.sin(t*Math.PI)*.42+(t>.85?(.85-t)*.4:0),t*.9));}
  const v=new THREE.Mesh(new THREE.LatheGeometry(pts,48),M(0xe8e3da,.85));g.add(v);
  const gm=M(0xd9c7a6,.9);for(let i=0;i<14;i++){const len=1.4+Math.random()*1.1;const st=new THREE.Mesh(new THREE.CylinderGeometry(.008,.012,len,5),gm);
    const p=new THREE.Group();p.position.y=.85;p.rotation.set((Math.random()-.5)*.9,Math.random()*6.28,(Math.random()-.5)*.9);st.position.y=len/2;p.add(st);
    const plume=new THREE.Mesh(new THREE.SphereGeometry(.09,10,8),M(0xe9dcc2,1));plume.scale.set(1,3.2,1);plume.position.y=len;p.add(plume);g.add(p);}
  g.userData.h=2.6;return g;}
// ---------- props: which file, where, how big (css px based) ----------
const PROPS=[
  {k:'plant',file:'/models/plant.glb',fb:fbPlant,at:(W,H,m)=>m?[W*.12,H-95]:[105,H-75],size:m=>m?170:250,rot:.4},
  {k:'lamp',file:'/models/lamp.glb',fb:fbLamp,at:(W,H,m)=>m?[W-50,H*.42]:[W-70,H*.56],size:m=>m?130:180,rot:0,desk:true},
  {k:'phones',file:'/models/headphones.glb',fb:fbPhones,at:(W,H,m)=>[W-130,H-75],size:()=>170,rot:.5,desk:true},
  {k:'vase',file:'/models/vase.glb',fb:fbVase,at:(W,H,m)=>[560,75],size:()=>110,rot:0,desk:true}];
const loader=new GLTFLoader();loader.setMeshoptDecoder(MeshoptDecoder);const objs={};
function fit(o,size){const b=new THREE.Box3().setFromObject(o);const s=new THREE.Vector3();b.getSize(s);
  const k=(size/100)/Math.max(s.x,s.z);o.scale.multiplyScalar(k);const b2=new THREE.Box3().setFromObject(o);
  const c=new THREE.Vector3();b2.getCenter(c);o.position.x-=c.x;o.position.z-=c.z;o.position.y-=b2.min.y;}
function headOf(o){o.updateMatrixWorld(true);let mY=0;const v=new THREE.Vector3(),pts=[];
  o.traverse(n=>{if(!n.isMesh)return;const a=n.geometry.attributes.position;for(let i=0;i<a.count;i+=7){v.fromBufferAttribute(a,i).applyMatrix4(n.matrixWorld);pts.push(v.clone());if(v.y>mY)mY=v.y;}});
  const top=pts.filter(q=>q.y>mY*.72);const c=new THREE.Vector3();top.forEach(q=>c.add(q));c.divideScalar(Math.max(1,top.length));c.y=mY*.78;
  const inv=new THREE.Matrix4().copy(o.matrixWorld).invert();return c.applyMatrix4(inv);}
function holder(p,o,real){const h=new THREE.Group();h.add(o);fit(o,p.size(innerWidth<=760));h.rotation.y=p.rot;cast(h);scene.add(h);
  if(p.k==='lamp'&&real){h.updateMatrixWorld(true);const hd=headOf(o);o.userData.head=hd;
    const bl=new THREE.Mesh(new THREE.SphereGeometry(.05/o.scale.x,16,12),new THREE.MeshStandardMaterial({color:0xfff2dd,emissive:0xffc48a,emissiveIntensity:0}));bl.position.copy(hd);bl.visible=false;o.add(bl);o.userData.bulb=bl;}
  if(dead)return;
  objs[p.k]={h,p,o};place();
  if(physics&&!(innerWidth<=760&&p.desk)){
    const [x,y]=p.at(W,H,mob),size=p.size(mob);
    const body=physics.add(p.k,x,y,size*(p.k==='plant'?.5:.8),size*.65,-p.rot,(px,py,angle)=>{h.position.set(px/100-W/200,0,py/100-H/200);h.rotation.y=-angle;});
    objs[p.k].body=body;offs.push(()=>body.remove());
  }}
PROPS.forEach(p=>{loader.load(p.file,g=>holder(p,g.scene,true),undefined,()=>holder(p,p.fb()));});
let W=innerWidth,H=innerHeight,mob=W<=760;
function place(){Object.values(objs).forEach(({h,p,body})=>{h.visible=!(mob&&p.desk);const [x,y]=p.at(W,H,mob);h.position.set(x/100-W/200,0,y/100-H/200);body?.move(x,y,-p.rot);});}
function size(){W=innerWidth;mob=W<=760;H=mob?deskEl.clientHeight:innerHeight;cv.style.height=mob?H+'px':'';renderer.setSize(W,H,false);cam.aspect=W/H;
  const d=(H/100)/2/Math.tan(THREE.MathUtils.degToRad(cam.fov/2));cam.userData.d=d;cam.updateProjectionMatrix();place();}
size();_on('resize',size);
let mx=0,my=0,tx=0,ty=0;
if(!reduce&&matchMedia('(hover:hover)').matches)_on('pointermove',e=>{tx=(e.clientX/W-.5);ty=(e.clientY/H-.5);},{passive:true});
const desk=deskEl;
let lastTick=0,lastTf='';
function tick(t){if(dead)return;if(!reduce&&t-lastTick<33){requestAnimationFrame(tick);return;}lastTick=t;
  const T=window.__T??12,S=t/1000;
  mx+=(tx-mx)*.05;my+=(ty-my)*.05;
  const d=cam.userData.d;cam.position.set(mx*.9,d,my*.7);cam.lookAt(mx*.25,0,my*.2);
  // keep DOM desk in step with the tilting camera
  if(desk&&!mob){const tf='translate3d('+(-mx*6).toFixed(1)+'px,'+(-my*5).toFixed(1)+'px,0)';if(tf!==lastTf){lastTf=tf;desk.style.transform=tf;}}
  const day=Math.min(1,Math.max(0,(T-5.5)/2))*(1-Math.min(1,Math.max(0,(T-18)/2.5)));
  const k=Math.min(1,Math.max(0,(T-6)/13));const el=.38+Math.sin(k*Math.PI)*.72;
  sun.position.set(-Math.cos(k*Math.PI)*10*Math.cos(el),Math.sin(el)*10,-4);
  sun.target.position.set(0,0,0);
  const gold=Math.min(1,Math.exp(-(((T-7.4)/1.5)**2))+Math.exp(-(((T-18.4)/1.5)**2)));
  sun.color.setRGB(1,1-.3*gold,1-.55*gold);sun.intensity=2.4*day;
  hemi.intensity=.9+.5*day;hemi.color.setRGB(.75+.25*day,.8+.2*day,1);
  catcher.material.opacity=.18+.3*day;
  const L=objs.lamp;if(L){const on=1-day;const head=(L.o.userData.head||new THREE.Vector3(.6,.9,0)).clone();L.h.localToWorld(head);
    bulb.position.copy(head);bulb.target.position.set(head.x,0,head.z);const sp=head.clone().project(cam);window.__lampPool=[(sp.x*.5+.5)*W,(-sp.y*.5+.5)*H];bulb.intensity=on*28;fill.position.set(head.x-.8,head.y*.6,head.z+.8);fill.intensity=on*6;
    if(L.o.userData.bulb)L.o.userData.bulb.material.emissiveIntensity=on*3;}
  const P=objs.plant;if(P&&!reduce){P.o.rotation.z=Math.sin(S*.6)*.012;P.o.rotation.x=Math.sin(S*.45+1)*.01;}
  renderer.render(scene,cam);if(!reduce)requestAnimationFrame(tick);}
requestAnimationFrame(tick);if(reduce)_si(()=>tick(performance.now()),60000);

  })();

  return {
    drop(..._a: any[]) {}, press(..._a: any[]) {},
    destroy() {
      dead = true; tms.forEach(clearTimeout); ints.forEach(clearInterval); offs.forEach((f) => f());
      extra.forEach((e) => e.remove()); deskEl.style.transform = "";
      const r = document.documentElement; delete r.dataset.tod; delete r.dataset.bg; delete r.dataset.surf;
    },
  };
}
