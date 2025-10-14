export const vertskull = `
  varying vec3 vNormal;
  varying vec3 camPos;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 eyeVector;

  void main() {
    vNormal = normal;
    vUv = uv;
    camPos = cameraPosition;
    vPosition = position;
    vec4 worldPosition = modelViewMatrix * vec4(position, 1.0);
    eyeVector = normalize(worldPosition.xyz - cameraPosition);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
