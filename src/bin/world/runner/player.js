import * as THREE from 'three';
import { Howl } from 'howler';

export default class Player {
    constructor({ loader, time, shadows, manager }) {
        this.loader = loader;
        this.time = time;
        this.shadows = shadows;
        this.manager = manager;

        this.container = new THREE.Object3D();
        this.container.name = 'player_character';

        this.position = new THREE.Vector3(0, 0, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.gravity = new THREE.Vector3(0, -25, 0);

        this.clock = new THREE.Clock();
        this.mixer = null;
        this.isRunning = true;

        this.collider = new THREE.Box3();

        this.jumpSound = new Howl({
            src: ['sfx/jump_02.wav'],
            html5: true
        });

        this._setupControls();
        this._loadModel();

        this.manager.on('fail', () => {
            this.isRunning = false;
        });

        this.time.on('tick', () => this._update());
    }

    _setupControls() {
        window.addEventListener('keydown', e => {
            if (e.code === 'Space' && this.position.y <= 0) {
                this._jump();
            }
        });
    }

    _loadModel() {
        const playerMaterial = new THREE.MeshStandardMaterial({ color: '#ff4500' });

        this.loader.load('runner/player/scene.glb', gltf => {
            const model = gltf.scene;
            model.position.set(0, 0, 0);

            this.shadows.add(model, { sizeX: 0.7, sizeY: 0.7, offsetZ: 0 });

            this.mesh = model;

            // On applique le matériau coloré à certains enfants
            ['mesh', 'leg_left', 'leg_right'].forEach(name => {
                const part = model.children.find(child => child.name === name);
                if (part) part.material = playerMaterial;
            });

            this.container.add(model);

            this.mixer = new THREE.AnimationMixer(model);

            // Animation des jambes et du corps
            ['LeftLeg', 'RightLeg', 'Body'].forEach((partName, i) => {
                const action = this.mixer.clipAction(gltf.animations[i + 1]);
                action.setLoop(THREE.LoopPingPong);
                action.clampWhenFinished = false;
                action.play();

                this[`action${partName}`] = action;
            });
        });
    }

    _jump() {
        if (!this.isRunning) return;
        this.velocity.y = 10;
        this.jumpSound.play();
    }

    _update() {
        if (!this.isRunning) return;

        const delta = this.clock.getDelta();

        // Mise à jour physique
        this.velocity.addScaledVector(this.gravity, delta);
        this.position.addScaledVector(this.velocity, delta);
        this.position.y = Math.max(this.position.y, 0);

        // Mise à jour position mesh
        if (this.mesh) {
            this.mesh.position.copy(this.position);
            this._updateCollider();
            this._animate(delta);
        }
    }

    _updateCollider() {
        this.collider.min.set(0, this.position.y, 0);
        this.collider.max.set(0.15, this.position.y + 0.15, 0);
    }

    _animate(delta) {
        if (this.mixer) {
            this.mixer.update(delta);
        }
    }
}
