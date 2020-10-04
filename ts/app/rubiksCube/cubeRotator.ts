import { Cube } from "./cube";
import { random } from "../littleLib";

export class CubeRotator
{
	private cube: Cube;
	private mixNow = false;
	private mixPastSide = 0;
	private solveNow = false;
	private solveStage: 0 = 0;
	private rotationAlg: RAlg[] = [];
	private anim = true;

	constructor(cube: Cube)
	{
		this.cube = cube;
		const stopAll = () => { this.solveNow = false; this.mixNow = false; };
		window.addEventListener("keydown", (e) =>
		{
			const toRight = e.ctrlKey;
			switch (e.code) {
				case "Numpad5": this.cube.rotateSide(0, toRight); stopAll(); break;
				case "Numpad6": this.cube.rotateSide(1, toRight); stopAll(); break;
				case "Numpad2": this.cube.rotateSide(2, toRight); stopAll(); break;
				case "Numpad4": this.cube.rotateSide(3, toRight); stopAll(); break;
				case "Numpad8": this.cube.rotateSide(4, toRight); stopAll(); break;
				case "Numpad9": this.cube.rotateSide(5, toRight); stopAll(); break;
				case "Space": this.mixNow = !this.mixNow; this.solveNow = false; this.rotationAlg = []; break;
				case "Enter": this.solveNow = !this.solveNow; this.mixNow = false; break;
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
		if (this.solveNow && !this.mixNow && this.cube.animEnded())
		{
			this.solveStep();
			if (!this.anim) this.cube.update();
 		}
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


	private solveStep()
	{
		if (this.rotationAlg.length == 0)
		{
			switch (this.solveStage) {
				case 0: this.solveStage0(); break;
				default: throw new Error("switch default");
			}
		}
		else
		{
			this.rotationAlg[0].Run();
			this.rotationAlg.shift();
			if (this.rotationAlg.length == 0) this.solveNow = false;
		}
	}
	private solveStage0()
	{
		const tiles0 = this.cube.sides[0].tiles;
		const tiles1 = this.cube.sides[1].tiles;
		const tiles2 = this.cube.sides[2].tiles;
		const tiles3 = this.cube.sides[3].tiles;
		const tiles4 = this.cube.sides[4].tiles;
		const tiles5 = this.cube.sides[5].tiles;
		if (tiles0[1].colorN != 0 || tiles4[5].colorN != 4)
		{
			if (tiles0[1].colorN == 4 && tiles4[5].colorN == 0)
			{
				this.rAlg(4, false);
				this.rAlg(4, false);
				this.rAlg(5, true);
				this.rAlg(3, true);
				this.rAlg(4, false);
				this.rAlg(3, true);
				console.log("alg0");
			}//on bottom
			else if (this.check2(tiles5[1].colorN, 0, 4) && this.check2(tiles2[5].colorN, 0, 4))
			{
				this.rAlg(5, false);
				this.rAlg(5, false);
				this.rAlg(4, false);
				this.rAlg(4, false);
				console.log("alg1");
			}
			else if (this.check2(tiles5[3].colorN, 0, 4) && this.check2(tiles1[3].colorN, 0, 4))
			{
				this.rAlg(5, true);
				this.rAlg(4, false);
				this.rAlg(4, false);
				console.log("alg2");
			}
			else if (this.check2(tiles5[5].colorN, 0, 4) && this.check2(tiles4[1].colorN, 0, 4))
			{
				this.rAlg(4, false);
				this.rAlg(4, false);
				console.log("alg3");
			}
			else if (this.check2(tiles5[7].colorN, 0, 4) && this.check2(tiles3[7].colorN, 0, 4))
			{
				this.rAlg(5, false);
				this.rAlg(4, false);
				this.rAlg(4, false);
				console.log("alg4");
			}//on side
			else if (this.check2(tiles4[3].colorN, 0, 4) && this.check2(tiles1[1].colorN, 0, 4))
			{
				this.rAlg(4, true);
				console.log("alg5");
			}
			else if (this.check2(tiles4[7].colorN, 0, 4) && this.check2(tiles3[1].colorN, 0, 4))
			{
				this.rAlg(4, false);
				console.log("alg6");
			}
			else if (this.check2(tiles2[3].colorN, 0, 4) && this.check2(tiles1[5].colorN, 0, 4))
			{
				this.rAlg(2, true);
				this.rAlg(5, true);
				this.rAlg(5, true);
				this.rAlg(4, true);
				this.rAlg(4, true);
				console.log("alg7");
			}
			else if (this.check2(tiles2[7].colorN, 0, 4) && this.check2(tiles3[5].colorN, 0, 4))
			{
				this.rAlg(2, false);
				this.rAlg(5, true);
				this.rAlg(5, true);
				this.rAlg(4, true);
				this.rAlg(4, true);
				console.log("alg7");
			}//on top
			else if (this.check2(tiles0[3].colorN, 0, 4) && this.check2(tiles1[7].colorN, 0, 4))
			{
				this.rAlg(1, true);
				this.rAlg(4, true);
				console.log("alg8");
			}
			else if (this.check2(tiles0[5].colorN, 0, 4) && this.check2(tiles2[1].colorN, 0, 4))
			{
				this.rAlg(2, true);
				this.rAlg(2, true);
				this.rAlg(5, true);
				this.rAlg(5, true);
				this.rAlg(4, true);
				this.rAlg(4, true);
				console.log("alg9");
			}
			else if (this.check2(tiles0[7].colorN, 0, 4) && this.check2(tiles3[3].colorN, 0, 4))
			{
				this.rAlg(3, false);
				this.rAlg(4, false);
				console.log("alg10");
			}
		}
	}
	private check2(num: number, check1: number, check2: number)
	{
		return (num == check1) || (num == check2);
	}
	private rAlg(side: number, toRight: boolean)
	{
		this.rotationAlg.push(new RAlg(side, toRight, this.anim, this.cube));
	}
}

class RAlg
{
	private side: number;
	private toRight: boolean;
	private cube: Cube;
	private anim: boolean;

	constructor(side: number, toRight: boolean, anim: boolean, cube: Cube)
	{
		this.anim = anim;
		this.cube = cube;
		this.side = side;
		this.toRight = toRight;
	}

	public Run()
	{
		this.cube.rotateSide(this.side, this.toRight, this.anim);
	}
}