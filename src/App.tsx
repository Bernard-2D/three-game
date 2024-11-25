import { useEffect } from "react";
// import viteLogo from "/vite.svg";
import "./App.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
function App() {
  const scene = new THREE.Scene();
  const clock = new THREE.Clock();
  const mixers: THREE.AnimationMixer[] = [];
  let infoElement;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let directionalLight: THREE.DirectionalLight;
  let trex: THREE.Group<THREE.Object3DEventMap>;
  let pterodactyl;
  let cactus: THREE.Group<THREE.Object3DEventMap>;

  useEffect(() => {
    createInfoElement();
    createCamera();
    createRenderer();
    animate();
    createLighting();
    load3DModels();
  }, []);

  function createInfoElement() {
    infoElement = document.createElement("div");
    infoElement.id = "info";
    infoElement.innerHTML = "Press any key to start";
    document.body.appendChild(infoElement);
  }
  function load3DModels() {
    // Instantiate a loader.
    const loader = new GLTFLoader();
    // Load  models.
    loader.load(
      "./assets/models/t-rex/scene.gltf",
      (gltf) => {
        trex = gltf.scene;
        console.log("t-rex", gltf);

        trex.scale.setScalar(0.5);
        trex.rotation.y = Math.PI / 2;

        scene.add(trex);

        const mixer = new THREE.AnimationMixer(trex);
        const clip = THREE.AnimationClip.findByName(gltf.animations, "run");
        if (clip) {
          const action = mixer.clipAction(clip);
          action.play();
        }
        mixers.push(mixer);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.log("An error happened t-rex", error);
      }
    );

    // loader
    // Load pterodactyl (flying dinosaur) model.
    loader.load("./assets/models/pterodactyl/scene.gltf", function (gltf) {
      pterodactyl = gltf.scene;

      pterodactyl.rotation.y = Math.PI / 2;
      pterodactyl.scale.multiplyScalar(4);

      respawnPterodactyl();

      scene.add(pterodactyl);

      const mixer = new THREE.AnimationMixer(pterodactyl);
      const clip = THREE.AnimationClip.findByName(gltf.animations, "flying");
      const action = mixer.clipAction(clip);
      action.play();
      mixers.push(mixer);
    });

    loader.load(
      "./assets/models/cactus/scene.gltf",
      function (gltf) {
        gltf.scene.scale.setScalar(0.05);
        gltf.scene.rotation.y = -Math.PI / 2;

        cactus = gltf.scene;
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (error) {
        console.log("An error happened cactus", error);
      }
    );
  }
  function createCamera() {
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 10);
    camera.lookAt(3, 3, 0);
  }
  function createRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x7f7f7f);
    // renderer.outputColorSpace = THREE.ZeroCurvatureEnding
    // renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);
  }

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    update(delta);
    renderer.render(scene, camera);
  }

  function createLighting() {
    directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.intensity = 2;
    directionalLight.position.set(0, 10, 0);

    const targetObject = new THREE.Object3D();
    targetObject.position.set(0, 0, 0);
    scene.add(targetObject);
    directionalLight.target = targetObject;

    scene.add(directionalLight);

    const light = new THREE.AmbientLight(0x7f7f7f);
    light.intensity = 1;
    scene.add(light);
  }
  function respawnPterodactyl() {}

  function update(delta: number) {
    if (!cactus) return;
    for (const mixer of mixers) {
      mixer.update(delta);
    }
  }
  return (
    <>
      <div id="links">
        <a href="https://github.com/rossning92/t-rex" target="_blank">
          <i></i>Github
        </a>{" "}
        | Author
      </div>
    </>
  );
}

export default App;
