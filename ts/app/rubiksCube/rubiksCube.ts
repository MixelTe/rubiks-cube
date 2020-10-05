import * as THREE from "three";
import { Scene, WebGLRenderer, PerspectiveCamera } from 'three';
import { CameraControl } from "../cameraControl";
import { Cube } from "./cube";
import { CubeRotator } from "./cubeRotator";

export class RubiksCube
{
	private canvas: HTMLCanvasElement;
	private scene: Scene;
	private camera: PerspectiveCamera;
	private renderer: WebGLRenderer;
	private cubeParent = new THREE.Object3D();
	private cube = new Cube();
	private cubeRotator: CubeRotator;
	private started = false;

	constructor(canvas: HTMLCanvasElement)
	{
		this.canvas = canvas;
		this.cubeRotator = new CubeRotator(this.cube);

		this.renderer = new THREE.WebGLRenderer({ canvas });

		const fov = 40;
		const aspect = canvas.clientWidth / canvas.clientHeight;
		const near = 0.1;
		const far = 1000;
		this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
		this.camera.position.z = 120;

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0xAAAAAA);

		new CameraControl(canvas, this.camera, this.scene, { moveActive: false, minZoom: 30, maxZoom: 100, rotation: "side" });
	}

	public start()
	{
		if (!this.started)
		{
			this.started = true;

			this.addLight("white", 10, 10, 10);
			this.addLight("white", -10, -10, -10);

			this.scene.add(this.cubeParent);
			this.cube.create(this.cubeParent);

			this.animate(0);
		}
	}

	private pastTime = 0;
	private animate(time: number)
	{
		this.cubeRotator.update();
		this.cube.anim(time);

		this.resize();
		this.renderer.render(this.scene, this.camera);
		requestAnimationFrame(this.animate.bind(this));
	}

	private addLight(color: number | string, x: number, y: number, z: number)
	{
		const light = new THREE.DirectionalLight(color, 1);
		light.position.set(x, y, z);
		this.scene.add(light);

		return light;
	}
	private resize()
	{
		const width = this.canvas.clientWidth;
		const height = this.canvas.clientHeight;
		const needResize = this.canvas.width !== width || this.canvas.height !== height;
		if (needResize)
		{
			this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(width, height, false);
		}
		return needResize;
	}
}