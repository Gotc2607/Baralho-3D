export const fragPlaneback = `
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
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 temptex = texture2D(cardtemplate, vUv);
    vec4 skulltex = texture2D(skullrender, vUv);
    gl_FragColor = temptex;
    vec4 noisetex = texture2D(noise, mod(vUv * 2., 1.));
    float f = Fresnel(eyeVector, vNormal);

    vec2 uv2 = vUv;
    vec3 pixeltex = texture2D(noiseTex, mod(uv * 5., 1.)).rgb;
    float iTime = 1. * 0.004;
    uv.y += iTime / 10.0;
    uv.x -= (sin(iTime / 10.0) / 2.0);
    uv2.y += iTime / 14.0;
    uv2.x += (sin(iTime / 10.0) / 9.0);
    float result = 0.0;
    result += texture2D(noiseTex, mod(uv * 4., 1.) * 0.6 + vec2(iTime * -0.003)).r;
    result *= texture2D(noiseTex, mod(uv2 * 4., 1.) * 0.9 + vec2(iTime * +0.002)).b;
    result = pow(result, 10.0);

    vec4 bactex = texture2D(backtexture, vUv);
    float tone = pow(dot(normalize(camPos), normalize(bactex.rgb)), 1.);
    vec4 colortex = texture2D(color, vec2(tone, 0.));

    if (gl_FragColor.g >= 0.5 && gl_FragColor.r < 0.6) {
      float tone = pow(dot(normalize(camPos), normalize(skulltex.rgb)), 1.);
      vec4 colortex2 = texture2D(color, vec2(tone, 0.));
      if (skulltex.a > 0.2) {
        gl_FragColor = colortex;
      } else {
        gl_FragColor = vec4(0.) + f;
        gl_FragColor += noisetex / 5.;
      }
      gl_FragColor += noisetex / 5.;
    } else {
      gl_FragColor *= colortex;
      gl_FragColor += vec4(sin((tone + vUv.x + vUv.y / 10.) * 10.)) / 8.;
    }
  }
`;
