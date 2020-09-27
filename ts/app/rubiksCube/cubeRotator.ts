import { Cube } from "./cube";
import { random } from "../littleLib";

export class CubeRotator
{
	private cube: Cube;
	private mixNow = false;
	private mixPastSide = 0;
	private anim = true;

	constructor(cube: Cube)
	{
		this.cube = cube;
		window.addEventListener("keydown", (e) =>
		{
			const toRight = e.ctrlKey;
			switch (e.code) {
				case "Numpad5": this.cube.rotateSide(0, toRight); break;
				case "Numpad6": this.cube.rotateSide(1, toRight); break;
				case "Numpad2": this.cube.rotateSide(2, toRight); break;
				case "Numpad4": this.cube.rotateSide(3, toRight); break;
				case "Numpad8": this.cube.rotateSide(4, toRight); break;
				case "Numpad9": this.cube.rotateSide(5, toRight); break;
				case "Space": this.mixCube(); break;
			}
		});
	}

	public update()
	{
		if (this.mixNow && this.cube.animEnded())
		{
			this.mixOne();
			if (!this.anim) this.cube.update();
 		}
	}

	private mixCube()
	{
		this.mixNow = !this.mixNow;
	}
	private mixOne()
	{
		let side = random.int(6);
		while (side == this.mixPastSide)
		{
			side = random.int(6);
		}
		this.mixPastSide = side;
		this.cube.rotateSide(side, random.boolean(), this.anim);
	}
}