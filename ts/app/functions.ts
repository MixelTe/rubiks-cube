import * as Lib from "./littleLib";
import * as THREE from 'three';
import { Scene, WebGLRenderer, PerspectiveCamera } from 'three';

let scene: Scene;
let camera: PerspectiveCamera;
let renderer: WebGLRenderer;

export function init()
{
	const canvas = Lib.get.canvas("canvas");
	// Lib.canvas.fitToParent.BCR(canvas);

	renderer = new THREE.WebGLRenderer({ canvas });

	const fov = 40;
	const aspect = canvas.clientWidth / canvas.clientHeight;
	const near = 0.1;
	const far = 1000;
	camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.z = 120;

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xAAAAAA);

	return { scene, camera, renderer };
}

export function addLight(color: number, x: number, y: number, z: number)
{
	const light = new THREE.DirectionalLight(color, 1);
	light.position.set(x, y, z);
	scene.add(light);

	return light;
}

export function resize()
{
	const canvas = renderer.domElement;
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	const needResize = canvas.width !== width || canvas.height !== height;
	if (needResize)
	{
		camera.aspect = canvas.clientWidth / canvas.clientHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(width, height, false);
	}
	return needResize;
}

export function createMaterial()
{
	const material = new THREE.MeshPhongMaterial({
		side: THREE.DoubleSide,
	});

	const hue = Math.random();
	const saturation = 1;
	const luminance = .5;
	material.color.setHSL(hue, saturation, luminance);

	return material;
}

export function createPoints(xf: (i: number) => number, yf: (i: number) => number, count = 10)
{
	const points = new Array<THREE.Vector2>(count);
	for (let i = 0; i < count; ++i)
	{
		points[i] = new THREE.Vector2(xf(i), yf(i));
	}
	return points;
}
