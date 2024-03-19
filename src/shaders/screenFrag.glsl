varying vec2 vUv;

void main(){

    // uv를 먼저 rotate 시켜야함

    // float strength = floor(vUv.x*20.)*0.1;
    // strength *= floor(vUv.y*20.)*0.1;

  // gl_FragColor = vec4(strength);
  gl_FragColor = vec4(1.0,0.9,1.0,1.0);
}