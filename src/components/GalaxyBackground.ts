
import * as THREE from 'three';
import { gradientColors } from '../constants/galaxyColors';
import { vertexShader, fragmentShader } from '../shaders/backgroundShader';

export const createGalaxyBackground = () => {
  const uniforms = {
    colorTop: { value: gradientColors[0] },
    colorBottom: { value: gradientColors[1] },
  };

  const backgroundMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });

  const backgroundGeometry = new THREE.PlaneGeometry(2, 2);
  const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
  background.position.z = -1;

  return { background, uniforms };
};
