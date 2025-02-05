
import * as THREE from 'three';
import { dustColors } from '../constants/galaxyColors';

export const createDustParticles = () => {
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

    const randomColor = dustColors[Math.floor(Math.random() * dustColors.length)];
    dustColorArray[i3] = randomColor.r;
    dustColorArray[i3 + 1] = randomColor.g;
    dustColorArray[i3 + 2] = randomColor.b;

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

  return new THREE.Points(dustGeometry, dustMaterial);
};

export const createStarField = () => {
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

  return new THREE.Points(starsGeometry, starsMaterial);
};
