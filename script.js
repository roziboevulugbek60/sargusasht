
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

// ===============================
// 1. 3D DUNYO
// ===============================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9bd5bb);
scene.fog = new THREE.Fog(0x9bd5bb, 22, 55);

const camera = new THREE.PerspectiveCamera(
  65, window.innerWidth / window.innerHeight, 0.1, 100
);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

document.body.prepend(renderer.domElement);

// Yorug'lik
scene.add(new THREE.HemisphereLight(0xd8f5ff, 0x39532c, 2));

const sun = new THREE.DirectionalLight(0xfff2d0, 2.5);
sun.position.set(10, 20, 10);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
scene.add(sun);

// ===============================
// 2. YER VA O'RMON
// ===============================

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.MeshStandardMaterial({
    color: 0x427d48,
    roughness: 1
  })
);

ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// O'rmon yo'li
const path = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 38),
  new THREE.MeshStandardMaterial({ color: 0x9b8058 })
);

path.rotation.x = -Math.PI / 2;
path.position.set(0, 0.015, 0);
scene.add(path);

// Daraxt yaratish
function createTree(x, z, scale = 1) {
  const tree = new THREE.Group();

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.3, 2, 8),
    new THREE.MeshStandardMaterial({ color: 0x694326 })
  );

  trunk.position.y = 1;

  const leaves = new THREE.Mesh(
    new THREE.ConeGeometry(1.2, 3, 8),
    new THREE.MeshStandardMaterial({ color: 0x176b3b })
  );

  leaves.position.y = 3;
  leaves.castShadow = true;

  const leaves2 = new THREE.Mesh(
    new THREE.ConeGeometry(0.85, 2.3, 8),
    new THREE.MeshStandardMaterial({ color: 0x248a45 })
  );

  leaves2.position.y = 4;
  leaves2.castShadow = true;

  tree.add(trunk, leaves, leaves2);
  tree.position.set(x, 0, z);
  tree.scale.setScalar(scale);

  scene.add(tree);
}

for (let i = 0; i < 65; i++) {
  let x = (Math.random() - 0.5) * 36;
  let z = (Math.random() - 0.5) * 36;

  // Yo'lni ochiq qoldiramiz
  if (Math.abs(x) < 4) {
    x = x < 0 ? -5 - Math.random() * 8 : 5 + Math.random() * 8;
  }

  createTree(x, z, 0.7 + Math.random() * 0.6);
}

// Toshlar
for (let i = 0; i < 20; i++) {
  const rock = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.45 + Math.random() * 0.4),
    new THREE.MeshStandardMaterial({ color: 0x777b78 })
  );

  rock.position.set(
    (Math.random() - 0.5) * 32,
    0.35,
    (Math.random() - 0.5) * 32
  );

  rock.castShadow = true;
  scene.add(rock);
}

// ===============================
// 3. QAHRAMON
// ===============================

const player = new THREE.Group();

const body = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.42, 0.8, 4, 8),
  new THREE.MeshStandardMaterial({ color: 0x247be0 })
);

body.position.y = 1;
body.castShadow = true;
player.add(body);

const head = new THREE.Mesh(
  new THREE.SphereGeometry(0.32, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0xffc99b })
);

head.position.y = 1.85;
head.castShadow = true;
player.add(head);

// Qahramon shapkasi
const hat = new THREE.Mesh(
  new THREE.ConeGeometry(0.38, 0.5, 8),
  new THREE.MeshStandardMaterial({ color: 0x273b78 })
);

hat.position.y = 2.25;
player.add(hat);

// Ko'zlar
for (const x of [-0.12, 0.12]) {
  const eye = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0x111111 })
  );

  eye.position.set(x, 1.9, 0.29);
  player.add(eye);
}

player.position.set(0, 0, 14);
scene.add(player);

// ===============================
// 4. KRISTALLAR
// ===============================

const crystals = [];

const crystalPositions = [
  [-2, 8], [2, 5], [-2, 1],
  [2, -3], [-2, -7], [2, -11],
  [-6, -4], [7, 7]
];

const crystalMaterial = new THREE.MeshStandardMaterial({
  color: 0x00eeff,
  emissive: 0x0088ff,
  emissiveIntensity: 1.5,
  metalness: 0.3,
  roughness: 0.2
});

crystalPositions.forEach(([x, z]) => {
  const crystal = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.45),
    crystalMaterial.clone()
  );

  crystal.position.set(x, 1, z);
  crystal.castShadow = true;
  scene.add(crystal);
  crystals.push(crystal);
});

// ===============================
// 5. KALIT
// ===============================

const keyObject = new THREE.Group();

const keyRing = new THREE.Mesh(
  new THREE.TorusGeometry(0.25, 0.07, 8, 20),
  new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0x886000
  })
);

keyObject.add(keyRing);

const keyStem = new THREE.Mesh(
  new THREE.BoxGeometry(0.12, 0.65, 0.12),
  new THREE.MeshStandardMaterial({ color: 0xffd700 })
);

keyStem.position.y = -0.38;
keyObject.add(keyStem);

keyObject.position.set(-7, 1, -8);
scene.add(keyObject);

// ===============================
// 6. PORTAL
// ===============================

const portal = new THREE.Group();

const portalRing = new THREE.Mesh(
  new THREE.TorusGeometry(1.5, 0.2, 16, 48),
  new THREE.MeshStandardMaterial({
    color: 0x9c42ff,
    emissive: 0x711cff,
    emissiveIntensity: 2
  })
);

portal.add(portalRing);

const portalInside = new THREE.Mesh(
  new THREE.CircleGeometry(1.4, 48),
  new THREE.MeshBasicMaterial({
    color: 0x4b17a8,
    transparent: true,
    opacity: 0.55,
    side: THREE.DoubleSide
  })
);

portal.add(portalInside);
portal.position.set(0, 2, -16);
scene.add(portal);

// ===============================
// 7. DUSHMANLAR
// ===============================

const enemies = [];

function createEnemy(x, z) {
  const enemy = new THREE.Group();

  const material = new THREE.MeshStandardMaterial({
    color: 0x8d35a8,
    emissive: 0x37004d
  });

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.65, 16, 16),
    material
  );

  sphere.position.y = 0.7;
  enemy.add(sphere);

  for (const xEye of [-0.22, 0.22]) {
    const eye = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );

    eye.position.set(xEye, 0.85, 0.53);
    enemy.add(eye);
  }

  enemy.position.set(x, 0, z);
  scene.add(enemy);

  enemies.push({
    mesh: enemy,
    startX: x,
    startZ: z,
    phase: Math.random() * 6
  });
}

createEnemy(-3, 2);
createEnemy(3, -5);
createEnemy(-5, -12);

// ===============================
// 8. O'YIN HOLATI
// ===============================

let score = 0;
let lives = 3;
let hasKey = false;
let playing = false;
let jumping = false;
let velocityY = 0;

const keys = {};
const touch = {
  up: false,
  down: false,
  left: false,
  right: false
};

const clock = new THREE.Clock();

const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const keyEl = document.getElementById("keyStatus");
const message = document.getElementById("message");

function updateUI() {
  scoreEl.textContent = score;
  livesEl.textContent = lives;
  keyEl.textContent = hasKey ? "1/1" : "0/1";

  document.getElementById("progressBar").style.width =
    (score / crystals.length * 100) + "%";
}

function say(text) {
  message.textContent = text;
}

// ===============================
// 9. HARAKAT
// ===============================

function movePlayer(delta) {
  let dx = 0;
  let dz = 0;

  if (keys["KeyW"] || keys["ArrowUp"] || touch.up) dz -= 1;
  if (keys["KeyS"] || keys["ArrowDown"] || touch.down) dz += 1;
  if (keys["KeyA"] || keys["ArrowLeft"] || touch.left) dx -= 1;
  if (keys["KeyD"] || keys["ArrowRight"] || touch.right) dx += 1;

  const length = Math.hypot(dx, dz);

  if (length > 0) {
    dx /= length;
    dz /= length;

    const speed = 6 * delta;

    player.position.x += dx * speed;
    player.position.z += dz * speed;

    player.rotation.y = Math.atan2(dx, dz);

    body.rotation.z = Math.sin(performance.now() * 0.012) * 0.05;
  }

  player.position.x = THREE.MathUtils.clamp(
    player.position.x, -18, 18
  );

  player.position.z = THREE.MathUtils.clamp(
    player.position.z, -18, 18
  );
}

// Sakrash
function jump() {
  if (playing && !jumping) {
    jumping = true;
    velocityY = 8;
  }
}

function updateJump(delta) {
  if (!jumping) return;

  player.position.y += velocityY * delta;
  velocityY -= 20 * delta;

  if (player.position.y <= 0) {
    player.position.y = 0;
    jumping = false;
    velocityY = 0;
  }
}

// ===============================
// 10. YIG'ISH
// ===============================

function collectItems() {
  crystals.forEach((crystal, index) => {
    if (!crystal.visible) return;

    if (player.position.distanceTo(crystal.position) < 1.15) {
      crystal.visible = false;
      score++;
      updateUI();
      say("💎 Kristall topildi! " + score + "/8");
    }
  });

  if (!hasKey &&
      player.position.distanceTo(keyObject.position) < 1.2) {
    hasKey = true;
    keyObject.visible = false;
    updateUI();
    say("🗝️ Kalit topildi! Endi portalga boring!");
  }
}

// ===============================
// 11. DUSHMAN HARAKATI
// ===============================

function updateEnemies(time, delta) {
  for (const enemy of enemies) {
    const e = enemy.mesh;

    e.position.x = enemy.startX +
      Math.sin(time * 0.8 + enemy.phase) * 1.5;

    e.position.z = enemy.startZ +
      Math.cos(time * 0.6 + enemy.phase) * 0.7;

    e.position.y = 0.15 + Math.sin(time * 3) * 0.15;

    if (player.position.distanceTo(e.position) < 1.15 &&
        player.position.y < 0.5) {
      loseLife(enemy);
    }
  }
}

let hitCooldown = 0;

function loseLife(enemy) {
  if (hitCooldown > 0 || !playing) return;

  hitCooldown = 1.5;
  lives--;
  updateUI();

  say("⚠️ Dushman tegdi! Jon qoldi: " + lives);

  player.position.set(0, 0, 14);

  if (lives <= 0) {
    finish(false);
  }
}

// ===============================
// 12. PORTAL VA NATIJA
// ===============================

function checkPortal() {
  const distance = player.position.distanceTo(portal.position);

  if (distance < 2.2) {
    if (hasKey) {
      finish(true);
    } else {
      say("🔒 Portal yopiq! Avval kalitni toping.");
    }
  }
}

function finish(win) {
  if (!playing) return;

  playing = false;

  document.getElementById("endScreen").classList.remove("hidden");

  document.getElementById("endIcon").textContent =
    win ? "🏆" : "💀";

  document.getElementById("endTitle").textContent =
    win ? "G‘ALABA!" : "O‘YIN TUGADI!";

  document.getElementById("endText").textContent =
    win
      ? "Siz sirli o‘rmonni zabt etdingiz! Kristallar: " + score
      : "Jonlaringiz tugadi. Yig‘ilgan kristallar: " + score;
}

// ===============================
// 13. KAMERA
// ===============================

function updateCamera() {
  const target = new THREE.Vector3(
    player.position.x,
    player.position.y + 8,
    player.position.z + 11
  );

  camera.position.lerp(target, 0.09);

  camera.lookAt(
    player.position.x,
    player.position.y + 0.8,
    player.position.z - 2
  );
}

// ===============================
// 14. TUGMALAR
// ===============================

window.addEventListener("keydown", e => {
  keys[e.code] = true;

  if (["Space", "ArrowUp", "ArrowDown",
       "ArrowLeft", "ArrowRight"].includes(e.code)) {
    e.preventDefault();
  }

  if (e.code === "Space" && !e.repeat) jump();
});

window.addEventListener("keyup", e => {
  keys[e.code] = false;
});

document.querySelectorAll("[data-dir]").forEach(button => {
  const direction = button.dataset.dir;

  button.addEventListener("pointerdown", e => {
    e.preventDefault();
    touch[direction] = true;
  });

  const release = e => {
    e.preventDefault();
    touch[direction] = false;
  };

  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("lostpointercapture", release);
  button.addEventListener("pointerleave", release);
});

document.getElementById("jumpBtn").addEventListener(
  "pointerdown", e => {
    e.preventDefault();
    jump();
  }
);

// ===============================
// 15. O'YINNI BOSHLASH
// ===============================

function startGame() {
  score = 0;
  lives = 3;
  hasKey = false;
  playing = true;
  jumping = false;
  velocityY = 0;
  hitCooldown = 0;

  player.position.set(0, 0, 14);

  crystals.forEach(c => c.visible = true);
  keyObject.visible = true;

  enemies.forEach(e => {
    e.mesh.position.set(e.startX, 0, e.startZ);
  });

  updateUI();

  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("endScreen").classList.add("hidden");

  say("Sarguzasht boshlandi! Omad!");
}

document.getElementById("startBtn").addEventListener(
  "click", startGame
);

document.getElementById("restartBtn").addEventListener(
  "click", startGame
);

// ===============================
// 16. O'YIN SIKLI
// ===============================

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.05);
  const time = clock.elapsedTime;

  crystals.forEach((c, i) => {
    if (c.visible) {
      c.rotation.y += delta * 1.8;
      c.position.y = 1 + Math.sin(time * 2 + i) * 0.18;
    }
  });

  keyObject.rotation.y += delta * 1.5;
  portal.rotation.z = Math.sin(time) * 0.08;

  if (playing) {
    hitCooldown = Math.max(0, hitCooldown - delta);

    movePlayer(delta);
    updateJump(delta);
    updateEnemies(time, delta);
    collectItems();
    checkPortal();
  }

  updateCamera();
  renderer.render(scene, camera);
}

camera.position.set(0, 9, 25);
camera.lookAt(0, 0, 0);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
