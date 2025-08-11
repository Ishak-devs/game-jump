import * as THREE from 'three';
import Obstacle from './obstackles/obstacle';

export default class ObstaclesManager {
    constructor({ loader, time, shadows, manager }) {
        this.loader = loader;
        this.time = time;
        this.shadows = shadows;
        this.manager = manager;

        this.container = new THREE.Object3D();
        this.container.name = 'obstacles_group';

        this.spawnDelay = this._randomDelay();
        this.frameCounter = 0;

        this.colliders = [];

        this._initialize();
    }

    _initialize() {
        this._setupSpawnLoop();
    }

    _randomDelay() {
        // Génère un délai aléatoire entre 30 et 90 ticks
        return Math.floor(Math.random() * 61) + 30;
    }

    _setupSpawnLoop() {
        this.time.on('tick', () => {
            this.frameCounter++;

            if (this.frameCounter >= this.spawnDelay) {
                this.frameCounter = 0;
                this.spawnDelay = this._randomDelay();

                const obstacle = new Obstacle({
                    loader: this.loader,
                    shadows: this.shadows,
                    time: this.time,
                    manager: this.manager,
                });

                this.colliders.push(obstacle.collider);

                this.container.add(obstacle.container);

            }
        });
    }
}
