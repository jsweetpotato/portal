uniform float uTime;

varying vec3 vColor;
varying float test;
void main(){

  float strength = distance(gl_PointCoord, vec2(0.5));
  strength = 1.-strength;
  strength = pow(strength, 6.0);
  strength *=2.;


  // gl_FragColor = vec4(vColor+0.2, strength)
  float alpha = mix(strength, 0.0, 1./test);
  gl_FragColor = vec4(vColor, alpha);
}