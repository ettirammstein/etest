
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const words = [
  'Stardust', 'Cosmos', 'Galaxy', 'Nebula', 'Celestial',
  'Infinity', 'Dreams', 'Wonder', 'Mystery', 'Journey',
  'Beyond', 'Eternal', 'Stellar', 'Cosmic', 'Astral'
];

// Dusty galaxy colors
const dustColors = [
  new THREE.Color(0x8E9196),  // Neutral Gray
  new THREE.Color(0x1A1F2C),  // Dark Purple
  new THREE.Color(0x403E43),  // Charcoal Gray
  new THREE.Color(0x8A898C),  // Medium Gray
  new THREE.Color(0xC8C8C9),  // Light Gray
];

// Background gradient colors
const gradientTop = new THREE.Color(0x2a0845);    // Deep Purple
const gradientBottom = new THREE.Color(0x6441A5);  // Bright Purple

const GalaxyScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create gradient background
    const vertexShader = `
      varying vec3 vPos;
      void main() {
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform vec3 colorTop;
      uniform vec3 colorBottom;
      varying vec3 vPos;
      void main() {
        float h = normalize(vPos).y;
        gl_FragColor = vec4(mix(colorBottom, colorTop, h * 0.5 + 0.5), 1.0);
      }
    `;

    const uniforms = {
      colorTop: { value: gradientTop },
      colorBottom: { value: gradientBottom },
    };

    const backgroundMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    const backgroundGeometry = new THREE.PlaneGeometry(2, 2);
    const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    background.position.z = -1;
    const backgroundCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
    const backgroundScene = new THREE.Scene();
    backgroundScene.add(background);

    containerRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 50;

    // Camera position
    camera.position.z = 15;

    // Create word-stars
    const wordStars: THREE.Mesh[] = [];

    // Create dusty galaxy background
    const dustParticlesCount = 2000;
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustParticlesCount * 3);
    const dustColorArray = new Float32Array(dustParticlesCount * 3);
    const dustSizes = new Float32Array(dustParticlesCount);

    for (let i = 0; i < dustParticlesCount; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 50;
      const angle = Math.random() * Math.PI * 2;
      const heightSpread = (Math.random() - 0.5) * 10;

      dustPositions[i3] = Math.cos(angle) * radius;
      dustPositions[i3 + 1] = heightSpread;
      dustPositions[i3 + 2] = Math.sin(angle) * radius;

      // Random color from dustColors array
      const randomColor = dustColors[Math.floor(Math.random() * dustColors.length)];
      dustColorArray[i3] = randomColor.r;
      dustColorArray[i3 + 1] = randomColor.g;
      dustColorArray[i3 + 2] = randomColor.b;

      // Random size for dust particles
      dustSizes[i] = Math.random() * 2;
    }

    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeometry.setAttribute('color', new THREE.BufferAttribute(dustColorArray, 3));
    dustGeometry.setAttribute('size', new THREE.BufferAttribute(dustSizes, 1));

    const dustMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const dustParticles = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustParticles);

    // Particle system for background stars
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 10000;
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100;
      positions[i + 1] = (Math.random() - 0.5) * 100;
      positions[i + 2] = (Math.random() - 0.5) * 100;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.05,
    });
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // Create word-stars
    words.forEach((word, index) => {
      const geometry = new THREE.SphereGeometry(0.2, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: 0xFFD700,
        emissive: 0x996515,
        shininess: 100,
      });
      const star = new THREE.Mesh(geometry, material);

      // Position in spiral pattern
      const angle = (index / words.length) * Math.PI * 2;
      const radius = 5 + (index * 0.5);
      star.position.x = Math.cos(angle) * radius;
      star.position.y = Math.sin(angle) * radius;
      star.position.z = (Math.random() - 0.5) * 5;

      wordStars.push(star);
      scene.add(star);
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xFFFFFF, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Render background
      renderer.autoClear = false;
      renderer.render(backgroundScene, backgroundCamera);
      renderer.autoClear = true;

      // Rotate word-stars
      wordStars.forEach((star, index) => {
        const time = Date.now() * 0.001;
        const angle = (index / words.length) * Math.PI * 2;
        const radius = 5 + (index * 0.5);
        
        star.position.x = Math.cos(angle + time * 0.2) * radius;
        star.position.y = Math.sin(angle + time * 0.2) * radius;
        star.rotation.y += 0.01;
      });

      // Rotate dust particles
      dustParticles.rotation.y += 0.0005;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-screen" />;
};

export default GalaxyScene;
