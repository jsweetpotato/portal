varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;

vec3 palette( in float t ) { 
  vec3 a = uColor1;
  vec3 b = uColor2;
  vec3 c = uColor3;
  vec3 d = uColor4;
  return a + b*cos( 6.28318*(c*t+d) ); 
  }

float sdTorus( vec3 p, vec2 t ) { 
  vec2 q = vec2(length(p.xz)-t.x,p.y); 
  return length(q)-t.y; 
}

void main(){

  // uv를 먼저 rotate 시켜야함

  // float strength = floor(vUv.x*20.)*0.1;
  // strength *= floor(vUv.y*20.)*0.1;

  // gl_FragColor = vec4(strength);

  float t = uTime * 0.5;

  // float wave = fract((vPosition.x * (vPosition.y-3.5) - uTime * 0.5));
  vec2 uv = vec2(vPosition.x, vPosition.y-3.5)*0.3;
  vec2 uv0 = uv;

  vec3 finalColor = vec3(0.2, 0.3, 0.6);

  for(float i = 0.0; i < 2.; i++){
  uv = fract(uv * 2.) - .5; 

  float d = length(uv) * exp(-length(uv0));

  vec3 color = palette(length(uv0) + i * .4);

  d = sin(d*8.- t)/8.;
  d = abs(d);
  d = .01/d;
  finalColor += color * d;
  }

  gl_FragColor = vec4(finalColor,1.0);
}