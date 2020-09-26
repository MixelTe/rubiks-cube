import * as THREE from "three";
import { Side, Tile } from "./side";
import { Mesh, Object3D } from "three";

export class Cube
{
	private width = 6;
	private shift = 8;
	private sides = [
		new Side("blue"),
		new Side("red"),
		new Side("white"),
		new Side("orange"),
		new Side("yellow"),
		new Side("green"),
	];
	private cubes: OneCube[] = [];

	constructor()
	{
		this.sides[0].setSides(this.sides[4], this.sides[1], this.sides[2], this.sides[3]);
		this.sides[1].setSides(this.sides[4], this.sides[5], this.sides[2], this.sides[0]);
		this.sides[2].setSides(this.sides[0], this.sides[1], this.sides[5], this.sides[3]);
		this.sides[3].setSides(this.sides[4], this.sides[0], this.sides[2], this.sides[5]);
		this.sides[4].setSides(this.sides[5], this.sides[1], this.sides[0], this.sides[3]);
		this.sides[5].setSides(this.sides[2], this.sides[1], this.sides[4], this.sides[3]);

		for (let z = 0; z < 3; z++) {
			for (let y = 0; y < 3; y++) {
				for (let x = 0; x < 3; x++)
				{
					const mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(this.width, this.width, this.width), new THREE.MeshPhongMaterial({ color: "gray" }));
					const tiles: Mesh[] = [];
					const center = (x == 1 && y == 1 && (z == 0 || z == 2)) || (z == 1 && !((x == 0 || x == 2) && (y == 0 || y == 2)));
					this.cubes.push({ x, y, z, mesh, tiles, center});
				}
			}
		}
	}

	public create(parent: Object3D)
	{
		this.cubes.forEach(el =>
		{
			el.mesh.position.set(el.x * (this.width + this.shift), el.y * (this.width + this.shift), el.z * (this.width + this.shift));
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
				if (index < 8) this.createTile(el.mesh, this.sides[i].tiles[index], <CubeSide>i);
				else this.createTile(el.mesh, this.sides[i].color, <CubeSide>i);
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
				if (el[var1] == 1)
				{
					if (el[var2] == 0) cubesSorted[7] = el;
					else if (el[var2] == 1) cubesSorted[8] = el;
					else if (el[var2] == 2) cubesSorted[3] = el;
				}
				else if (el[var1] == 0)
				{
					if (b) cubesSorted[el[var2]] = el;
					else cubesSorted[6 - el[var2]] = el;
				}
				else if (el[var1] == 2)
				{
					if (!b) cubesSorted[el[var2]] = el;
					else cubesSorted[6 - el[var2]] = el;
				}
				else throw new Error("switch default");
			});
		}
		switch (side) {
			case 0: setSides("x", "y", true); break;
			case 1:
				cubes.forEach(el =>
				{
					if (el.x == 0) cubesSorted[2 - el.z] = el;
					else if (el.x == 1)
					{
						if (el.z == 0) cubesSorted[3] = el;
						else if (el.z == 1) cubesSorted[8] = el;
						else if (el.z == 2) cubesSorted[7] = el;
					}
					else if (el.x == 2) cubesSorted[4 + el.z] = el;
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
			case 0: getTest = (cube: OneCube) => cube.z == 2; break;
			case 1: getTest = (cube: OneCube) => cube.y == 2; break;
			case 2: getTest = (cube: OneCube) => cube.x == 2; break;
			case 3: getTest = (cube: OneCube) => cube.y == 0; break;
			case 4: getTest = (cube: OneCube) => cube.x == 0; break;
			case 5: getTest = (cube: OneCube) => cube.z == 0; break;
			default: throw new Error("switch default");
		}
		this.cubes.forEach(el =>
		{
			if (getTest(el)) cubes.push(el);
		});
		return cubes;
	}
	private createTile(cube: Mesh, tile: Tile | string, side: CubeSide)
	{
		let color
		if (tile instanceof Tile) color = tile.color;
		else color = tile;
		const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(this.width, this.width), new THREE.MeshPhongMaterial({ color }));
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
	}
	public getShift()
	{
		return this.width + this.shift;
	}
}

//corners: (x == 0 || x == 2) && (y == 0 || y == 2) && (z == 0 || z == 2);
// el.mesh.children.forEach(child => el.mesh.remove(child));

type CubeSide = 0 | 1 | 2 | 3 | 4 | 5;
interface OneCube
{
	x: number,
	y: number,
	z: number,
	center: boolean,
	mesh: Mesh,
	tiles: Mesh[],
}