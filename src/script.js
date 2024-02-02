import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import gsap from 'gsap'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import GUI from 'lil-gui';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import Stats from 'stats.js'

// Texture Loader
const textureLoader = new THREE.TextureLoader()
const environmentMap = textureLoader.load('/environmentMaps/5.png')

var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Open the modal
window.onload = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal and start the animation
span.onclick = function() {
  modal.style.display = "none";
  initializeScene(); // Start the camera animation
}
window.onclick = function(event) {
    if (event.target == modal) {
        // Do nothing if the modal background is clicked
        // Or you can display some message if needed
    }
}

function initializeScene()
{

// const stats = new Stats()
// stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.dom)
// Debug
// const gui = new GUI({
//     width: 300,
//     title: 'Debug UI',
//     closeFolders: false
// })


const debugObject = {}
let meshObject;


// Canvas
const canvas = document.querySelector('canvas.webgl');
const container = document.getElementById( 'container' );
// Raycaster
const raycaster = new THREE.Raycaster()

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0, 0, 0);
// Cube creation
let textGeometries = [];
let textMaterials = [];
const cubeScene = () =>
{
    const fontLoader = new FontLoader();
    fontLoader.load('./fonts/helvetiker_regular.typeface.json', (font) => {
        // Create the choice text
        const choiceTextMaterial = new THREE.MeshBasicMaterial({ color: "rgb(255, 255, 255)" });
        const choiceTextGeometry = new TextGeometry("You need to find him!", { font: font, size: 0.5, height: 0.1, curveSegments: 12 });
        choiceTextGeometry.center();
        let choiceTextMesh = new THREE.Mesh( choiceTextGeometry, choiceTextMaterial ); 
        choiceTextMesh.position.x = 6;
        choiceTextMesh.position.y = 1;
        choiceTextMesh.rotateY( - Math.PI / 2);
        scene.add( choiceTextMesh );
    
        textMaterials = [new THREE.MeshBasicMaterial({ color: "rgb(0, 0, 0)" }), new THREE.MeshBasicMaterial({ color: "rgb(107, 247, 94)" })];
    
        // Create text geometries for each letter and center them
        const createTextGeometry = (letter) => {
            const textGeometry = new TextGeometry(letter, { font: font, size: 0.3, height: 0.1 });
            textGeometry.center();
            return textGeometry;
        };
    
        textGeometries = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(createTextGeometry);
        // Scale factor for the cube size
        const cubeSize = 25;
        const halfSize = cubeSize / 2;
    
        // Number of letters per face (along one dimension)
        const numLettersPerFace = 50;
        
        // Helper function to create and add a text mesh
        const addTextMesh = (x, y, z, rotation) => {
            const textMesh = new THREE.Mesh(
                textGeometries[Math.floor(Math.random() * textGeometries.length)],
                textMaterials[Math.floor(Math.random() * textMaterials.length)]
            );
            textMesh.position.set(x, y, z);
    
            // Set rotation of the text mesh
            textMesh.rotation.x = rotation.x;
            textMesh.rotation.y = rotation.y;
            textMesh.rotation.z = rotation.z;
            textMesh.name = 'cubeText';
            scene.add(textMesh);
        };
        // Place letters on each face of the cube, rotating them to be readable
        for (let i = 0; i < numLettersPerFace; i++) {
            for (let j = 0; j < numLettersPerFace; j++) {
                const t1 = (i / (numLettersPerFace - 1)) * cubeSize - halfSize;
                const t2 = (j / (numLettersPerFace - 1)) * cubeSize - halfSize;
    
                addTextMesh(t1, t2, -halfSize, { x: 0, y: 0, z: 0 }); // Front face
                addTextMesh(t1, t2, halfSize, { x: 0, y: Math.PI, z: 0 }); // Back face
                addTextMesh(-halfSize, t1, t2, { x: 0, y: Math.PI / 2, z: 0 }); // Left face
                addTextMesh(halfSize, t1, t2, { x: 0, y: - Math.PI / 2, z: 0 }); // Right face
                addTextMesh(t1, -halfSize, t2, { x: -Math.PI / 2, y: 0, z: 0 }); // Bottom face
                addTextMesh(t1, halfSize, t2, { x: Math.PI / 2, y: 0, z: 0 }); // Top face
            }
        }
    });
}
cubeScene();
const redPillText = () => {
    const fontLoader = new FontLoader();
    fontLoader.load('./fonts/helvetiker_regular.typeface.json', (font) => {
        // Create the choice text
        const choiceTextMaterial = new THREE.MeshBasicMaterial({ color: "rgb(255, 255, 255)" });
        const choiceTextGeometry = new TextGeometry("He is the answer.", { font: font, size: 0.5, height: 0.1, curveSegments: 12 });
        choiceTextGeometry.center();
        const choiceTextMesh = new THREE.Mesh(choiceTextGeometry, choiceTextMaterial); 
        choiceTextMesh.position.x = 6;
        choiceTextMesh.position.y = 2;
        choiceTextMesh.rotateY(-Math.PI / 2);
        scene.add(choiceTextMesh);

        // Remove the pills from the scene
        if (capsule1 && capsule1.parent) {
            scene.remove(capsule1);
        }
        if (capsule2 && capsule2.parent) {
            scene.remove(capsule2);
        }
    });
}
const bluePillText = () => {
    const fontLoader = new FontLoader();
    
    fontLoader.load('./fonts/helvetiker_regular.typeface.json', (font) => {
        // Create the "Wrong choice" text
        const choiceTextMaterial = new THREE.MeshBasicMaterial({ color: "rgb(255, 255, 255)" });
        const choiceTextGeometry = new TextGeometry("Dwight is that you?", { font: font, size: 0.5, height: 0.1, curveSegments: 12 });
        choiceTextGeometry.center();
        const choiceTextMesh = new THREE.Mesh(choiceTextGeometry, choiceTextMaterial); 
        choiceTextMesh.position.x = 6;
        choiceTextMesh.position.y = 2;
        choiceTextMesh.rotateY(-Math.PI / 2);
        scene.add(choiceTextMesh);
        startAnimation = true;
    });
}





const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child.isMesh && child.material.isMeshStandardMaterial)
        {
            child.material.envMapIntensity = debugObject.envMapIntensity;
            child.material.needsUpdate = true;
        }
    })
}

// gui.add(scene, 'backgroundBlurriness').min(0.05).max(1).step(0.001)
// gui.add(scene, 'backgroundIntensity').min(0.1).max(10).step(0.001)

// // Global intensity
// debugObject.envMapIntensity = 10
// gui
//     .add(debugObject, 'envMapIntensity')
//     .min(1)
//     .max(10)
//     .step(0.001)
//     .onChange(updateAllMaterials)


// Laptop scene
let screenCounter = 0;
const laptopScene = () =>
{
    // Remove existing objects and clean up resources
    while (scene.children.length > 0) {
        const object = scene.children[0];

        if (object.isMesh) {
            if (object.geometry) object.geometry.dispose();

            if (object.material) {
                // If the material is an array, we dispose of each element
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        }
        scene.remove(object);
    }

    // Models
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
        './models/cyberpunk_laptop/scene.gltf',
        (gltf) => {
            // Traverse the loaded model to find the material by name
            // gltf.scene.traverse((child) => {
            //     if (child.isMesh && child.material && child.material.name === 'Laptop_Top') {
            //         // Remove emissive texture if it exists
            //         if (child.material.emissiveMap) {
            //             child.material.emissiveMap.dispose();
            //             child.material.emissiveMap = null;
            //         }
            //         // Set emissive color to black
            //         child.material.emissive.setHex(0x000000);
            //         child.material.needsUpdate = true;
            //     }
            // });
            // environmentMap
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            environmentMap.mapping = THREE.EquirectangularReflectionMapping
            environmentMap.colorSpace = THREE.SRGBColorSpace;
            scene.environment = environmentMap;
            scene.background = environmentMap;
            scene.backgroundBlurriness = 0.05;
            scene.backgroundIntensity = 0.9;
            renderer.toneMappingExposure = 1.2;
            debugObject.envMapIntensity = 10;

            // Set the position and rotation of the loaded model
            gltf.scene.scale.set(10, 10, 10);
            gltf.scene.position.set(0.75, 0, 0);
            gltf.scene.rotation.set(0, -Math.PI * 0.5, 0);
            // Add the model to the scene
            scene.add(gltf.scene);
             
            const iframeGroup = new THREE.Group();
            iframeGroup.add(new Element('bigger.html', 5.14, 1.4, 1.7, 0, -1.57, -0.17, 0.01, '880px', '730px', 5.71, 4.83, 5.93));
            iframeGroup.add(new Element('big.html', 5.64, 3.01, -7.85, 0, -1.57, -0.17, 0.01, '390px', '335px', 5.87, 4.5, -6.06));
            iframeGroup.add(new Element('small.html', 4.977, -0.82, -7.2, 0, -1.57, -0.17, 0.01, '270px', '190px', 5.09, -0.04, -6.01));
            iframeGroup.add(new Element('smaller.html', 5.72, 4.54, -4.323, 0, -1.57, -0.17, 0.01, '158px', '105px', 0, 0, 0));
            counter = 47;
            scene.add(iframeGroup);
            camera.position.set(-12.2, 7.2, 0); // Adjust camera position as needed
            // camera.lookAt(new THREE.Vector3(0.75, 0, 0));  
            controls.update();
            updateAllMaterials();
        },
        undefined,
        function (error) {
            console.error(error);
        }
    ); 
}

let iframeObject;
debugObject.iframePosX = 4.98;
debugObject.iframePosY = -0.8;
debugObject.iframePosZ = -7.2;
debugObject.iframeRotX = 0;
debugObject.iframeRotY = - 1.57;
debugObject.iframeRotZ = - 0.17;
debugObject.iframeScale = 0.01;
debugObject.iframeWidth = '270px'; // Initial width
debugObject.iframeHeight = '190px'; // Initial height

function Element(id, x, y, z, rx, ry, rz, scale, width, height, px, py, pz) {
    const div = document.createElement('div');
    div.style.width = width;
    div.style.height = height;
    div.style.overflow = 'hidden';
    div.style.backfaceVisibility = 'hidden';

    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = '0px';
    iframe.src = id;
    div.appendChild(iframe);

    const cssObject = new CSS3DObject(div);
    cssObject.position.set(x, y, z);
    cssObject.rotation.reorder('ZYX');
    cssObject.rotation.x = rx;
    cssObject.rotation.y = ry;
    cssObject.rotation.z = rz;
    cssObject.scale.set(scale, scale, scale);

    // Add CSS3DObject to CSS3D scene
    scene.add(cssObject);

    // Create and add occlusion mesh
    const geometry = new THREE.PlaneGeometry(parseFloat(width), parseFloat(height));
    const material = new THREE.MeshBasicMaterial({
        color: 0x000000,
        opacity: 0,
        blending: THREE.NoBlending,
        side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(cssObject.position);
    mesh.rotation.copy(cssObject.rotation);
    mesh.scale.copy(cssObject.scale);

    // Add occlusion mesh to WebGL scene
    scene.add(mesh);

    const uniqueName = `screenMesh_${screenCounter}`;
    screenCounter++;
    const mesh2 = new THREE.Mesh(geometry, material3)
    mesh2.position.copy(cssObject.position);
    mesh2.rotation.copy(cssObject.rotation);
    mesh2.scale.copy(cssObject.scale);
    mesh2.name = uniqueName;
    console.log(mesh2)
    // Add occlusion mesh to WebGL scene
    scene.add(mesh2);

    if(px > 0)
    {
        const uniqueName2 = `crossMesh_${screenCounter}`;
        const crossMaterialStandard = new THREE.MeshBasicMaterial({
            color: 0xff0000
        });
        const crossGeometry = new THREE.PlaneGeometry(1, 1, 1);
        const crossMesh = new THREE.Mesh(crossGeometry, crossMaterialStandard);
        crossMesh.name = uniqueName2;
        crossMesh.position.set(px, py, pz);
        crossMesh.rotation.copy(mesh2.rotation);
        crossMesh.scale.set(0.3, 0.3, 0.3);
        scene.add(crossMesh);
    }
    return cssObject;
}
// MeshStandardMaterial
const material3 = new THREE.MeshPhysicalMaterial()
material3.metalness = 0.1
material3.roughness = 0
material3.transparent = true
// Transmission
material3.transmission = 0.9
material3.ior = 1.5
material3.thickness = 0

// gui.add(material3, 'metalness').min(0).max(1).step(0.0001)
// gui.add(material3, 'roughness').min(0).max(1).step(0.0001)
// gui.add(material3, 'transmission').min(0).max(1).step(0.0001)
// gui.add(material3, 'ior').min(1).max(10).step(0.0001)
// gui.add(material3, 'thickness').min(0).max(1).step(0.0001)


// Clearcoat
// material3.clearcoat = 1
// material3.clearcoatRoughness = 0

// gui.add(material3, 'clearcoat').min(0).max(1).step(0.0001)
// gui.add(material3, 'clearcoatRoughness').min(0).max(1).step(0.0001)

// Sheen
// material3.sheen = 1
// material3.sheenRoughness = 0.25
// material3.sheenColor.set(1, 1, 1)

// gui.add(material3, 'sheen').min(0).max(1).step(0.0001)
// gui.add(material3, 'sheenRoughness').min(0).max(1).step(0.0001)
// gui.addColor(material3, 'sheenColor')

// Iridescence
// material3.iridescence = 1
// material3.iridescenceIOR = 1
// material3.iridescenceThicknessRange = [100, 800]

// gui.add(material3, 'iridescence').min(0).max(1).step(0.0001)
// gui.add(material3, 'iridescenceIOR').min(1).max(2.333).step(0.0001)
// gui.add(material3.iridescenceThicknessRange, '0').min(1).max(1000).step(1)
// gui.add(material3.iridescenceThicknessRange, '1').min(1).max(1000).step(1)



// Iframe
// function Element(id, x, y, z, rx, ry, rz, scale, width, height) {
//     const div = document.createElement('div');
//     div.style.width = width;
//     div.style.height = height;
//     div.style.overflow = 'hidden';
//     div.style.backfaceVisibility = 'hidden';
//     div.style.transformStyle = 'preserve-3d';
    
//     const iframe = document.createElement('iframe');
//     iframe.style.width = '100%';
//     iframe.style.height = '100%';
//     iframe.style.border = '0px';
//     iframe.src = id;
//     div.appendChild(iframe);

//     const object = new CSS3DObject(div);
//     object.position.set(x, y, z);
//     object.rotation.reorder('ZYX');
//     object.rotation.x = rx;
//     object.rotation.y = ry;
//     object.rotation.z = rz;
//     object.scale.set(scale, scale, scale);
//     iframeObject = object; 
//     return iframeObject;
//     let widthGeometry = width.substr(0,3);
//     let heightGeometry = height.substr(0,3);
//     const geometry = new THREE.PlaneGeometry(widthGeometry, heightGeometry);
//     const mesh = new THREE.Mesh(geometry, iframeMaterial);
//     mesh.position.copy( object.position );
//     mesh.rotation.copy( object.rotation );
//     mesh.scale.copy( object.scale );
//     meshObject = mesh;
//     createMeshGUI();
//     return mesh;
// }

// function createMeshGUI() {
//     if (meshObject) {
//         gui.add(meshObject.position, 'x', -10, 10).name('Mesh Position X');
//         gui.add(meshObject.position, 'y', -10, 10).name('Mesh Position Y');
//         gui.add(meshObject.position, 'z', -10, 10).name('Mesh Position Z');

//         gui.add(meshObject.rotation, 'x', -Math.PI, Math.PI).name('Mesh Rotation X');
//         gui.add(meshObject.rotation, 'y', -Math.PI, Math.PI).name('Mesh Rotation Y');
//         gui.add(meshObject.rotation, 'z', -Math.PI, Math.PI).name('Mesh Rotation Z');

//         gui.add(meshObject.scale, 'x', 0.1, 10).name('Mesh Scale X');
//         gui.add(meshObject.scale, 'y', 0.1, 10).name('Mesh Scale Y');
//     }
// }

// gui.add(debugObject, 'iframePosX').min(-10).max(10).step(0.01).onChange(updateIframePosition);
// gui.add(debugObject, 'iframePosY').min(-10).max(10).step(0.1).onChange(updateIframePosition);
// gui.add(debugObject, 'iframePosZ').min(-10).max(10).step(0.1).onChange(updateIframePosition);
// gui.add(debugObject, 'iframeRotX').min(-Math.PI).max(Math.PI).step(0.01).onChange(updateIframeRotation);
// gui.add(debugObject, 'iframeRotY').min(-Math.PI).max(Math.PI).step(0.01).onChange(updateIframeRotation);
// gui.add(debugObject, 'iframeRotZ').min(-Math.PI).max(Math.PI).step(0.01).onChange(updateIframeRotation);
// gui.add(debugObject, 'iframeScale').min(0.01).max(10).step(0.1).onChange(updateIframeScale);
// gui.add(debugObject, 'iframeWidth').name('Iframe Width').onChange(updateIframeDimensions);
// gui.add(debugObject, 'iframeHeight').name('Iframe Height').onChange(updateIframeDimensions);

function updateIframePosition() {
    if (iframeObject) {
        iframeObject.position.x = debugObject.iframePosX;
        iframeObject.position.y = debugObject.iframePosY;
        iframeObject.position.z = debugObject.iframePosZ;
    }
}

function updateIframeRotation() {
    if (iframeObject) {
        iframeObject.rotation.x = debugObject.iframeRotX;
        iframeObject.rotation.y = debugObject.iframeRotY;
        iframeObject.rotation.z = debugObject.iframeRotZ;
    }
}

function updateIframeScale() {
    if (iframeObject) {
        iframeObject.scale.set(debugObject.iframeScale, debugObject.iframeScale, debugObject.iframeScale);
    }
}

function updateIframeDimensions() {
    if (iframeObject) {
        iframeObject.element.style.width = debugObject.iframeWidth;
        iframeObject.element.style.height = debugObject.iframeHeight;
    }
}
// Pills
const pillsGeometry1 = new THREE.CapsuleGeometry( 0.2, 0.4, 4, 8 ); 
const material1 = new THREE.MeshBasicMaterial( {color: 0xff0000} ); 
const capsule1 = new THREE.Mesh( pillsGeometry1, material1 ); 
capsule1.position.x = 6;
capsule1.position.z = -1;
capsule1.rotateX(Math.PI / 2);
scene.add( capsule1 );

const pillsGeometry2 = new THREE.CapsuleGeometry( 0.2, 0.4, 4, 8 ); 
const material2 = new THREE.MeshBasicMaterial( {color: 0x0000ff} ); 
const capsule2 = new THREE.Mesh( pillsGeometry2, material2 ); 
capsule2.position.x = 6;
capsule2.position.z = 1;
capsule2.rotateX(Math.PI / 2);
scene.add( capsule2 );

let correctAnswer = null;
const aakashText = () => {
    const fontLoader = new FontLoader();
    fontLoader.load('./fonts/helvetiker_regular.typeface.json', (font) => {
        const choiceTextMaterial = new THREE.MeshBasicMaterial({ color: "rgb(107, 247, 94)" });
        const choiceTextGeometry = new TextGeometry("Aakash Baruva", { font: font, size: 0.6, height: 0.1, curveSegments: 12 });
        choiceTextGeometry.center();
        correctAnswer = new THREE.Mesh(choiceTextGeometry, choiceTextMaterial);

        const cubeSize = 21; // Cube size
        const halfSize = cubeSize / 2;

        // Random positions within the cube
        const randomPositionX = Math.random() * cubeSize - halfSize;
        const randomPositionY = Math.random() * cubeSize - halfSize;
        const randomPositionZ = Math.random() * cubeSize - halfSize;

        // Randomly choose one of the cube's faces
        const faces = ['x', 'y', 'z'];
        const chosenFace = faces[Math.floor(Math.random() * faces.length)];

        switch (chosenFace) {
            case 'x':
                correctAnswer.position.set(halfSize * Math.sign(randomPositionX), randomPositionY, randomPositionZ);
                correctAnswer.rotateY(-Math.PI / 2 * Math.sign(randomPositionX));
                break;
            case 'y':
                correctAnswer.position.set(randomPositionX, halfSize * Math.sign(randomPositionY), randomPositionZ);
                correctAnswer.rotateX(Math.PI / 2 * Math.sign(randomPositionY));
                break;
            case 'z':
                correctAnswer.position.set(randomPositionX, randomPositionY, halfSize * Math.sign(randomPositionZ));
                correctAnswer.rotateY(-Math.PI * Math.sign(randomPositionZ));
                break;
        }

        scene.add(correctAnswer);
    });
};


// Call the function to add the text to the scene
aakashText();

function zoomToScreen(screen) {
    const targetPosition = new THREE.Vector3();
    const targetLookAt = new THREE.Vector3();

    screen.getWorldPosition(targetLookAt);
    targetPosition.set(targetLookAt.x, targetLookAt.y, targetLookAt.z); // Adjust '5' to control the distance from the screen

    // Animate camera position
    gsap.to(camera.position, {
        x: targetPosition.x - 5,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: 1
    });

    // Animate camera to look at the screen center
    gsap.to(controls.target, {
        x: targetLookAt.x,
        y: targetLookAt.y,
        z: targetLookAt.z,
        duration: 1,
        onUpdate: function () {
            camera.lookAt(controls.target.x, controls.target.y, controls.target.z);
        }
    });
    if(material3.metalness != 0)
    {
        material3.metalness = 0
        material3.roughness = 0
        material3.transparent = true
        // Transmission
        material3.transmission = 1
        material3.ior = 0
        material3.thickness = 0
    }
}

const defaultCameraPosition = new THREE.Vector3(-12.199569682236426, 7.200903113969078,  -0.008707357173124894);
const defaultCameraTarget = new THREE.Vector3(0.75, 0, 0); // Assuming you want to look at this point


function resetCamera() {
    // Animate the camera position back to default
    gsap.to(camera.position, {
        x: defaultCameraPosition.x,
        y: defaultCameraPosition.y,
        z: defaultCameraPosition.z,
        duration: 1
    });

    // Animate the camera target (controls target) back to default
    gsap.to(controls.target, {
        x: defaultCameraTarget.x,
        y: defaultCameraTarget.y,
        z: defaultCameraTarget.z,
        duration: 1,
        onUpdate: function() {
            camera.lookAt(controls.target.x, controls.target.y, controls.target.z);
            controls.update();
        }
    });

    material3.metalness = 0.1
    material3.roughness = 0
    material3.transparent = true
    // Transmission
    material3.transmission = 0.9
    material3.ior = 1.5
    material3.thickness = 0
}


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}



/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
camera.position.set(-30, 0, 0);
scene.add(camera);
gsap.to(camera.position, { duration: 2, delay: 1, x: 0 })

controls.target.set(3, 0, 0);

controls.update()

// const cameraFolder = gui.addFolder('Camera Position');
// cameraFolder.add(camera.position, 'x', -30, 30, 0.1).name('Position X').onChange(() => camera.updateProjectionMatrix());
// cameraFolder.add(camera.position, 'y', -30, 30, 0.1).name('Position Y').onChange(() => camera.updateProjectionMatrix());
// cameraFolder.add(camera.position, 'z', -30, 30, 0.1).name('Position Z').onChange(() => camera.updateProjectionMatrix());
// cameraFolder.open();

/**
 * Renderer
 */
const renderer2 = new CSS3DRenderer();
renderer2.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer2.domElement);

// Setup WebGLRenderer with transparency
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0';
renderer.setSize(window.innerWidth, window.innerHeight);
renderer2.domElement.appendChild(renderer.domElement); // Make WebGLRenderer a child of CSS3DRenderer
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0';
renderer.domElement.style.zIndex = '1'; // WebGL on top

renderer2.domElement.style.position = 'absolute';
renderer2.domElement.style.top = '0';
renderer2.domElement.style.zIndex = '0'; // CSS3D behind

const effectComposer = new EffectComposer(renderer)
effectComposer.setSize(sizes.width, sizes.height)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)
const glitchPass = new GlitchPass()
// const bloomPass = new UnrealBloomPass(
//     new THREE.Vector2(window.innerWidth, window.innerHeight),
//     1.5, // strength
//     0.4, // radius
//     0.85 // threshold
//   );
//   effectComposer.addPass(bloomPass);
//   gui.add(bloomPass, 'strength', 0, 3).name('Bloom Strength');
//   gui.add(bloomPass, 'radius', 0, 1).name('Bloom Radius');
//   gui.add(bloomPass, 'threshold', 0, 1).name('Bloom Threshold');

const outputPass = new OutputPass();
effectComposer.addPass( outputPass );

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Update CSS renderer
    renderer2.setSize(sizes.width, sizes.height)
})

// gui.add(renderer, 'toneMappingExposure').min(0.06).max(10).step(0.001);

// gui.add(renderer, 'toneMapping', {
//     No: THREE.NoToneMapping,
//     Linear: THREE.LinearToneMapping,
//     Reinhard: THREE.ReinhardToneMapping,
//     Cineon: THREE.CineonToneMapping,
//     ACESFilmic: THREE.ACESFilmicToneMapping
// });

// Mouse
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height * 2 - 1)
})

window.addEventListener('click', () => {
    if (currentIntersect) {
        const clickedObjectName = currentIntersect.object.name;

        // Handle clicks on the capsules and the correct answer
        switch (currentIntersect.object) {
            case capsule1:
                redPillText();
                break;

            case capsule2:
                bluePillText();
                break;

            case correctAnswer:
                laptopScene();
                break;

            // No default case needed
        }

        // Handle clicks on screen meshes
        if (clickedObjectName.startsWith('screenMesh_')) {
            zoomToScreen(currentIntersect.object);
        }
        if (clickedObjectName.startsWith('crossMesh_')) {
            resetCamera();
        }
    }
});



/**
 * Animate
*/

const clock = new THREE.Clock();
let previousTime = 0;
let changeInterval = 0.3; // Change every seconds
let lastChangeTime = 0;
let counter = null;
let currentIntersect = null
let alreadyActive = false
let alreadyWildActive = false
function glitchPassActivate()
{
    alreadyActive = true;
    effectComposer.addPass(glitchPass);    
}

function glitchPassGoWild()
{
    alreadyWildActive = true;
    glitchPass.goWild = true;    
}

let startAnimation = false;
let removalTimer = 0;
const fractionToRemove = 8/10;
let startRemoval = false;
let choiceTextMesh, aakashMesh, redPillMesh, bluePillMesh; // References to specific meshes
const tick = () => {
    // stats.begin()
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // // Cast a ray
    raycaster.setFromCamera(mouse, camera)

    // // Check if it's time to change geometry and color
    if(textGeometries)
    {
        if (elapsedTime - lastChangeTime > changeInterval) {
            scene.children.forEach(child => {
                if (child.isMesh && child.name === 'cubeText')
                {
                    // Randomly pick a new geometry
                    const randomGeometryIndex = Math.floor(Math.random() * textGeometries.length);
                    child.geometry.dispose(); // Dispose of the old geometry
                    child.geometry = textGeometries[randomGeometryIndex];
    
                    // Randomly pick a new material color
                    const randomMaterialIndex = Math.floor(Math.random() * textMaterials.length);
                    child.material = textMaterials[randomMaterialIndex];
                }
            });
    
            lastChangeTime = elapsedTime; // Reset the timer
        }
    }


    if (startAnimation) {
        // Remove specific geometries
        [capsule1, capsule2, choiceTextMesh, bluePillMesh].forEach(mesh => {
            if (mesh && mesh.parent) {
                scene.remove(mesh);
                if (mesh.geometry) mesh.geometry.dispose();
                if (mesh.material) mesh.material.dispose();
            }
        });

        startRemoval = true;
        startAnimation = false; // Ensure this block runs only once
    }

    if (startRemoval) {
        removalTimer += deltaTime;
        if (removalTimer >= 1) { // Check if one second has passed
            removalTimer = 0; // Reset timer

            let letterMeshes = [];
            scene.traverse((child) => {
                if (child.isMesh && child.name === 'cubeText') {
                    letterMeshes.push(child);
                }
            });

            if (letterMeshes.length > 0) {
                const numLettersToRemove = Math.ceil(letterMeshes.length * fractionToRemove);
                for (let i = 0; i < numLettersToRemove; i++) {
                    let randomIndex = Math.floor(Math.random() * letterMeshes.length);
                    let mesh = letterMeshes[randomIndex];
                    scene.remove(mesh); // Remove the mesh from the scene
                }
            } else {
                startRemoval = false; // Refresh the page when all letters are removed
            }
        }
    }


    const objectsToTest = [capsule1, capsule2];
    if(correctAnswer)
    {
        objectsToTest.push(correctAnswer);        
    }
    scene.traverse((child) => {
        if (child.isMesh && child.name.startsWith('screenMesh_') || child.isMesh && child.name.startsWith('crossMesh_')) {
            objectsToTest.push(child);
        }
    });
    const intersects = raycaster.intersectObjects(objectsToTest);
    if (intersects.length) {
        currentIntersect = intersects[0];
    
        // Check if the intersected object is not a screen mesh
        if (!currentIntersect.object.name.startsWith('screenMesh_') && !currentIntersect.object.name.startsWith('crossMesh_')) {
            intersects[0].object.scale.set(1.5, 1.5, 1.5);
        }
    }
    else {   
        currentIntersect = null;
        for(const object of objectsToTest) {
            // Check if the object is not a screen mesh
            if (!object.name.startsWith('screenMesh_') && !object.name.startsWith('crossMesh_')) {
                object.scale.set(1, 1, 1);
            }
        }
    }
    
    if(counter != null)
    {
        counter = counter - deltaTime;
        if(counter < 10 && counter > 4 && alreadyActive == false)
        { 
            glitchPassActivate();
        }
        else if(counter < 4 && counter > 1 && alreadyWildActive == false)
        {
            glitchPassGoWild();
        }
        else if(Math.floor(counter) == 0)
        {

            alert("They are here! You need to leave. Goodbye.");
            location.reload();
        }
    }
    // Update controls
    controls.update();

    // Render
    // renderer.render(scene, camera);
    effectComposer.render();

    // CSSRender
    renderer2.render(scene, camera);
    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
    // stats.end()
};

tick();

}
