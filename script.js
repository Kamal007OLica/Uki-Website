// Advanced Custom Cursor with sparkle effect
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;
let rotation = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Enhanced Cursor Animation
function animateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    cursorX += dx * 0.15;
    cursorY += dy * 0.15;
    
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;

    rotation += Math.sqrt(dx * dx + dy * dy) * 0.01;
    
    cursor.style.transform = `translate3d(${cursorX - 10}px, ${cursorY - 10}px, 0) rotate(${rotation}deg)`;
    cursorFollower.style.transform = `translate3d(${followerX - 5}px, ${followerY - 5}px, 0) rotate(${-rotation}deg)`;

    requestAnimationFrame(animateCursor);
}
animateCursor();

// Enhanced cursor hover effects
const links = document.querySelectorAll('a');
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        cursorFollower.classList.add('active');
    });
    
    link.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        cursorFollower.classList.remove('active');
    });
});

// Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg-canvas'),
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);

// Create minimal flowing dots
function createDots() {
    const geometry = new THREE.BufferGeometry();
    const count = 30;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for(let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 15;
        positions[i3 + 1] = (Math.random() - 0.5) * 15;
        positions[i3 + 2] = (Math.random() - 0.5) * 15;
        
        const color = new THREE.Color();
        color.setHSL(0.6, 0.8, 0.5 + Math.random() * 0.2);
        
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false
    });
    
    return new THREE.Points(geometry, material);
}

const dots = createDots();
scene.add(dots);

camera.position.z = 10;

// Animation
const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();
    
    // Simple rotation with reduced speed
    dots.rotation.y = elapsedTime * 0.05;
    dots.rotation.x = Math.sin(elapsedTime * 0.1) * 0.2;
    
    // Gentle floating motion
    dots.position.y = Math.sin(elapsedTime * 0.3) * 0.1;
    
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();

// Wait for DOM content to be loaded
document.addEventListener('DOMContentLoaded', () => {
    // Button interaction setup
    const button = document.querySelector('.cta-button');
    if (button) {
        // Ensure button is visible
        button.style.opacity = '1';
        button.style.visibility = 'visible';
        
        // Add hover effect
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            button.style.setProperty('--x', `${x}%`);
            button.style.setProperty('--y', `${y}%`);
        });
    }

    // GSAP Animations
    gsap.from('.logo-container', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out'
    });

    gsap.from('.quote', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.2,
        ease: 'power2.out'
    });

    gsap.from('.description', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.4,
        ease: 'power2.out'
    });

    gsap.to('.cta-button', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.6,
        ease: 'power2.out',
        clearProps: 'all'
    });

    gsap.from('.article-card', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.15,
        delay: 0.8,
        ease: 'power2.out'
    });
});
