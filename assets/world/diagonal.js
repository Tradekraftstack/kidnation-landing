let THREE;
try {
  THREE = await import('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js');
} catch {
  document.querySelector('.world-pause').hidden = true;
}

const world = document.querySelector('#imagination');
const stage = world.querySelector('.world-stage');
const button = world.querySelector('.world-pause');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reduced.matches;
let visible = true;
let renderer;
try {
  if (!THREE) throw new Error("3D runtime unavailable");
  renderer = new THREE.WebGLRenderer({alpha:true, antialias:true, powerPreference:'low-power'});
} catch {
  button.hidden = true;
}
if (renderer) {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  stage.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-10,10,6,-6,.1,100);
  camera.position.set(0,0,30);
  scene.add(new THREE.HemisphereLight(0xe9dcff,0x431164,3));
  const key = new THREE.DirectionalLight(0xfff3db,5); key.position.set(-5,9,15);scene.add(key);
  const rim = new THREE.DirectionalLight(0x79cfff,3);rim.position.set(8,2,-3);scene.add(rim);
  const pink = new THREE.PointLight(0xff3d9f,100);pink.position.set(-7,-3,6);scene.add(pink);
  const materials = {};
  function material(color) {
    return materials[color] ||= new THREE.MeshPhysicalMaterial({color,roughness:.25,metalness:.08,clearcoat:.65,clearcoatRoughness:.25});
  }
  function mesh(geometry,color,parent,x=0,y=0,z=0) {
    const object = new THREE.Mesh(geometry,material(color));object.position.set(x,y,z);parent.add(object);return object;
  }
  function box(parent,color,w,h,d,x=0,y=0,z=0,r=.1) {
    const shape = new THREE.Shape();
    const a=-w/2,b=-h/2;
    shape.moveTo(a+r,b);shape.lineTo(a+w-r,b);shape.quadraticCurveTo(a+w,b,a+w,b+r);
    shape.lineTo(a+w,b+h-r);shape.quadraticCurveTo(a+w,b+h,a+w-r,b+h);
    shape.lineTo(a+r,b+h);shape.quadraticCurveTo(a,b+h,a,b+h-r);shape.lineTo(a,b+r);shape.quadraticCurveTo(a,b,a+r,b);
    const geo=new THREE.ExtrudeGeometry(shape,{depth:d,bevelEnabled:true,bevelSize:.045,bevelThickness:.045,bevelSegments:3,steps:1,curveSegments:10});geo.translate(0,0,-d/2);
    return mesh(geo,color,parent,x,y,z);
  }
  function torus(parent,color,r,tube,x=0,y=0,z=0,arc=Math.PI*2) {
    return mesh(new THREE.TorusGeometry(r,tube,16,64,arc),color,parent,x,y,z);
  }
  function book() {
    const g=new THREE.Group();
    const l=new THREE.Group(),r=new THREE.Group();g.add(l,r);l.rotation.y=-.22;r.rotation.y=.22;
    box(l,0x8739ec,1.2,1.8,.22,-.61,0,0);box(r,0x8739ec,1.2,1.8,.22,.61,0,0);
    box(l,0xffefc1,1.12,1.62,.16,-.6,.02,.19);box(r,0xffefc1,1.12,1.62,.16,.6,.02,.19);
    for(let i=0;i<5;i++){box(l,0xd6b48c,.76,.025,.015,-.6,.48-i*.2,.29,.01);box(r,0xd6b48c,.76,.025,.015,.6,.48-i*.2,.29,.01);}
    box(g,0xff569c,.12,1.8,.12,0,0,.12,.03);g.rotation.set(.22,-.3,-.25);return g;
  }
  function headphones() {
    const g=new THREE.Group();torus(g,0x59efc3,.88,.18,0,0,0,Math.PI);
    for(const side of [-1,1]) {box(g,0x2ab49e,.35,.95,.56,side*.88,-.35,0,.16);box(g,0xb5ffe4,.25,.79,.61,side*.72,-.35,.03,.11);}
    g.rotation.set(-.15,-.4,-.2);return g;
  }
  function star() {
    const g=new THREE.Group(),shape=new THREE.Shape();
    for(let i=0;i<10;i++){const a=i*Math.PI/5+Math.PI/2,r=i%2?.48:1.1;const x=Math.cos(a)*r,y=Math.sin(a)*r;i?shape.lineTo(x,y):shape.moveTo(x,y);}shape.closePath();
    const geo=new THREE.ExtrudeGeometry(shape,{depth:.35,bevelEnabled:true,bevelSize:.13,bevelThickness:.13,bevelSegments:5});geo.center();mesh(geo,0xffd238,g);g.rotation.set(.2,-.3,.2);return g;
  }
  function rocket() {
    const g=new THREE.Group();
    mesh(new THREE.CylinderGeometry(.42,.42,1.4,40),0xf5e9d3,g);
    mesh(new THREE.ConeGeometry(.43,.8,40),0xff5b9c,g,0,1.1);
    const port=mesh(new THREE.CylinderGeometry(.24,.24,.12,40),0x3bc8ef,g,0,.22,.4);port.rotation.x=Math.PI/2;
    const ring=torus(g,0xffc938,.25,.06,0,.22,.47);
    for(const side of [-1,1]){const fin=box(g,0x8444e4,.28,.68,.35,side*.5,-.65,0,.1);fin.rotation.z=-side*.38;}
    mesh(new THREE.ConeGeometry(.28,.65,32),0xffb327,g,0,-1.05).rotation.z=Math.PI;
    g.rotation.set(.2,-.35,-.4);return g;
  }
  function crayon() {
    const g=new THREE.Group();mesh(new THREE.CylinderGeometry(.28,.28,2.15,32),0xff7846,g);
    mesh(new THREE.ConeGeometry(.28,.6,32),0xffb04c,g,0,1.38);
    mesh(new THREE.CylinderGeometry(.3,.3,1.22,32),0xffbd6d,g);
    for(const y of [-.52,.52]) mesh(new THREE.CylinderGeometry(.305,.305,.07,32),0xf46b35,g,0,y);
    g.rotation.z=-.4;return g;
  }
  function blocks() {
    const g=new THREE.Group();
    box(g,0x55dfb3,1.1,1.1,1.1,-.4,-.32,0,.12);box(g,0xff689f,1.1,1.1,1.1,.48,.4,-.18,.12);
    for(const [x,y,z] of [[-.4,-.32,.59],[.48,.4,.41]]){const ring=torus(g,0xffefc1,.25,.045,x,y,z);}
    g.rotation.set(.5,-.55,.15);return g;
  }
  function music() {
    const g=new THREE.Group();box(g,0x8c52f4,2.4,1.5,.65,0,0,0,.18);
    for(const x of [-.73,.73]){mesh(new THREE.CylinderGeometry(.48,.48,.14,48),0x29164d,g,x,-.1,.38).rotation.x=Math.PI/2;torus(g,0xdda9ff,.35,.045,x,-.1,.48);mesh(new THREE.SphereGeometry(.16,24,16),0x7651bd,g,x,-.1,.49);}
    box(g,0xffd64e,.65,.24,.06,0,.43,.37,.04);torus(g,0xd4b5ff,.55,.08,0,.84,0,Math.PI);g.rotation.set(.12,-.25,.2);return g;
  }
  const builders=[headphones,book,star,rocket,music,blocks,crayon,book,headphones,star];
  const items=builders.map((build,i)=>{const object=build();const wrapper=new THREE.Group();wrapper.add(object);scene.add(wrapper);return {wrapper,object,offset:i*4.3,lane:[1.9,-1.6,.5,-2.3,1.2,-.5,2.4,-1.6,.5,-2][i],depth:[2,-1,4,1,3,-2,2,0,3,-1][i],spin:i*.6};});
  let aspect=1,time=0,last=0,frame=0;
  const pointer={x:0,y:0};
  function resize(){const w=world.clientWidth,h=world.clientHeight;aspect=w/h;camera.left=-6*aspect;camera.right=6*aspect;camera.top=6;camera.bottom=-6;camera.updateProjectionMatrix();renderer.setSize(w,h,false);render();}
  function render(){
    const mobile=aspect<1;
    for(const [i,item] of items.entries()){
      const span=43;
      const x=((item.offset-time*.95+span*100)%span)-span/2;
      item.wrapper.position.set(x,.46*x+item.lane+(mobile?1.4:.45),item.depth);
      item.wrapper.scale.setScalar((mobile?.78:1.15)*(i%3===0?1.15:1));
      item.wrapper.rotation.set(Math.sin(time*.21+item.spin)*.14,Math.cos(time*.17+item.spin)*.22,Math.sin(time*.14+item.spin)*.16);
    }
    camera.position.x=pointer.x*.22;camera.position.y=pointer.y*.18;
    renderer.render(scene,camera);
  }
  function tick(now){frame=0;if(paused||reduced.matches||!visible||document.hidden){last=0;return;}if(last)time+=Math.min((now-last)/1000,.05);last=now;render();frame=requestAnimationFrame(tick);}
  function start(){if(!frame&&!paused&&!reduced.matches&&visible&&!document.hidden)frame=requestAnimationFrame(tick);}
  function sync(){button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'Resume motion':'Pause motion';cancelAnimationFrame(frame);frame=0;last=0;render();start();}
  button.addEventListener('click',()=>{paused=!paused;if(reduced.matches)paused=true;sync();});
  reduced.addEventListener('change',()=>{paused=reduced.matches;sync();});
  world.addEventListener('pointermove',e=>{if(paused||reduced.matches||e.pointerType==='touch')return;const r=world.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width-.5;pointer.y=(e.clientY-r.top)/r.height-.5;});
  world.addEventListener('pointerleave',()=>{pointer.x=pointer.y=0;});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){cancelAnimationFrame(frame);frame=0;last=0;}else start();}).observe(world);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;last=0;}else start();});
  new ResizeObserver(resize).observe(world);
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);frame=0;world.classList.remove('has-webgl');button.hidden=true;});
  resize();world.classList.add('has-webgl');sync();
}
