import * as THREE from 'three';
import { PerspectiveCamera, Scene, Object3D } from 'three';

export class CameraControl
{
	private rotations = {
		top: { x: 0.5 * Math.PI, y: -0.5 * Math.PI, z: 0.5 * Math.PI },
		side: { x: 0.5 * Math.PI, y: -60 / 180 * Math.PI, z: 30 / 180 * Math.PI },
		none: { x: 0, y: 0, z: 0 },
	}
	private camera: PerspectiveCamera;
	private camera_pivot = new THREE.Object3D();
	private pivot_pivot = new THREE.Object3D();

	private speed = 0.1;
	private speedLook = 0.15;
	private zoomSpeed = 1.5;
	private moveActive = true;
	private rotationActive = true;
	private zoomActive = true;
	private maxZoom: number | undefined;
	private minZoom = 3;
	private startPosition: Point3 = { x: 0, y: 0, z: 0 };
	private startRotation: Point3 = this.rotations.top;
	private startZoom = 100;

	private activePos = false;
	private activeLook = false;
	private pastX = 0;
	private pastY = 0;

	constructor(canvas: HTMLCanvasElement, camera: PerspectiveCamera, scene: Object3D, options: CameraControlOptions)
	{
		//presets
		this.camera = camera;
		//		is active
		if (options.moveActive != undefined) this.moveActive = options.moveActive;
		if (options.rotationActive != undefined) this.rotationActive = options.rotationActive;
		if (options.zoomActive != undefined) this.zoomActive = options.zoomActive;
		//		zoom
		this.maxZoom = options.maxZoom;
		if (options.minZoom != undefined) this.minZoom = options.minZoom;
		if (options.zoom != undefined) this.startZoom = options.zoom;
		//		camera state
		if (options.position != undefined) this.startPosition = options.position;
		this.setStartRotation(options.rotation);

		//add to scene
		scene.add(this.pivot_pivot);
		this.pivot_pivot.add(this.camera_pivot);
		this.camera_pivot.add(camera);

		//position
		this.camera_pivot.position.set(this.startPosition.x, this.startPosition.y, this.startPosition.z);
		camera.position.set(this.startZoom, 0, 0);
		//rotation
		camera.lookAt(this.camera_pivot.position);
		this.setPivotRaotation(options.plane);
		this.camera_pivot.rotation.set(this.startRotation.x, this.startRotation.y, this.startRotation.z);

		if (options.showCube)
		{
			const cube = new THREE.Mesh(new THREE.BoxBufferGeometry(2, 2, 2), new THREE.MeshPhongMaterial({ color: "blue" }));
			this.camera_pivot.add(cube);
			const axes = new THREE.AxesHelper();
			if (!(axes.material instanceof Array)) axes.material.depthTest = false;
			axes.renderOrder = 1;
			cube.add(axes);
		}

		if (options.showPoint)
		{
			const dotGeometry = new THREE.Geometry();
			dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
			this.camera_pivot.add(new THREE.Points(dotGeometry, new THREE.PointsMaterial({ color: 'black', size: 6, sizeAttenuation: false })));
			this.camera_pivot.add(new THREE.Points(dotGeometry, new THREE.PointsMaterial({ color: 'white', size: 2.5, sizeAttenuation: false })));
		}

		if (options.showAxis)
		{
			const axis = new THREE.Object3D();
			scene.add(axis);
			// this.camera_pivot.add(axis);
			const x = new THREE.Object3D();
			x.position.x = 8;
			axis.add(x);
			addPlaneBufferGeometry(axis, "red", 16, 0.5, 0, 0, 0);
			addPlaneBufferGeometry(axis, "red", 16, 0.5, 0, 0, 0, Math.PI * 0.5);
			addPlaneBufferGeometry(x, "orange", 2, 0.5, 0, 0, 0, 0, 0, 55 / 180 * Math.PI);
			addPlaneBufferGeometry(x, "orange", 2, 0.5, 0, 0, 0, Math.PI * 0.5, 0, 55 / 180 * Math.PI);
			addPlaneBufferGeometry(x, "orange", 2, 0.5, 0, 0, 0, 0, 0, -55 / 180 * Math.PI);
			addPlaneBufferGeometry(x, "orange", 2, 0.5, 0, 0, 0, Math.PI * 0.5, 0, -55 / 180 * Math.PI);

			const y = new THREE.Object3D();
			y.position.y = 8;
			axis.add(y);
			addPlaneBufferGeometry(axis, "green", 0.5, 16, 0, 0, 0);
			addPlaneBufferGeometry(axis, "green", 0.5, 16, 0, 0, 0, 0, Math.PI * 0.5);
			addPlaneBufferGeometry(y, "darkgreen", 3, 0.5, 0.5, 0, 0, 0, 0, 55 / 180 * Math.PI);
			addPlaneBufferGeometry(y, "darkgreen", 3, 0.5, 0.5, 0, 0, Math.PI * 0.5, 0, 55 / 180 * Math.PI);
			addPlaneBufferGeometry(y, "darkgreen", 2, 0.5, 0, 0.5, 0, 0, 0, -55 / 180 * Math.PI);
			addPlaneBufferGeometry(y, "darkgreen", 2, 0.5, 0, 0.5, 0, Math.PI * 0.5, 0, -55 / 180 * Math.PI);

			const z = new THREE.Object3D();
			z.position.z = 8;
			z.rotation.x = Math.PI * 0.5;
			axis.add(z);
			addPlaneBufferGeometry(axis, "blue", 0.5, 16, 0, 0, 0, Math.PI * 0.5);
			addPlaneBufferGeometry(axis, "blue", 0.5, 16, 0, 0, 0, Math.PI * 0.5, Math.PI * 0.5);
			addPlaneBufferGeometry(z, "darkblue", 2, 0.5, 0, -1, 0);
			addPlaneBufferGeometry(z, "darkblue", 2, 0.5, 0, -1, 0, Math.PI * 0.5);
			addPlaneBufferGeometry(z, "darkblue", 3, 0.5, 0, 0, 0, 0, 0, Math.PI * 0.28);
			addPlaneBufferGeometry(z, "darkblue", 3, 0.5, 0, 0, 0, Math.PI * 0.5, 0, Math.PI * 0.28);
			addPlaneBufferGeometry(z, "darkblue", 2, 0.5, 0, 1, 0);
			addPlaneBufferGeometry(z, "darkblue", 2, 0.5, 0, 1, 0, Math.PI * 0.5);
		}


		canvas.addEventListener("mousedown", this.mousedown.bind(this));
		canvas.addEventListener("mouseup", (() => { this.activePos = false; this.activeLook = false; }).bind(this));
		canvas.addEventListener("contextmenu", ((e: MouseEvent) => { e.preventDefault(); }).bind(this));
		canvas.addEventListener("mouseleave", (() => { this.activePos = false; }).bind(this));
		canvas.addEventListener("mousemove", this.mousemove.bind(this));
		canvas.addEventListener("wheel", this.wheel.bind(this));
		window.addEventListener("keypress", this.keypress.bind(this));
	}
	private setPivotRaotation(plane: Planes | undefined)
	{
		if (plane != undefined)
		{
			switch (plane) {
				case "XY": this.pivot_pivot.rotation.set(0, 0, 0); break;
				case "ZX": this.pivot_pivot.rotation.set(Math.PI * -0.5, 0, Math.PI * -0.5); break;
				case "ZY": this.pivot_pivot.rotation.set(Math.PI * 0.5, Math.PI * 0.5, 0); break;

				default:
					console.error("switch default");
					break;
			}
		}

	}
	private setStartRotation(rotation: Rotations | Point3 | undefined)
	{
		if (rotation != undefined)
		{
			if (typeof rotation == "string")
				this.startRotation = this.rotations[rotation];
			else this.startRotation = rotation;
		}
	}
	private mousedown(e: MouseEvent)
	{
		if (e.which == 3 && this.moveActive)
		{
			this.activePos = true;
		}
		else if (e.which == 1 && this.rotationActive)
		{
			this.activeLook = true;
		}
	}
	private mousemove(e: MouseEvent)
	{
		if (this.pastX == 0) this.pastX = e.offsetX;
		if (this.pastY == 0) this.pastY = e.offsetY;

		if (this.activePos)
		{
			const x = e.offsetX;
			const y = e.offsetY;

			let dx = (x - this.pastX) * this.speed * (this.camera.position.x / 100);
			let dy = (y - this.pastY) * this.speed * (this.camera.position.x / 100);

			const a = this.camera_pivot.rotation.y;
			this.camera_pivot.position.x -= dx * Math.cos(a + 0.5 * Math.PI);
			this.camera_pivot.position.y -= dx * Math.sin(a + 0.5 * Math.PI);
			if ((this.camera_pivot.rotation.z / Math.PI * 180 + 360) % 360 < 180)
			{
				this.camera_pivot.position.x -= dy * Math.cos(a);
				this.camera_pivot.position.y -= dy * Math.sin(a);
			}
			else
			{
				this.camera_pivot.position.x += dy * Math.cos(a);
				this.camera_pivot.position.y += dy * Math.sin(a);
			}
		}
		if (this.activeLook)
		{
			const x = e.offsetX;
			const y = e.offsetY;

			const dx = (x - this.pastX) * this.speedLook;
			const dy = (y - this.pastY) * this.speedLook;

			this.camera_pivot.rotation.y -= dx / 180 * Math.PI;
			this.camera_pivot.rotation.z += dy / 180 * Math.PI;
		}
		this.pastX = e.offsetX;
		this.pastY = e.offsetY;
	}
	private wheel(e: WheelEvent)
	{
		if (this.zoomActive)
		{
			const d = e.deltaY;
			if (d > 0) this.camera.position.x *= this.zoomSpeed;
			else if (d < 0) this.camera.position.x /= this.zoomSpeed;

			if (this.maxZoom != undefined) this.camera.position.x = Math.min(this.camera.position.x, this.maxZoom);
			if (this.minZoom != undefined) this.camera.position.x = Math.max(this.camera.position.x, this.minZoom);
		}
	}
	private keypress(e: KeyboardEvent)
	{
		switch (e.code) {
			case "Numpad1":
				console.log(`CameraControl camera state:
				zoom: ${Math.round(this.camera.position.x)},
				rotationZ: ${Math.round(this.camera_pivot.rotation.z / Math.PI * 180)},
				rotationY: ${Math.round(this.camera_pivot.rotation.y / Math.PI * 180)},
				positionX: ${Math.round(this.camera_pivot.position.x)},
				positionY: ${Math.round(this.camera_pivot.position.y)}`);
				break;
			case "Numpad0":
				console.log(`CameraControl camera reseted`);
				this.camera_pivot.position.set(this.startPosition.x, this.startPosition.y, this.startPosition.z);
				this.camera_pivot.rotation.set(this.startRotation.x, this.startRotation.y, this.startRotation.z);
				this.camera.position.set(this.startZoom, 0, 0);
				break;

			default:
				break;
		}
	}
}

function addPlaneBufferGeometry(parent: Object3D, color: string, w: number, h: number, x: number, y: number, z: number, rx?: number, ry?: number, rz?: number )
{
	const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(w, h), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }));
	mesh.position.set(x, y, z);
	if (rz != undefined) mesh.rotateZ(rz);
	if (rx != undefined) mesh.rotateX(rx);
	if (ry != undefined) mesh.rotateY(ry);
	parent.add(mesh);
}

interface Point3
{
	x: number,
	y: number,
	z: number
}

type Planes = "XY" | "ZX" | "ZY";
type Rotations = "top" | "side" | "none";
interface CameraControlOptions
{
	plane?: Planes,
	position?: Point3,
	rotation?: Point3 | Rotations,
	zoom?: number,
	maxZoom?: number,
	minZoom?: number,
	showPoint?: boolean,
	showAxis?: boolean,
	showCube?: boolean,
	moveActive?: boolean,
	rotationActive?: boolean,
	zoomActive?: boolean,
}