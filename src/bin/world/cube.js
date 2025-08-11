import * as THREE from 'three';

export default class BlueSphere {
    constructor({ time }) {
        this.time = time;
        this.container = new THREE.Object3D();

        this._createSphere();
        this._animate();
    }

    _createSphere() {
        this.geometry = new THREE.SphereGeometry(0.5, 32, 32);
        this.material = new THREE.MeshStandardMaterial({ color: '#0000ff' }); // bleu
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.position.set(0, 0.5, 0);

        this.container.add(this.mesh);
    }

    _animate() {
        this.time.on('tick', () => {
            this.mesh.rotation.y += 0.01;
            this.mesh.rotation.x += 0.005;
        });
    }
}
