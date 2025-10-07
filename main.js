import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Scene & Camera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101014);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 3.2, 8);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.65));
const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(5, 8, 5);
scene.add(dirLight);

// Helpers
const grid = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
const gridMat = grid.material;
if (gridMat && gridMat instanceof THREE.Material) {
  gridMat.transparent = true;
  gridMat.opacity = 0.35;
}
scene.add(grid);

// Card creation
const CARD_WIDTH = 2.5;   // aspect ~ 2.5 x 3.5 (poker size)
const CARD_HEIGHT = 3.5;
const CARD_DEPTH = 0.04;

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function createFrontTexture(rank, suit) {
  const isRed = suit === '♥' || suit === '♦';
  const width = 1024;
  const height = Math.round(width * (CARD_HEIGHT / CARD_WIDTH));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#ffffff';
  drawRoundedRect(ctx, 10, 10, width - 20, height - 20, 48);
  ctx.fill();

  // Border
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#d0d0d0';
  drawRoundedRect(ctx, 10, 10, width - 20, height - 20, 48);
  ctx.stroke();

  // Rank & suit corners
  ctx.fillStyle = isRed ? '#c62828' : '#111111';
  ctx.font = 'bold 160px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  const rankText = String(rank);
  ctx.fillText(rankText, 52, 52);
  ctx.font = 'bold 140px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
  ctx.fillText(suit, 60, 200);

  ctx.save();
  ctx.translate(width - 52, height - 52);
  ctx.rotate(Math.PI);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = 'bold 160px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
  ctx.fillText(rankText, 0, 0);
  ctx.font = 'bold 140px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
  ctx.fillText(suit, 10, 148);
  ctx.restore();

  // Center pips for A, K, Q, J, 10, 7 (simple demo)
  ctx.fillStyle = isRed ? '#c62828' : '#111111';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 260px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
  const centerY = height / 2;
  if (rank === 'A') ctx.fillText(suit, width / 2, centerY);
  else if (rank === 'K' || rank === 'Q' || rank === 'J') ctx.fillText(suit, width / 2, centerY);
  else if (rank === '10' || rank === '7') ctx.fillText(suit, width / 2, centerY);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  texture.encoding = THREE.sRGBEncoding;
  return texture;
}

function createBackTexture() {
  const width = 1024;
  const height = Math.round(width * (CARD_HEIGHT / CARD_WIDTH));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Base color
  ctx.fillStyle = '#164b71';
  drawRoundedRect(ctx, 10, 10, width - 20, height - 20, 48);
  ctx.fill();

  // Border
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#0e334c';
  drawRoundedRect(ctx, 10, 10, width - 20, height - 20, 48);
  ctx.stroke();

  // Diagonal pattern
  ctx.save();
  ctx.clip();
  ctx.globalAlpha = 0.35;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 10;
  for (let x = -height; x < width + height; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + height, height);
    ctx.stroke();
  }
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  texture.encoding = THREE.sRGBEncoding;
  return texture;
}

function createCard(rank, suit) {
  const geometry = new THREE.BoxGeometry(CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH);
  const sideMat = new THREE.MeshStandardMaterial({ color: 0xbdbdbd, roughness: 0.7, metalness: 0.0 });
  const frontTexture = createFrontTexture(rank, suit);
  const backTexture = createBackTexture();
  const frontMat = new THREE.MeshStandardMaterial({ map: frontTexture, roughness: 0.35, metalness: 0.0 });
  const backMat = new THREE.MeshStandardMaterial({ map: backTexture, roughness: 0.35, metalness: 0.0 });

  // Order for BoxGeometry materials: +x, -x, +y, -y, +z (front), -z (back)
  const materials = [sideMat, sideMat, sideMat, sideMat, frontMat, backMat];

  const mesh = new THREE.Mesh(geometry, materials);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  mesh.userData = {
    flipped: false,
    hoverScale: 1,
  };
  return mesh;
}

// Sample deck
const deckSpec = [
  ['A', '♠'],
  ['K', '♥'],
  ['Q', '♦'],
  ['J', '♣'],
  ['10', '♥'],
  ['7', '♠'],
];

const cards = [];
const fanCount = deckSpec.length;
const fanSpread = 0.32; // radians

for (let i = 0; i < fanCount; i++) {
  const [rank, suit] = deckSpec[i];
  const card = createCard(rank, suit);
  const t = i - (fanCount - 1) / 2;
  const angle = t * fanSpread;
  card.position.set(t * 1.6, 0.02 * i, Math.abs(t) * 0.15);
  card.rotation.z = angle * 0.25;
  card.rotation.y = 0; // front side up
  scene.add(card);
  cards.push(card);
}

// Raycasting & interaction
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let hoveredCard = null;
let isDragging = false;

controls.addEventListener('start', () => { isDragging = true; });
controls.addEventListener('end', () => { isDragging = false; });

function updatePointerFromEvent(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

renderer.domElement.addEventListener('pointermove', (event) => {
  updatePointerFromEvent(event);
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(cards, false);
  const newHover = intersects.length ? intersects[0].object : null;
  if (newHover !== hoveredCard) {
    if (hoveredCard) hoveredCard.userData.hoverScale = 1;
    hoveredCard = newHover;
    if (hoveredCard) hoveredCard.userData.hoverScale = 1.06;
  }
});

renderer.domElement.addEventListener('click', (event) => {
  if (isDragging) return;
  updatePointerFromEvent(event);
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(cards, false);
  if (intersects.length) {
    const card = intersects[0].object;
    card.userData.flipped = !card.userData.flipped;
  }
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
const clock = new THREE.Clock();
function animate() {
  const dt = Math.min(clock.getDelta(), 0.033);

  // Smooth flip and hover scale
  for (const card of cards) {
    const targetY = card.userData.flipped ? Math.PI : 0;
    card.rotation.y = THREE.MathUtils.lerp(card.rotation.y, targetY, 1 - Math.exp(-10 * dt));

    const s = card.scale.x; // assume uniform
    const targetS = card.userData.hoverScale || 1;
    const newS = THREE.MathUtils.lerp(s, targetS, 1 - Math.exp(-10 * dt));
    card.scale.setScalar(newS);
  }

  controls.update();
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
