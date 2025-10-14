import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import "./App.css";

import { fragPlane, fragPlaneback, fragskull, vert, vertskull } from "./shaders";

export default function App() {
  const mountRef = useRef();

  useEffect(() => {
    const container = mountRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const cardWidth = 20;
    const cardHeight = 30;

    // === Cameras ===

    // Câmera Principal (a que você usa para ver a cena)
    const camera = new THREE.PerspectiveCamera(30, width / height, 1, 10000);
    camera.position.z = 100;

    // Câmera RTT (a que "filma" a caveira para a textura)
    const cameraRTT = new THREE.PerspectiveCamera(30, cardWidth / cardHeight, 1, 10000);
    cameraRTT.position.y = -3.5;
    cameraRTT.position.z = 30; // <<< ESTA LINHA ESTAVA FALTANDO

    // --- INÍCIO DO CÓDIGO DE CÁLCULO DINÂMICO ---

    // A distância da câmera (30) até o objeto (-10) é 40.
    const distance = cameraRTT.position.z - (-10); 

    // Queremos que a altura visível na "filmagem" seja igual à altura da carta.
    const visibleHeight = cardHeight; 

    // Fórmula para calcular o FOV necessário em graus
    const fov = 2 * Math.atan(visibleHeight / (2 * distance)) * (180 / Math.PI);

    // Aplica o FOV calculado à câmera RTT
    cameraRTT.fov = fov;

    // ESSENCIAL: Atualiza a câmera para que as mudanças no FOV tenham efeito
    cameraRTT.updateProjectionMatrix();


    // === Scenes ===
    const scene = new THREE.Scene();
    const sceneRTT = new THREE.Scene();

    // === Renderer ===
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.autoClear = false;
    container.appendChild(renderer.domElement);

    // === Controls ===
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.update();

    // === Post Processing ===
    const renderScene = new RenderPass(sceneRTT, cameraRTT);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.7, 0.4, 0.85);
    bloomPass.strength = 0.8;   // Força do brilho
    bloomPass.radius = 1.29;    // Raio do brilho
    bloomPass.threshold = 0;    // Limiar (pixels mais brilhantes que isso vão brilhar)

    const composer = new EffectComposer(renderer);
    composer.renderToScreen = false;
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // === GUI ===
    const options = {
      bloomStrength: 0.8,
      bloomRadius: 1.2,
      color0: [197, 81, 245],
      color1: [65, 0, 170],
      color2: [0, 150, 255],
    };
    const gui = new dat.GUI();
    gui.close();

    // === Textures ===
    const loader = new THREE.TextureLoader();
    const tex = {
      front: loader.load("/assets/cardtemplate3.png"),
      back: loader.load("/assets/cardtemplateback4.png"),
      backtexture: loader.load("/assets/color3.jpg"),
      noise: loader.load("/assets/noise2.png"),
      color: loader.load("/assets/color11.png"),
      noiseTex: loader.load("/assets/rgbnoise2.png"),
      flower: loader.load("/assets/flower3.png"),
    };

    // === Skull ===
    const skullMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        color1: { value: new THREE.Vector3(...options.color1) },
        color0: { value: new THREE.Vector3(...options.color0) },
        resolution: { value: new THREE.Vector2(width, height) },
      },
      vertexShader: vertskull,
      fragmentShader: fragskull,
    });

    const group = new THREE.Group();
    new OBJLoader().load("/assets/skull5.obj", (obj) => {
      obj.traverse((child) => {
        if (child.isMesh) {
          child.material = skullMaterial;
          child.geometry.computeVertexNormals();
        }
      });
      obj.scale.set(8, 8, 8);
      obj.position.z = -10;
      obj.rotation.set(Math.PI, 0, Math.PI);

      const eyeGeo = new THREE.SphereGeometry(1.5, 32, 32);
      const eyeMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(options.color2[0] / 255, options.color2[1] / 255, options.color2[2] / 255),
      });
      const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
      const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
      eyeL.position.set(-2.2, -2.2, -6.6);
      eyeR.position.set(2.2, -2.2, -6.6);
      group.add(obj, eyeL, eyeR);
    });
    sceneRTT.add(group);

    // === Card ===
    const planeGeo = new THREE.PlaneGeometry(cardWidth, cardHeight);
    const frontMat = new THREE.ShaderMaterial({
      uniforms: {
        skullrender: { value: composer.readBuffer.texture },
        cardtemplate: { value: tex.front },
        backtexture: { value: tex.backtexture },
        noiseTex: { value: tex.noiseTex },
        color: { value: tex.color },
        noise: { value: tex.noise },
        resolution: { value: new THREE.Vector4(width, height, 1, 1) },
      },
      vertexShader: vert,
      fragmentShader: fragPlane,
      transparent: true,
      depthWrite: false,
    });

    const backMat = new THREE.ShaderMaterial({
      uniforms: {
        skullrender: { value: tex.flower },
        cardtemplate: { value: tex.back },
        backtexture: { value: tex.backtexture },
        noiseTex: { value: tex.noiseTex },
        color: { value: tex.color },
        noise: { value: tex.noise },
        resolution: { value: new THREE.Vector4(width, height, 1, 1) },
      },
      vertexShader: vert,
      fragmentShader: fragPlaneback,
      transparent: true,
    });

    const frontCard = new THREE.Mesh(planeGeo, frontMat);
    const backCard = new THREE.Mesh(planeGeo, backMat);
    frontCard.position.z = 0.5;
    backCard.rotation.y = Math.PI;
    backCard.position.z = -0.5;

    scene.add(frontCard, backCard);

    // === Lights ===
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 10, 10);
    scene.add(dirLight);

    // === Animation Loop ===
    // App.jsx

    // === Animation Loop ===
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);

      // Efeito de paralaxe
      group.rotation.set(-camera.rotation._x, -camera.rotation._y, 0);

      // Animação do shader
      skullMaterial.uniforms.time.value = clock.getElapsedTime() / 4;

      // Renderiza a caveira para a textura
      composer.render();

      // Limpa a tela
      renderer.clear();

      // Renderiza a cena principal
      renderer.render(scene, camera);
    };
    animate();


    return () => {
      gui.destroy();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div id="world" ref={mountRef}></div>;
}
