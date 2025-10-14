export const fragskull = `
  #define NUM_OCTAVES 5
  uniform vec4 resolution;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float time;
  varying vec3 camPos;
  varying vec2 vUv;
  uniform vec3 color1;
  uniform vec3 color0;
  varying vec3 eyeVector;

  float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  float noise(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);
    float res = mix(
      mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
      mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
    return res*res;
  }

  float fbm(vec2 x) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
      v += a * noise(x);
      x = rot * x * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  float setOpacity(float r, float g, float b) {
    float tone = (r + g + b) / 3.0;
    float alpha = 1.0;
    if (tone < 0.69) {
      alpha = 0.0;
    }
    return alpha;
  }

  vec3 rgbcol(float r, float g, float b) {
    return vec3(r / 255.0, g / 255.0, b / 255.0);
  }

  float Fresnel(vec3 eyeVector, vec3 worldNormal) {
    return pow(1.0 + dot(eyeVector, worldNormal), 3.0);
  }

  void main() {
    vec2 olduv = gl_FragCoord.xy / resolution.xy;
    float f = Fresnel(eyeVector, vNormal);
    float gradient2 = (f) * (.3 - vPosition.y);
    float scale = 8.;
    olduv.y = olduv.y - time;
    vec2 p = olduv * scale;
    float noiseVal = fbm(p + time);

    vec3 newCam = vec3(0., 5., 10.);
    float gradient = dot(.0 - normalize(newCam), normalize(vNormal));

    vec3 viewDirectionW = normalize(camPos - vPosition);
    float fresnelTerm = dot(viewDirectionW, vNormal);
    fresnelTerm = clamp(1. - fresnelTerm, 0., 1.);

    vec3 color = vec3(noiseVal) + gradient;
    vec3 color2 = color - 0.2;

    float noisetone = setOpacity(color.r, color.g, color.b);
    float noisetone2 = setOpacity(color2.r, color2.g, color2.b);

    vec4 backColor = vec4(color, 1.);
    backColor.rgb = rgbcol(color0.r, color0.g, color0.b) * noisetone;

    vec4 frontColor = vec4(color2, 1.);
    frontColor.rgb = rgbcol(color1.r, color1.g, color1.b) * noisetone;

    if (noisetone2 > 0.0) {
      gl_FragColor = frontColor;
    } else {
      gl_FragColor = backColor;
    }
  }
`;
