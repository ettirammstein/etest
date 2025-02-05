
export const vertexShader = `
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  uniform vec3 colorTop;
  uniform vec3 colorBottom;
  varying vec3 vPos;
  void main() {
    float h = normalize(vPos).y;
    gl_FragColor = vec4(mix(colorBottom, colorTop, h * 0.5 + 0.5), 1.0);
  }
`;
