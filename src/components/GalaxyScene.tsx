
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createGalaxyBackground } from './GalaxyBackground';
import { createDustParticles, createStarField } from './GalaxyParticles';
import { createWordStars } from './WordStars';
import { gradientColors } from '../constants/galaxyColors';

const GalaxyScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create background
    const { background, uniforms } = createGalaxyBackground();
    const backgroundCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
    const backgroundScene = new THREE.Scene();
    backgroundScene.add(background);

    // Create particles
    const dustParticles = createDustParticles();
    scene.add(dustParticles);

    const starField = createStarField();
    scene.add(starField);

    // Create word-stars
    const wordStars = createWordStars();
    wordStars.forEach(star => scene.add(star));

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 50;

    // Camera position
    camera.position.z = 15;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xFFFFFF, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    let colorIndex = 0;
    let nextColorIndex = 1;
    let colorTransitionProgress = 0;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Update background rotation
      background.rotation.x += 0.001;
      background.rotation.y += 0.002;
      background.rotation.z += 0.001;

      // Update gradient colors
      colorTransitionProgress += 0.005;
      if (colorTransitionProgress >= 1) {
        colorTransitionProgress = 0;
        colorIndex = (colorIndex + 1) % gradientColors.length;
        nextColorIndex = (colorIndex + 1) % gradientColors.length;
      }

      const currentTopColor = gradientColors[colorIndex].clone();
      const nextTopColor = gradientColors[nextColorIndex].clone();
      const currentBottomColor = gradientColors[(colorIndex + 2) % gradientColors.length].clone();
      const nextBottomColor = gradientColors[(nextColorIndex + 2) % gradientColors.length].clone();

      uniforms.colorTop.value.copy(currentTopColor.lerp(nextTopColor, colorTransitionProgress));
      uniforms.colorBottom.value.copy(currentBottomColor.lerp(nextBottomColor, colorTransitionProgress));

      // Render background
      renderer.autoClear = false;
      renderer.render(backgroundScene, backgroundCamera);
      renderer.autoClear = true;

      // Rotate word-stars
      wordStars.forEach((star, index) => {
        const time = Date.now() * 0.001;
        const angle = (index / wordStars.length) * Math.PI * 2;
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
