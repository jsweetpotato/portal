varying vec2 vUv;
varying float vElevation;
void main(){

  vec3 surface = vec3(0.1,0.5,0.9);
  vec3 depth = vec3(0.6,0.6,0.9);

  vec3 color = mix(surface, depth, vElevation);

  float strength = distance(vUv,vec2(0.5));
  strength = smoothstep(0.5, 0.2,strength);

  gl_FragColor = vec4(color,strength);
}