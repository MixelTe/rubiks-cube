import * as THREE from "three";
import { Side, Tile } from "./side";
import { Mesh, Object3D, Font } from "three";

export class Cube
{
	private width = 6;
	private shift = 1;
	private rotateSpeed = 5;
	private growOnCreate = true;
	private growSpeed = 0.1;

	private parent: Object3D | undefined;
	private rotateAxis = new THREE.Object3D();
	private rotateAxisCur: "x" | "y" | "z" = "x";
	private rotateSpeedCur = 0;
	private growScaleCur = 1;
	private rotateNow = false;
	private growNow = false;
	public sides: Side[] = [];
	private cubes: OneCube[] = [];
	private font: THREE.TextGeometryParameters | null = null;

	constructor(DEVMode = false)
	{
		if (this.growOnCreate) this.growNow = true;

		this.createSides();

		for (let z = -1; z <= 1; z++) {
			for (let y = -1; y <= 1; y++) {
				for (let x = -1; x <= 1; x++)
				{
					const mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(this.width, this.width, this.width), new THREE.MeshPhongMaterial({ color: "gray" }));
					const tiles: Mesh[] = [];
					this.cubes.push({ x, y, z, toX: 0, toY: 0, toZ: 0, mesh, tiles });
				}
			}
		}

		if (DEVMode)
		{
			const loader = new THREE.FontLoader();
			loader.load('../ts/node_modules/three/examples/fonts/helvetiker_regular.typeface.json', (font) =>
			{
				this.font = <THREE.TextGeometryParameters>{
					font: font,
					size: 1,
					height: 0.1,
					curveSegments: 12,
					bevelEnabled: false,
				};
			});
		}
	}

	private createSides()
	{
		this.sides = [
			new Side("blue", 0),
			new Side("red", 1),
			new Side("white", 2),
			new Side("orange", 3),
			new Side("yellow", 4),
			new Side("green", 5),
		];
		this.sides[0].setSides(this.sides[4], this.sides[1], this.sides[2], this.sides[3]);
		this.sides[1].setSides(this.sides[4], this.sides[5], this.sides[2], this.sides[0]);
		this.sides[2].setSides(this.sides[0], this.sides[1], this.sides[5], this.sides[3]);
		this.sides[3].setSides(this.sides[4], this.sides[0], this.sides[2], this.sides[5]);
		this.sides[4].setSides(this.sides[5], this.sides[1], this.sides[0], this.sides[3]);
		this.sides[5].setSides(this.sides[2], this.sides[1], this.sides[4], this.sides[3]);
	}
	public create(parent: Object3D)
	{
		this.parent = parent
		parent.add(this.rotateAxis);
		this.cubes.forEach(el =>
		{
			if (this.growOnCreate)
			{
				el.toX = el.x * (this.width + this.shift);
				el.toY = el.y * (this.width + this.shift);
				el.toZ = el.z * (this.width + this.shift);
				el.mesh.position.set(0, 0, 0);
			}
			else
			{
				el.mesh.position.set(el.x * (this.width + this.shift), el.y * (this.width + this.shift), el.z * (this.width + this.shift));
			}
			parent.add(el.mesh);
		});
		this.setTiles();
	}
	private setTiles()
	{
		for (let i = 0; i < 6; i++)
		{
			const sideCubes = this.sortCubes(this.getSide(<CubeSide>i), <CubeSide>i);
			sideCubes.forEach((el, index) =>
			{
				if (index < 8) this.createTile(el.mesh, this.sides[i].tiles[index], <CubeSide>i, index);
				else this.createTile(el.mesh, this.sides[i].color, <CubeSide>i, 8);
			});
		}
	}
	private sortCubes(cubes: OneCube[], side: CubeSide)
	{
		const cubesSorted: OneCube[] = [];
		const setSides = (var1: "x" | "y" | "z", var2: "x" | "y" | "z", b: boolean) =>
		{
			cubes.forEach(el =>
			{
				if (el[var1] == 0)
				{
					if (el[var2] == -1) cubesSorted[7] = el;
					else if (el[var2] == 0) cubesSorted[8] = el;
					else if (el[var2] == 1) cubesSorted[3] = el;
				}
				else if (el[var1] == -1)
				{
					if (b) cubesSorted[el[var2] + 1] = el;
					else cubesSorted[5 - el[var2]] = el;
				}
				else if (el[var1] == 1)
				{
					if (!b) cubesSorted[el[var2] + 1] = el;
					else cubesSorted[5 - el[var2]] = el;
				}
				else throw new Error("switch default");
			});
		}
		switch (side) {
			case 0: setSides("x", "y", true); break;
			case 1:
				cubes.forEach(el =>
				{
					if (el.x == -1) cubesSorted[1 - el.z] = el;
					else if (el.x == 0)
					{
						if (el.z == -1) cubesSorted[3] = el;
						else if (el.z == 0) cubesSorted[8] = el;
						else if (el.z == 1) cubesSorted[7] = el;
					}
					else if (el.x == 1) cubesSorted[5 + el.z] = el;
					else throw new Error("switch default");
				});
				break;
			case 2: setSides("z", "y", false); break;
			case 3: setSides("x", "z", true); break;
			case 4: setSides("z", "y", true); break;
			case 5: setSides("x", "y", false); break;
			default: throw new Error("switch default");
		}
		return cubesSorted;
	}
	private getSide(side: CubeSide)
	{
		const cubes: OneCube[] = [];
		let getTest: (cube: OneCube) => boolean;
		switch (side) {
			case 0: getTest = (cube: OneCube) => cube.z == 1; break;
			case 1: getTest = (cube: OneCube) => cube.y == 1; break;
			case 2: getTest = (cube: OneCube) => cube.x == 1; break;
			case 3: getTest = (cube: OneCube) => cube.y == -1; break;
			case 4: getTest = (cube: OneCube) => cube.x == -1; break;
			case 5: getTest = (cube: OneCube) => cube.z == -1; break;
			default: throw new Error("switch default");
		}
		this.cubes.forEach(el =>
		{
			if (getTest(el)) cubes.push(el);
		});
		return cubes;
	}
	private createTile(cube: Mesh, tile: Tile | string, side: CubeSide, index: number) //remove index
	{
		let color
		if (tile instanceof Tile) color = tile.color;
		else color = tile;
		const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(this.width, this.width), new THREE.MeshBasicMaterial({ color }));
		switch (side) {
			case 0:
				mesh.position.z = this.width / 2 + 0.1;
				break;
			case 1:
				mesh.rotation.x = -Math.PI / 2;
				mesh.position.y = this.width / 2 + 0.1;
				break;
			case 2:
				mesh.rotation.y = Math.PI / 2;
				mesh.position.x = this.width / 2 + 0.1;
				break;
			case 3:
				mesh.rotation.x = Math.PI / 2;
				mesh.position.y = -this.width / 2 - 0.1;
				break;
			case 4:
				mesh.rotation.y = -Math.PI / 2;
				mesh.position.x = -this.width / 2 - 0.1;
				break;
			case 5:
				mesh.rotation.x = Math.PI;
				mesh.position.z = -this.width / 2 - 0.1;
				break;
			default: console.error("switch default"); break;
		}
		cube.add(mesh);

		if (this.font != null)
		{
			const text = new THREE.Mesh(new THREE.TextGeometry(`${index}`, this.font), new THREE.MeshBasicMaterial({ color: "black" }));
			mesh.add(text);
		}
	}
	private recreateTiles()
	{
		this.cubes.forEach(el =>
		{
			for (let i = el.mesh.children.length - 1; i >= 0; i--)
			{
				el.mesh.remove(el.mesh.children[i]);
			}
		});
		this.setTiles();
	}

	public rotateSide(side: number, toRight: boolean, anim = true)
	{
		if (side > 5 || side < 0)
		{
			console.error("uncorrect side");
			return;
		}
		if (!this.rotateNow)
		{
			if (toRight) this.sides[side].rotateRight();
			else this.sides[side].rotateLeft();

			if (anim && this.parent != undefined)
			{
				const sideCubes = this.getSide(<CubeSide>side);
				for (const el of sideCubes) {
					this.parent.remove(el.mesh);
					this.rotateAxis.add(el.mesh);
				}
				this.rotateNow = true;
				this.rotateSpeedCur = this.rotateSpeed;
				if (toRight) this.rotateSpeedCur *= -1;

				if (side == 0 || side == 5) this.rotateAxisCur = "z";
				else if (side == 1 || side == 3) this.rotateAxisCur = "y";
				else if (side == 2 || side == 4) this.rotateAxisCur = "x";
				if (side == 3 || side == 4 || side == 5) this.rotateSpeedCur *= -1;
			}
		}
	}
	public update()
	{
		this.recreateTiles();
	}
	public animEnded()
	{
		return !this.rotateNow;
	}
	public recreate()
	{
		this.createSides();
		if (this.growOnCreate)
		{
			this.cubes.forEach(el =>
			{
				el.mesh.position.set(0, 0, 0);
			});
			this.growNow = true;
		}
		this.recreateTiles();
	}

	public anim(time: number)
	{
		if (this.rotateNow)
		{
			this.rotateAxis.rotation[this.rotateAxisCur] += this.rotateSpeedCur / 180 * Math.PI;
			if (this.rotateAxis.rotation[this.rotateAxisCur] > Math.PI / 2 ||
				this.rotateAxis.rotation[this.rotateAxisCur] < -Math.PI / 2) this.endAnim();
		}
		if (this.growNow)
		{
			let done = true;
			this.cubes.forEach((el, index) =>
			{
				if (index == 0)
				{
					let scale = el.mesh.position.x / el.toX;
					if (Number.isNaN(scale)) scale = el.mesh.position.y / el.toY;
					if (Number.isNaN(scale)) scale = el.mesh.position.z / el.toZ;
					this.growScaleCur = scale;
				}
				let elDone = this.growOne(el);
				if (!elDone) done = false;
			});
			this.growNow = !done;
		}
	}
	private growOne(el: OneCube)
	{
		const x = this.groveOne_calcOne(el.mesh.position.x, el.toX);
		const y = this.groveOne_calcOne(el.mesh.position.y, el.toY);
		const z = this.groveOne_calcOne(el.mesh.position.z, el.toZ);

		el.mesh.position.x = x.pos;
		el.mesh.position.y = y.pos;
		el.mesh.position.z = z.pos;

		el.mesh.scale.setX(this.growScaleCur);
		el.mesh.scale.setY(this.growScaleCur);
		el.mesh.scale.setZ(this.growScaleCur);

		return x.done && y.done && z.done;
	}
	private groveOne_calcOne(pos: number, toPos: number)
	{
		if (toPos > 0)
		{
			pos += this.growSpeed;
			pos = Math.min(pos, toPos);
		}
		else
		{
			pos -= this.growSpeed;
			pos = Math.max(pos, toPos);
		}
		return {pos, done: pos == toPos};
	}
	private endAnim()
	{
		if (this.parent != undefined)
		{
			this.recreateTiles();
			for (let i = this.rotateAxis.children.length - 1; i >= 0; i--) {
				const el = this.rotateAxis.children[i];
				this.rotateAxis.remove(el);
				this.parent.add(el);
			}
		}
		this.rotateNow = false;
		this.rotateSpeedCur = 0;
		this.rotateAxis.rotation.set(0, 0, 0);
	}
}

//corners: (x == 0 || x == 2) && (y == 0 || y == 2) && (z == 0 || z == 2);

type CubeSide = 0 | 1 | 2 | 3 | 4 | 5;
interface OneCube
{
	x: number,
	y: number,
	z: number,
	toX: number,
	toY: number,
	toZ: number,
	mesh: Mesh,
	tiles: Mesh[],
}