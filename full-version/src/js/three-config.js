import * as THREE from 'three';

let scene, camera, renderer, particles, geometry, material;
let mouseX = 0, mouseY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

export function initParticleBackground(containerElementId = 'bg-canvas') {
    const canvas = document.getElementById(containerElementId);
    if (!canvas) {
        console.error("Canvas element not found for Three.js background!");
        return;
    }

    // 1. Scene
    scene = new THREE.Scene();
    // scene.fog = new THREE.FogExp2(0x0a0a1f, 0.001); // Add some depth fog

    // 2. Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.z = 1000; // Move camera back

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true }); // Use existing canvas, allow transparency
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for high DPI displays

    // 4. Particles
    const particleCount = 10000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorBlue = new THREE.Color(0x00f7ff); // --cyber-blue
    const colorPink = new THREE.Color(0xff00ff); // --neon-pink
    const colorGreen = new THREE.Color(0x39ff14); // --matrix-green

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Position: Spread out in a cube
        positions[i3] = (Math.random() - 0.5) * 2000; // x
        positions[i3 + 1] = (Math.random() - 0.5) * 2000; // y
        positions[i3 + 2] = (Math.random() - 0.5) * 2000; // z

        // Color: Mix between blue, pink, green
        const randomColor = Math.random();
        let particleColor;
        if (randomColor < 0.4) particleColor = colorBlue;
        else if (randomColor < 0.8) particleColor = colorPink;
        else particleColor = colorGreen;

        colors[i3] = particleColor.r;
        colors[i3 + 1] = particleColor.g;
        colors[i3 + 2] = particleColor.b;

        // Size
        sizes[i] = Math.random() * 10 + 5; // Random size between 5 and 15
    }

    geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));


    material = new THREE.PointsMaterial({
        size: 15,
        sizeAttenuation: true, // Points smaller further away
        vertexColors: true,    // Use colors defined in geometry
        transparent: true,
        alphaMap: createParticleTexture(), // Use a texture for soft edges
        // blending: THREE.AdditiveBlending, // Brighter where points overlap
        depthWrite: false // Helps with transparency rendering order
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 5. Event Listeners
    document.addEventListener('mousemove', onDocumentMouseMove);
    window.addEventListener('resize', onWindowResize);

    // 6. Start Animation
    animate();
}

function createParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(200, 200, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(100, 100, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}


function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.00005; // Slow down time factor

    // Subtle camera movement based on mouse
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    // Animate particles (e.g., subtle rotation)
    const rotationSpeed = 0.0005;
    particles.rotation.x += rotationSpeed / 2;
    particles.rotation.y += rotationSpeed;

    // You could also animate individual particle positions or colors here for more complex effects
    // const sizes = geometry.attributes.size.array;
    // for ( let i = 0; i < sizes.length; i++ ) {
    //     sizes[i] = 10 * ( 1 + Math.sin( 0.1 * i + time * 5 ) ); // Pulsating size example
    // }
    // geometry.attributes.size.needsUpdate = true;


    renderer.render(scene, camera);
}
