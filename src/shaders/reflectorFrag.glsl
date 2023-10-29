uniform vec3 color;
uniform float uTime;
uniform sampler2D tDiffuse;
uniform sampler2D tDudv;
uniform float uWaveStrength;
uniform float uWaveSpeed;
varying vec4 vUv;

#include <logdepthbuf_pars_fragment>

float blendOverlay( float base, float blend ) {

  return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

}

vec3 blendOverlay( vec3 base, vec3 blend ) {

  return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

}

void main() {

  #include <logdepthbuf_fragment>

  // simple distortion (ripple) via dudv map (see https://www.youtube.com/watch?v=6B7IF6GOu7s)

  vec2 distortedUv = texture2D( tDudv, vec2( vUv.x + uTime * uWaveSpeed, vUv.y ) ).rg * uWaveStrength;
  distortedUv = vUv.xy + vec2( distortedUv.x, distortedUv.y + uTime * uWaveSpeed );
  vec2 distortion = ( texture2D( tDudv, distortedUv ).rg * 2.0 - 1. ) * uWaveStrength;

  // new uv coords

  vec4 uv = vec4( vUv );
  uv.xy += distortion;

  vec4 base = texture2DProj( tDiffuse, uv );
  gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

  #include <tonemapping_fragment>
  #include <colorspace_fragment>

}