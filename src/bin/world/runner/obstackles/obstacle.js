import * as THREE from "three";

export default class Obstacle {
    constructor(props) {
        this.loader = props.loader;
        this.shadows = props.shadows;
        this.time = props.time;
        this.manager = props.manager;

        this.container = new THREE.Object3D();
        this.container.name = "obstacle";

        this.collider = new THREE.Box3();
        this.canFlow = true;

        this.init();

        this.container.position.x = 8;

        this.time.on('tick', () => {
            if (this.container.position.x < -3) {
                if (this.container.children.length > 0) {
                    this.container.remove(this.container.children[0]);
                }
            } else {
                if (this.canFlow) {
                    this.container.position.x -= 0.07;
                }
                this.collider.setFromObject(this.container);
            }
        });

        this.manager.on('fail', () => {
            this.canFlow = false;
        });
    }

    init() {
        this.load();
    }

    _createTextTexture(text) {
        const size = 256;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Fond bleu
        ctx.fillStyle = '#0000ff';
        ctx.fillRect(0, 0, size, size);

        // Texte blanc centré
        ctx.font = 'bold 40px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, size / 2, size / 2);

        return new THREE.CanvasTexture(canvas);
    }

    load() {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const texture = this._createTextTexture('insta paris');
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            metalness: 0.3,
            roughness: 0.7,
        });

        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(0, 0, 0);

        this.container.add(sphere);
    }
}
