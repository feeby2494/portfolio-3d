import './style.css'
import * as THREE from 'three';
// Allows us to move around scene
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

// first arg = Feild of view in degrees,
// second arg = aspect ratio of user's browser window
// third arg = view frustum; how far camera can see
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight , 0.1, 1000);

// Renderer will render graphics to screen
const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
});

// seting up the pixels depending on device client uses to view the browser.
renderer.setPixelRatio(window.devicePixelRatio);

// set up screen size to client's screen size
renderer.setSize(window.innerWidth, window.innerHeight);
// move camera down a little on z axis
camera.position.setZ(30);

// render => Draw out 
renderer.render(scene, camera);

/* 
  Steps to creating object: 
  1. Geometry: the {x,y,z} that make up a shape
  2. Material: the wrapping paper for an object (usually require light source, except for basic ones)
  3. Mesh: combind geometry with material
*/

const geometry = new THREE.TorusGeometry(10,3,16,100);
const material = new THREE.MeshStandardMaterial( { color: 0xFF6347 } );
const torus = new THREE.Mesh(geometry, material);

// like a light bulb; distributing light in all directions
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20,20,5);
// Ambient light like a flood light and will light up everything in the scene equally
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Shows position of point light
const lightHelper = new THREE.PointLightHelper(pointLight);
// shows 2d grid along the scene
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls( camera, renderer.domElement );

// Our Stars:
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial( { color: 0xffffff } );
  const star = new THREE.Mesh( geometry, material );

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ));
  star.position.set(x,y,z);
  scene.add(star);
}

// Make 200 stars
Array(200).fill().forEach(addStar);

// Add Star background
const spaceTexture = new THREE.TextureLoader().load('./public/space-background.jpg');
scene.background = spaceTexture;

// Add new object to scene
scene.add(torus);

// Avatar
const jamieTexture = new THREE.TextureLoader().load('./public/profile.jpg');

const jamie = new THREE.Mesh(
  new THREE.BoxGeometry(5,5,5),
  new THREE.MeshBasicMaterial( { map: jamieTexture } )
);

scene.add(jamie);

// Moon
const moonTexture = new THREE.TextureLoader().load('./public/moon.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial( { map: moonTexture } )
);
moon.position.z = 30;
moon.position.setX(-10);
scene.add(moon);

// Event Handler for scroll bar
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05; 
  moon.rotation.y += 0.075; 
  moon.rotation.z += 0.05; 

  jamie.rotation.y += 0.01;
  jamie.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll =  moveCamera;


// To avoid rerendering, create rucursion function that does so automatically in an endless loop
// Like our Game loop
function animate() {
  requestAnimationFrame( animate );

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z  += 0.01;

  controls.update();

  renderer.render( scene, camera );
}

animate();