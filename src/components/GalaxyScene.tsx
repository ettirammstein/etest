import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const words = [
  'Stardust', 'Cosmos', 'Galaxy', 'Nebula', 'Celestial',
  'Infinity', 'Dreams', 'Wonder', 'Mystery', 'Journey',
  'Beyond', 'Eternal', 'Stellar', 'Cosmic', 'Astral'
];

const GalaxyScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
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

      // Rotate word-stars
      wordStars.forEach((star, index) => {
        const time = Date.now() * 0.001;
        const angle = (index / words.length) * Math.PI * 2;
        const radius = 5 + (index * 0.5);
        
        star.position.x = Math.cos(angle + time * 0.2) * radius;
        star.position.y = Math.sin(angle + time * 0.2) * radius;
        star.rotation.y += 0.01;
      });

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