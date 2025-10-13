// src/materials.js

import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

// --- Shader da Caveira (Tradução do fragskull) ---
export const SkullMaterial = shaderMaterial(
  {
    time: 0,
    color0: new THREE.Color('#C551F5'), // Roxo (Border)
    color1: new THREE.Color('#4100AA'), // Roxo Escuro (Base)
  },
  // Vertex Shader (vertskull)
  `
    varying vec3 vNormal;
    varying vec3 eyeVector;
    void main() {
      vNormal = normal;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      eyeVector = normalize(worldPosition.xyz - cameraPosition);
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  // Fragment Shader (fragskull)
  `
    varying vec3 vNormal;
    varying vec3 eyeVector;
    uniform float time;
    uniform vec3 color0;
    uniform vec3 color1;

    float rand(vec2 n) { return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }
    float noise(vec2 p){
      vec2 ip = floor(p);
      vec2 u = fract(p);
      u = u*u*(3.0-2.0*u);
      float res = mix(mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x), mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
      return res*res;
    }

    float Fresnel(vec3 eye, vec3 normal) { return pow(1.0 + dot(eye, normal), 3.0); }

    void main() {
      float f = Fresnel(eyeVector, vNormal);
      vec2 uv = gl_FragCoord.xy * 0.01;
      uv.y -= time * 0.1;
      float n = noise(uv * 8.0);
      
      vec3 finalColor = mix(color1, color0, smoothstep(0.4, 0.6, n));
      
      gl_FragColor = vec4(finalColor, 1.0) * f;
    }
  `
);

// --- Shader do Verso da Carta (Tradução do fragPlane) ---
export const BackCardMaterial = shaderMaterial(
  { cardTemplate: null, skullRender: null },
  ` varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); } `,
  `
    varying vec2 vUv;
    uniform sampler2D cardTemplate;
    uniform sampler2D skullRender;
    void main() {
      vec4 baseColor = texture2D(cardTemplate, vUv);
      if (baseColor.g > 0.5 && baseColor.r < 0.6) {
        vec4 skullColor = texture2D(skullRender, vUv);
        gl_FragColor = skullColor;
      } else {
        gl_FragColor = baseColor;
      }
    }
  `
);

// Este passo é crucial para que o React Three Fiber reconheça os nossos shaders
extend({ SkullMaterial, BackCardMaterial });