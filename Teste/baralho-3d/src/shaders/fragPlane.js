export const fragPlane = `
varying vec2 vUv;
uniform sampler2D skullrender;
uniform sampler2D cardtemplate;
uniform sampler2D backtexture;
uniform sampler2D noiseTex;
uniform sampler2D color;
uniform sampler2D noise;
uniform vec4 resolution;
varying vec3 camPos;
varying vec3 eyeVector;
varying vec3 vNormal;

float Fresnel(vec3 eyeVector, vec3 worldNormal) {
  return pow(1.0 + dot(eyeVector, worldNormal), 1.80);
}

void main() {
  // Lê a textura principal da carta
  vec4 temptex = texture2D(cardtemplate, vUv);

  // Lê a textura da caveira usando as coordenadas da CARTA (vUv)
  // Esta é a linha que foi corrigida
  vec4 skulltex = texture2D(skullrender, vUv);

  gl_FragColor = temptex;
  float f = Fresnel(eyeVector, vNormal);
  vec4 noisetex = texture2D(noise, mod(vUv * 2., 1.));

  // Lógica da "janela" para exibir a caveira na área verde
  if (gl_FragColor.g > 0.4 && gl_FragColor.r < 0.7) {
    gl_FragColor = mix(temptex, skulltex, 0.9);
    gl_FragColor += f * 0.2 + noisetex / 5.;
  } else {
    vec4 bactex = texture2D(backtexture, vUv);
    float tone = pow(dot(normalize(camPos), normalize(bactex.rgb)), 1.);
    vec4 colortex = texture2D(color, vec2(tone, 0.));
    gl_FragColor *= colortex;
  }

  gl_FragColor.a = temptex.a;
}
`;