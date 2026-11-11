'use strict';
(() => {
  const canvas = document.querySelector('#sculpture');
  const hero = document.querySelector('.hero-art');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'low-power' });
  if (!gl) { canvas.hidden = true; return; }
  const vertex = `attribute vec3 position; attribute vec3 normal; attribute vec3 color;
  uniform vec2 rotation; uniform float aspect; varying vec3 vNormal; varying vec3 vColor; varying vec3 vPosition;
  void main(){float cx=cos(rotation.x),sx=sin(rotation.x),cy=cos(rotation.y),sy=sin(rotation.y);
  mat3 rx=mat3(1.,0.,0.,0.,cx,sx,0.,-sx,cx);mat3 ry=mat3(cy,0.,-sy,0.,1.,0.,sy,0.,cy);
  vec3 p=rx*ry*position;vNormal=rx*ry*normal;vColor=color;vPosition=p;
  float z=5.2-p.z;gl_Position=vec4(p.x*2.9/aspect,p.y*2.9,(z-2.0)*1.5-3.0,z);}`;
  const fragment = `precision mediump float; varying vec3 vNormal; varying vec3 vColor; varying vec3 vPosition;
  void main(){vec3 n=normalize(vNormal);vec3 l=normalize(vec3(-3.,5.,5.));vec3 eye=normalize(vec3(0.,0.,5.2)-vPosition);
  float diffuse=max(dot(n,l),0.);float spec=pow(max(dot(n,normalize(l+eye)),0.),42.);
  float rim=pow(1.-max(dot(n,eye),0.),3.);vec3 c=vColor*(.36+.65*diffuse)+vec3(1.,.89,.70)*spec*.65+vec3(.13,.06,.02)*rim;
  gl_FragColor=vec4(c,1.);}`;
  function compile(type, source) { const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader); if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Shader initialization failed'); return shader; }
  let program;
  try { program = gl.createProgram(); gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex)); gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment)); gl.linkProgram(program); if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Program initialization failed'); } catch { canvas.hidden = true; return; }
  gl.useProgram(program);
  const positions=[], normals=[], colors=[];
  function rotate(p, x, y, z) { let [a,b,c]=p;[b,c]=[b*Math.cos(x)-c*Math.sin(x),b*Math.sin(x)+c*Math.cos(x)];[a,c]=[a*Math.cos(y)+c*Math.sin(y),-a*Math.sin(y)+c*Math.cos(y)];return [a*Math.cos(z)-b*Math.sin(z),a*Math.sin(z)+b*Math.cos(z),c]; }
  function torus(radius, tube, orientation, color) {
    const segments=100, sides=12;
    function point(i,j){const u=i/segments*Math.PI*2,v=j/sides*Math.PI*2;const n=[Math.cos(u)*Math.cos(v),Math.sin(u)*Math.cos(v),Math.sin(v)];return {p:rotate([(radius+tube*Math.cos(v))*Math.cos(u),(radius+tube*Math.cos(v))*Math.sin(u),tube*Math.sin(v)],...orientation),n:rotate(n,...orientation)};}
    for(let i=0;i<segments;i++)for(let j=0;j<sides;j++){const a=point(i,j),b=point(i+1,j),c=point(i+1,j+1),d=point(i,j+1);for(const v of [a,b,c,a,c,d]){positions.push(...v.p);normals.push(...v.n);colors.push(...color);}}
  }
  for(let i=0;i<6;i++)torus(1.13,.052,[0,i*Math.PI/6,.25],[1,.27,.075]);
  torus(1.46,.045,[.85,.3,-.3],[.93,.38,.10]);
  torus(1.12,.035,[Math.PI/2,0,0],[1,.38,.12]);
  // A faceted octahedron at the center gives the cage a contrasting focal point.
  const poles=[[0,.43,0],[0,-.43,0]],equator=[[.43,0,0],[0,0,.43],[-.43,0,0],[0,0,-.43]];
  for(const pole of poles)for(let i=0;i<4;i++){const a=pole,b=equator[i],c=equator[(i+1)%4];const u=b.map((v,k)=>v-a[k]),v=c.map((v,k)=>v-a[k]);let n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];const center=a.map((v,k)=>v+b[k]+c[k]);if(n.reduce((sum,v,k)=>sum+v*center[k],0)<0)n=n.map(v=>-v);for(const p of [a,b,c]){positions.push(...p);normals.push(...n);colors.push(.18,.24,.17);}}
  for(const [name,data] of [['position',positions],['normal',normals],['color',colors]]) { const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);const location=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,3,gl.FLOAT,false,0,0); }
  gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
  const rotation=gl.getUniformLocation(program,'rotation'),aspect=gl.getUniformLocation(program,'aspect');
  let x=-.25,y=.35,targetX=x,targetY=y,frame=0,last=0,visible=true,drag=null,paused=motion.matches,lost=false;
  const toggle=document.querySelector('#motion-toggle');
  const controls=document.querySelector('.scene-controls');
  function updateToggle(){toggle.textContent=paused?'Play rotation':'Pause rotation';toggle.setAttribute('aria-pressed',String(paused));}
  function draw(){const w=canvas.clientWidth,h=canvas.clientHeight,dpr=Math.min(devicePixelRatio||1,2);const width=Math.round(w*dpr),height=Math.round(h*dpr);if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}gl.viewport(0,0,width,height);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniform2f(rotation,x,y);gl.uniform1f(aspect,w/h);gl.drawArrays(gl.TRIANGLES,0,positions.length/3);}
  function tick(time){frame=0;if(!visible||document.hidden||lost)return;const dt=last?Math.min((time-last)/1000,.05):0;last=time;if(!paused&&!drag)targetY+=dt*.22;x+=(targetX-x)*(motion.matches?1:.12);y+=(targetY-y)*(motion.matches?1:.12);draw();if(!paused||Math.abs(x-targetX)+Math.abs(y-targetY)>.001)frame=requestAnimationFrame(tick);}
  function wake(){if(!frame&&visible&&!document.hidden&&!lost){last=0;frame=requestAnimationFrame(tick);}}
  function stop(){cancelAnimationFrame(frame);frame=0;last=0;}
  toggle.addEventListener('click',()=>{paused=!paused;updateToggle();wake();});
  function reset(){targetX=-.25;targetY=.35;wake();}
  document.querySelector('#scene-reset').addEventListener('click',reset);
  canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);canvas.classList.add('dragging');});
  canvas.addEventListener('pointermove',e=>{if(drag&&drag.id===e.pointerId){targetY+=(e.clientX-drag.x)*.009;targetX=Math.max(-1.1,Math.min(1.1,targetX+(e.clientY-drag.y)*.006));drag.x=e.clientX;drag.y=e.clientY;wake();}});
  function release(){drag=null;canvas.classList.remove('dragging');wake();}
  canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',release);
  canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();if(e.key==='Home')reset();else{targetY+=e.key==='ArrowLeft'?-.2:e.key==='ArrowRight'?.2:0;targetX=Math.max(-1.1,Math.min(1.1,targetX+(e.key==='ArrowUp'?-.15:e.key==='ArrowDown'?.15:0)));wake();}});
  new ResizeObserver(()=>wake()).observe(canvas);
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)wake();else stop();}).observe(hero);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else wake();});
  motion.addEventListener('change',()=>{paused=motion.matches;updateToggle();wake();});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;stop();hero.classList.remove('scene-ready');controls.hidden=true;canvas.hidden=true;});
  // Keep the original vector artwork as a readable fallback if rendering is unavailable.
  hero.classList.add('scene-ready');controls.hidden=false;updateToggle();draw();wake();
  document.querySelectorAll('.project-art').forEach(card=>{
    card.addEventListener('pointermove',e=>{if(!finePointer.matches||motion.matches)return;const r=card.getBoundingClientRect();card.style.setProperty('--tilt-x',(-(e.clientY-r.top-r.height/2)/r.height*9)+'deg');card.style.setProperty('--tilt-y',((e.clientX-r.left-r.width/2)/r.width*9)+'deg');});
    card.addEventListener('pointerleave',()=>{card.style.removeProperty('--tilt-x');card.style.removeProperty('--tilt-y');});
  });
})();
