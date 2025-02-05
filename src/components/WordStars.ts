
import * as THREE from 'three';
import { words } from '../constants/galaxyColors';

export const createWordStars = () => {
  const wordStars: THREE.Mesh[] = [];

  words.forEach((word, index) => {
    const geometry = new THREE.SphereGeometry(0.2, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: 0xFFD700,
      emissive: 0x996515,
      shininess: 100,
    });
    const star = new THREE.Mesh(geometry, material);

    const angle = (index / words.length) * Math.PI * 2;
    const radius = 5 + (index * 0.5);
    star.position.x = Math.cos(angle) * radius;
    star.position.y = Math.sin(angle) * radius;
    star.position.z = (Math.random() - 0.5) * 5;

    wordStars.push(star);
  });

  return wordStars;
};
