uniform float uTime;
uniform float uSize;
uniform float uScale;

attribute vec3 aRandom;

varying float test;

// attribute float aScale;

varying vec3 vColor;

void main (){

  float t = uTime;
   vec4 modelPosition = modelMatrix * vec4(position, 1.0);
   vec3 defaultPosition = modelPosition.xyz;
  //  modelPosition.y = aRandom;
  modelPosition.y = defaultPosition.y +sin(t+aRandom.x)*2.;
  modelPosition.x = defaultPosition.x +cos(t+aRandom.y)*2.;
  modelPosition.z = defaultPosition.z +sin(t+aRandom.z)*2.;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix *viewPosition ;

  
  gl_Position =  projectedPosition;

  test = pow(distance(defaultPosition.xzy, modelPosition.xzy),2.);
  gl_PointSize =test *uScale*uSize; // fragment size
  gl_PointSize *= (1.0 / -viewPosition.z);

  vColor = color;
}