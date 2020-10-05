import { Cube } from "./cube";
import { random } from "../littleLib";

export class CubeRotator
{
	private cube: Cube;
	private mixNow = false;
	private mixPastSide = 0;
	private animMix = false;
	private solveNow = false;
	private solveStage: 0 | 1 | 2 | 3 | 4 = 0;
	private rotationAlg: RAlg[] = [];
	private animSolve = true;
	private DEV_log = true;
	private DEV_stageColor = "lightblue";

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
				case "Digit0": this.cube.rotateSide(0, toRight); stopAll(); break;
				case "Digit1": this.cube.rotateSide(1, toRight); stopAll(); break;
				case "Digit2": this.cube.rotateSide(2, toRight); stopAll(); break;
				case "Digit3": this.cube.rotateSide(3, toRight); stopAll(); break;
				case "Digit4": this.cube.rotateSide(4, toRight); stopAll(); break;
				case "Digit5": this.cube.rotateSide(5, toRight); stopAll(); break;
				case "Space": this.mixNow = !this.mixNow; this.solveNow = false; this.rotationAlg = []; break;
				case "Enter": this.solveNow = !this.solveNow; this.mixNow = false; this.solveStage = 0; break;
			}
		});
	}

	public update()
	{
		if (this.mixNow && this.cube.animEnded())
		{
			this.mixOne();
			if (!this.animMix) this.cube.update();
 		}
		if (this.solveNow && !this.mixNow && this.cube.animEnded())
		{
			this.solveStep();
			if (!this.animSolve) this.cube.update();
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
		this.cube.rotateSide(side, random.boolean(), this.animMix);
	}


	private solveStep()
	{
		if (this.rotationAlg.length == 0)
		{
			switch (this.solveStage) {
				case 0: this.solveStage0(); break;
				case 1: this.solveStage1(); break;
				case 2: this.solveStage2(); break;
				case 3: this.solveStage3(); break;
				case 4:  break;
				default: throw new Error("switch default");
			}
		}
		else
		{
			this.rotationAlg[0].Run();
			this.rotationAlg.shift();
			// if (this.rotationAlg.length == 0) this.solveNow = false;
		}
	}

	private solveStage0()
	{
		const tiles0 = this.cube.sides[0].tiles;
		const tiles1 = this.cube.sides[1].tiles;
		const tiles2 = this.cube.sides[2].tiles;
		const tiles3 = this.cube.sides[3].tiles;
		const tiles4 = this.cube.sides[4].tiles;
		if (tiles0[1].colorN != 0 || tiles4[5].colorN != 4)
		{
			this.solveStage0_OneCube(4, 0);
		}
		else if (tiles0[3].colorN != 0 || tiles1[7].colorN != 1)
		{
			this.solveStage0_OneCube(1, 1);
		}
		else if (tiles0[5].colorN != 0 || tiles2[1].colorN != 2)
		{
			this.solveStage0_OneCube(2, 2);
		}
		else if (tiles0[7].colorN != 0 || tiles3[3].colorN != 3)
		{
			this.solveStage0_OneCube(3, 3);
		}
		else
		{
			this.solveStage = 1;
		}
	}
	private solveStage0_OneCube(color: 0 | 1 | 2 | 3 | 4 | 5, pos: 0 | 1 | 2 | 3)
	{
		this.log("stage0:", this.DEV_stageColor);

		const tiles0 = this.cube.sides[0].tiles;
		const tiles1 = this.cube.sides[1].tiles;
		const tiles2 = this.cube.sides[2].tiles;
		const tiles3 = this.cube.sides[3].tiles;
		const tiles4 = this.cube.sides[4].tiles;
		const tiles5 = this.cube.sides[5].tiles;

		//on bottom
		if (this.check2(tiles5[1].colorN, 0, color) && this.check2(tiles2[5].colorN, 0, color))
		{
			switch (pos) {
				case 0:
					this.rAlg(5, false);
					this.rAlg(5, false);
					this.rAlg(4, false);
					this.rAlg(4, false);
					break;
				case 1:
					this.rAlg(5, true);
					this.rAlg(1, false);
					this.rAlg(1, false);
					break;
				case 2:
					this.rAlg(2, false);
					this.rAlg(2, false);
					break;
				case 3:
					this.rAlg(5, false);
					this.rAlg(3, false);
					this.rAlg(3, false);
					break;

				default: throw new Error("switch default");
			}
			this.log("alg1_" + pos);
		}
		else if (this.check2(tiles5[3].colorN, 0, color) && this.check2(tiles1[3].colorN, 0, color))
		{
			switch (pos) {
				case 0:
					this.rAlg(5, true);
					this.rAlg(4, false);
					this.rAlg(4, false);
					break;
				case 1:
					this.rAlg(1, false);
					this.rAlg(1, false);
					break;
				case 2:
					this.rAlg(5, false);
					this.rAlg(2, false);
					this.rAlg(2, false);
					break;
				case 3:
					this.rAlg(5, true);
					this.rAlg(5, true);
					this.rAlg(3, false);
					this.rAlg(3, false);
					break;

				default: throw new Error("switch default");
			}
			this.log("alg2_" + pos);
		}
		else if (this.check2(tiles5[5].colorN, 0, color) && this.check2(tiles4[1].colorN, 0, color))
		{
			switch (pos) {
				case 0:
					this.rAlg(4, false);
					this.rAlg(4, false);
					break;
				case 1:
					this.rAlg(5, false);
					this.rAlg(1, false);
					this.rAlg(1, false);
					break;
				case 2:
					this.rAlg(5, false);
					this.rAlg(5, false);
					this.rAlg(2, false);
					this.rAlg(2, false);
					break;
				case 3:
					this.rAlg(5, true);
					this.rAlg(3, false);
					this.rAlg(3, false);
					break;

				default: throw new Error("switch default");
			}
			this.log("alg3_" + pos);
		}
		else if (this.check2(tiles5[7].colorN, 0, color) && this.check2(tiles3[7].colorN, 0, color))
		{
			switch (pos) {
				case 0:
					this.rAlg(5, false);
					this.rAlg(4, false);
					this.rAlg(4, false);
					break;
				case 1:
					this.rAlg(5, false);
					this.rAlg(5, false);
					this.rAlg(1, false);
					this.rAlg(1, false);
					break;
				case 2:
					this.rAlg(5, true);
					this.rAlg(2, false);
					this.rAlg(2, false);
					break;
				case 3:
					this.rAlg(3, false);
					this.rAlg(3, false);
					break;

				default: throw new Error("switch default");
			}
			this.log("alg4_" + pos);
		}
		//on side
		else if (this.check2(tiles4[3].colorN, 0, color) && this.check2(tiles1[1].colorN, 0, color))
		{
			switch (pos) {
				case 0:
					this.rAlg(4, true);
					break;
				case 1:
					this.rAlg(1, false);
					break;
				case 2:
					this.rAlg(0, false);
					this.rAlg(1, false);
					this.rAlg(0, true);
					break;
				case 3:
					this.rAlg(0, true);
					this.rAlg(4, true);
					this.rAlg(0, false);
					break;

				default: throw new Error("switch default");
			}
			this.log("alg5_" + pos);
		}
		else if (this.check2(tiles4[7].colorN, 0, color) && this.check2(tiles3[1].colorN, 0, color))
		{
			switch (pos) {
				case 0:
					this.rAlg(4, false);
					break;
				case 1:
					this.rAlg(0, false);
					this.rAlg(4, false);
					this.rAlg(0, true);
					break;
				case 2:
					this.rAlg(0, true);
					this.rAlg(3, true);
					this.rAlg(0, false);
					break;
				case 3:
					this.rAlg(3, true);
					break;

				default: throw new Error("switch default");
			}
			this.log("alg6_" + pos);
		}
		else if (this.check2(tiles2[3].colorN, 0, color) && this.check2(tiles1[5].colorN, 0, color))
		{
			switch (pos) {
				case 0:
					this.rAlg(0, true);
					this.rAlg(1, true);
					this.rAlg(0, false);
					break;
				case 1:
					this.rAlg(1, true);
					break;
				case 2:
					this.rAlg(2, false);
					break;
				case 3:
					this.rAlg(0, false);
					this.rAlg(2, false);
					this.rAlg(0, true);
					break;

				default: throw new Error("switch default");
			}
			this.log("alg7_" + pos);
		}
		else if (this.check2(tiles2[7].colorN, 0, color) && this.check2(tiles3[5].colorN, 0, color))
		{
			switch (pos) {
				case 0:
					this.rAlg(0, false);
					this.rAlg(3, false);
					this.rAlg(0, true);
					break;
				case 1:
					this.rAlg(0, true);
					this.rAlg(2, true);
					this.rAlg(0, false);
					break;
				case 2:
					this.rAlg(2, true);
					break;
				case 3:
					this.rAlg(3, false);
					break;

				default: throw new Error("switch default");
			}
			this.log("alg8_" + pos);
		}
		//on top
		else if (this.check2(tiles0[3].colorN, 0, color) && this.check2(tiles1[7].colorN, 0, color))
		{
			switch (pos) {
				case 0:
					this.rAlg(1, true);
					this.rAlg(4, true);
					break;
				case 1:
					if (tiles0[3].colorN == color && tiles1[7].colorN == 0)
					{
						this.rAlg(1, false);
						this.rAlg(1, false);
						this.rAlg(5, true);
						this.rAlg(4, true);
						this.rAlg(1, false);
						this.rAlg(4, false);
					}
					break;
				case 2:
					this.rAlg(1, false);
					this.rAlg(2, false);
					break;
				case 3:
					this.rAlg(1, false);
					this.rAlg(1, false);
					this.rAlg(5, false);
					this.rAlg(5, false);
					this.rAlg(3, false);
					this.rAlg(3, false);
					break;

				default: throw new Error("switch default");
			}
			this.log("alg9_" + pos);
		}
		else if (this.check2(tiles0[5].colorN, 0, color) && this.check2(tiles2[1].colorN, 0, color))
		{
			switch (pos) {
				case 0:
					this.rAlg(2, true);
					this.rAlg(2, true);
					this.rAlg(5, true);
					this.rAlg(5, true);
					this.rAlg(4, true);
					this.rAlg(4, true);
					break;
				case 1:
					this.rAlg(2, true);
					this.rAlg(1, true);
					break;
				case 2:
					if (tiles0[5].colorN == color && tiles2[1].colorN == 0)
					{
						this.rAlg(2, false);
						this.rAlg(2, false);
						this.rAlg(5, true);
						this.rAlg(1, true);
						this.rAlg(2, false);
						this.rAlg(1, false);
					}
					break;
				case 3:
					this.rAlg(2, false);
					this.rAlg(3, false);
					break;

				default: throw new Error("switch default");
			}
			this.log("alg10_" + pos);
		}
		else if (this.check2(tiles0[7].colorN, 0, color) && this.check2(tiles3[3].colorN, 0, color))
		{
			switch (pos) {
				case 0:
					this.rAlg(3, false);
					this.rAlg(4, false);
					break;
				case 1:
					this.rAlg(3, true);
					this.rAlg(3, true);
					this.rAlg(5, true);
					this.rAlg(5, true);
					this.rAlg(1, true);
					this.rAlg(1, true);
					break;
				case 2:
					this.rAlg(3, true);
					this.rAlg(2, true);
					break;
				case 3:
					if (tiles0[7].colorN == color && tiles3[3].colorN == 0)
					{
						this.rAlg(3, false);
						this.rAlg(3, false);
						this.rAlg(5, true);
						this.rAlg(2, true);
						this.rAlg(3, false);
						this.rAlg(2, false);
						}
					break;

				default: throw new Error("switch default");
			}
			this.log("alg11_" + pos);
		}
		else if (this.check2(tiles0[1].colorN, 0, color) && this.check2(tiles4[5].colorN, 0, color))
		{
			switch (pos) {
				case 0:
					if (tiles0[1].colorN == color && tiles4[5].colorN == 0)
					{
						this.rAlg(4, false);
						this.rAlg(4, false);
						this.rAlg(5, true);
						this.rAlg(3, true);
						this.rAlg(4, false);
						this.rAlg(3, false);
					}
					break;
				case 1:
					this.rAlg(4, false);
					this.rAlg(1, false);
					break;
				case 2:
					this.rAlg(4, true);
					this.rAlg(4, true);
					this.rAlg(5, true);
					this.rAlg(5, true);
					this.rAlg(2, true);
					this.rAlg(2, true);
					break;
				case 3:
					this.rAlg(4, true);
					this.rAlg(3, true);
					break;

				default: throw new Error("switch default");
			}
			this.log("alg12_" + pos);
		}
	}

	private solveStage1()
	{
		const tiles0 = this.cube.sides[0].tiles;
		const tiles1 = this.cube.sides[1].tiles;
		const tiles2 = this.cube.sides[2].tiles;
		const tiles3 = this.cube.sides[3].tiles;
		const tiles4 = this.cube.sides[4].tiles;
		if (tiles0[0].colorN != 0 || tiles3[2].colorN != 3 || tiles4[6].colorN != 4)
		{
			this.solveStage1_OneCube(0);
		}
		else if (tiles0[2].colorN != 0 || tiles4[4].colorN != 4 || tiles1[0].colorN != 1)
		{
			this.solveStage1_OneCube(1);
		}
		else if (tiles0[4].colorN != 0 || tiles1[6].colorN != 1 || tiles2[2].colorN != 2)
		{
			this.solveStage1_OneCube(2);
		}
		else if (tiles0[6].colorN != 0 || tiles2[0].colorN != 2 || tiles3[4].colorN != 3)
		{
			this.solveStage1_OneCube(3);
		}
		else
		{
			this.solveStage = 2;
		}
	}
	private solveStage1_OneCube(pos: 0 | 1 | 2 | 3)
	{
		this.log("stage1:", this.DEV_stageColor);

		let c1, c2, c3;
		switch (pos) {
			case 0: c1 = 0; c2 = 3; c3 = 4; break;
			case 1: c1 = 0; c2 = 4; c3 = 1; break;
			case 2: c1 = 0; c2 = 1; c3 = 2; break;
			case 3: c1 = 0; c2 = 2; c3 = 3; break;
			default: throw new Error("switch default");
		}

		const tiles0 = this.cube.sides[0].tiles;
		const tiles1 = this.cube.sides[1].tiles;
		const tiles2 = this.cube.sides[2].tiles;
		const tiles3 = this.cube.sides[3].tiles;
		const tiles4 = this.cube.sides[4].tiles;
		const tiles5 = this.cube.sides[5].tiles;

		//on bottom
		if (this.check3(tiles5[0].colorN, c1, c2, c3) && this.check3(tiles3[6].colorN, c1, c2, c3) && this.check3(tiles2[6].colorN, c1, c2, c3))
		{
			switch (pos) {
				case 0:
					this.rAlg(4, true);
					this.rAlg(5, false);
					this.rAlg(4, false);
					break;
				case 1:
					this.rAlg(5, false);
					this.rAlg(1, true);
					this.rAlg(5, false);
					this.rAlg(1, false);
					break;
				case 2:
					this.rAlg(1, false);
					this.rAlg(5, true);
					this.rAlg(1, true);
					break;
				case 3:
					this.rAlg(5, false);
					this.rAlg(2, false);
					this.rAlg(5, true);
					this.rAlg(2, true);
					break;

				default: throw new Error("switch default");
			}
			this.log("alg1_" + pos);
		}
		else if (this.check3(tiles5[2].colorN, c1, c2, c3) && this.check3(tiles2[4].colorN, c1, c2, c3) && this.check3(tiles1[4].colorN, c1, c2, c3))
		{
			switch (pos) {
				case 0:
					this.rAlg(5, false);
					this.rAlg(4, true);
					this.rAlg(5, false);
					this.rAlg(4, false);
					break;
				case 1:
					this.rAlg(4, false);
					this.rAlg(5, true);
					this.rAlg(4, true);
					break;
				case 2:
					this.rAlg(5, false);
					this.rAlg(1, false);
					this.rAlg(5, true);
					this.rAlg(1, true);
					break;
				case 3:
					this.rAlg(3, true);
					this.rAlg(5, false);
					this.rAlg(3, false);
					break;

				default: throw new Error("switch default");
			}
			this.log("alg2_" + pos);
		}
		else if (this.check3(tiles5[4].colorN, c1, c2, c3) && this.check3(tiles1[2].colorN, c1, c2, c3) && this.check3(tiles4[2].colorN, c1, c2, c3))
		{
			switch (pos) {
				case 0:
					this.rAlg(3, false);
					this.rAlg(5, true);
					this.rAlg(3, true);
					break;
				case 1:
					this.rAlg(5, false);
					this.rAlg(4, false);
					this.rAlg(5, true);
					this.rAlg(4, true);
					break;
				case 2:
					this.rAlg(2, true);
					this.rAlg(5, false);
					this.rAlg(2, false);
					break;
				case 3:
					this.rAlg(5, false);
					this.rAlg(3, true);
					this.rAlg(5, false);
					this.rAlg(3, false);
					break;

				default: throw new Error("switch default");
			}
			this.log("alg3_" + pos);
		}
		else if (this.check3(tiles5[6].colorN, c1, c2, c3) && this.check3(tiles4[0].colorN, c1, c2, c3) && this.check3(tiles3[0].colorN, c1, c2, c3))
		{
			switch (pos) {
				case 0:
					this.rAlg(5, false);
					this.rAlg(3, false);
					this.rAlg(5, true);
					this.rAlg(3, true);
					break;
				case 1:
					this.rAlg(1, true);
					this.rAlg(5, false);
					this.rAlg(1, false);
					break;
				case 2:
					this.rAlg(5, false);
					this.rAlg(2, true);
					this.rAlg(5, false);
					this.rAlg(2, false);
					break;
				case 3:
					this.rAlg(2, false);
					this.rAlg(5, true);
					this.rAlg(2, true);
					break;

				default: throw new Error("switch default");
			}
			this.log("alg4_" + pos);
		}
		//on top
		else if (this.check3(tiles0[0].colorN, c1, c2, c3) && this.check3(tiles3[2].colorN, c1, c2, c3) && this.check3(tiles4[6].colorN, c1, c2, c3))
		{
			switch (pos) {
				case 0:
					for (let i = 0; i < 2; i++)
					{
						this.rAlg(4, true);
						this.rAlg(5, true);
						this.rAlg(4, false);
						this.rAlg(5, false);
					}
					break;
				case 1:
					this.rAlg(3, false);
					this.rAlg(1, true);
					this.rAlg(5, false);
					this.rAlg(3, true);
					this.rAlg(1, false);
					break;
				case 2:
					this.rAlg(3, false);
					this.rAlg(2, true);
					this.rAlg(5, true);
					this.rAlg(5, true);
					this.rAlg(2, false);
					this.rAlg(3, true);
					break;
				case 3:
					this.rAlg(4, true);
					this.rAlg(2, false);
					this.rAlg(5, true);
					this.rAlg(2, true);
					this.rAlg(4, false);
					break;

				default: throw new Error("switch default");
			}
			this.log("alg5_" + pos);
		}
		else if (this.check3(tiles0[2].colorN, c1, c2, c3) && this.check3(tiles4[4].colorN, c1, c2, c3) && this.check3(tiles1[0].colorN, c1, c2, c3))
		{
			switch (pos) {
				case 0:
					this.rAlg(1, true);
					this.rAlg(3, false);
					this.rAlg(5, true);
					this.rAlg(3, true);
					this.rAlg(1, false);
					break;
				case 1:
					for (let i = 0; i < 2; i++)
					{
						this.rAlg(1, true);
						this.rAlg(5, true);
						this.rAlg(1, false);
						this.rAlg(5, false);
					}
					break;
				case 2:
					this.rAlg(4, false);
					this.rAlg(2, true);
					this.rAlg(5, false);
					this.rAlg(2, false);
					this.rAlg(4, true);
					break;
				case 3:
					this.rAlg(4, false);
					this.rAlg(3, true);
					this.rAlg(5, true);
					this.rAlg(5, true);
					this.rAlg(3, false);
					this.rAlg(4, true);
					break;

				default: throw new Error("switch default");
			}
			this.log("alg6_" + pos);
		}
		else if (this.check3(tiles0[4].colorN, c1, c2, c3) && this.check3(tiles1[6].colorN, c1, c2, c3) && this.check3(tiles2[2].colorN, c1, c2, c3))
		{
			switch (pos) {
				case 0:
					this.rAlg(1, false);
					this.rAlg(4, true);
					this.rAlg(5, true);
					this.rAlg(5, true);
					this.rAlg(4, false);
					this.rAlg(1, true);
					break;
				case 1:
					this.rAlg(2, true);
					this.rAlg(4, false);
					this.rAlg(5, true);
					this.rAlg(4, true);
					this.rAlg(2, false);
					break;
				case 2:
					for (let i = 0; i < 2; i++)
					{
						this.rAlg(2, true);
						this.rAlg(5, true);
						this.rAlg(2, false);
						this.rAlg(5, false);
					}
					break;
				case 3:
					this.rAlg(1, false);
					this.rAlg(3, true);
					this.rAlg(5, false);
					this.rAlg(3, false);
					this.rAlg(1, true);
					break;

				default: throw new Error("switch default");
			}
			this.log("alg7_" + pos);
		}
		else if (this.check3(tiles0[6].colorN, c1, c2, c3) && this.check3(tiles2[0].colorN, c1, c2, c3) && this.check3(tiles3[4].colorN, c1, c2, c3))
		{
			switch (pos) {
				case 0:
					this.rAlg(2, false);
					this.rAlg(4, true);
					this.rAlg(5, false);
					this.rAlg(4, false);
					this.rAlg(2, true);
					break;
				case 1:
					this.rAlg(2, false);
					this.rAlg(1, true);
					this.rAlg(5, true);
					this.rAlg(5, true);
					this.rAlg(1, false);
					this.rAlg(2, true);
					break;
				case 2:
					this.rAlg(3, true);
					this.rAlg(1, false);
					this.rAlg(5, true);
					this.rAlg(1, true);
					this.rAlg(3, false);
					break;
				case 3:
					for (let i = 0; i < 2; i++)
					{
						this.rAlg(3, true);
						this.rAlg(5, true);
						this.rAlg(3, false);
						this.rAlg(5, false);
					}
					break;

				default: throw new Error("switch default");
			}
			this.log("alg8_" + pos);
		}
	}

	private solveStage2()
	{
		const tiles1 = this.cube.sides[1].tiles;
		const tiles2 = this.cube.sides[2].tiles;
		const tiles3 = this.cube.sides[3].tiles;
		const tiles4 = this.cube.sides[4].tiles;

		if (tiles1[5].colorN != 1 || tiles2[3].colorN != 2)
		{
			this.solveStage2_OneCube(0);
		}
		else if (tiles2[7].colorN != 2 || tiles3[5].colorN != 3)
		{
			this.solveStage2_OneCube(1);
		}
		else if (tiles3[1].colorN != 3 || tiles4[7].colorN != 4)
		{
			this.solveStage2_OneCube(2);
		}
		else if (tiles4[3].colorN != 4 || tiles1[1].colorN != 1)
		{
			this.solveStage2_OneCube(3);
		}
		else
		{
			this.solveStage = 3;
		}
	}
	private solveStage2_OneCube(pos: 0 | 1 | 2 | 3)
	{
		this.log("stage2:", this.DEV_stageColor);

		let c1, c2;
		switch (pos) {
			case 0: c1 = 1; c2 = 2; break;
			case 1: c1 = 2; c2 = 3; break;
			case 2: c1 = 3; c2 = 4; break;
			case 3: c1 = 4; c2 = 1; break;
			default: throw new Error("switch default");
		}

		const tiles1 = this.cube.sides[1].tiles;
		const tiles2 = this.cube.sides[2].tiles;
		const tiles3 = this.cube.sides[3].tiles;
		const tiles4 = this.cube.sides[4].tiles;
		const tiles5 = this.cube.sides[5].tiles;

		//on bottom
		if (this.check2(tiles5[1].colorN, c1, c2) && this.check2(tiles2[5].colorN, c1, c2))
		{
			switch (pos) {
				case 0:
					this.rAlg(5, true);
					this.solveStage2_CubeToSide(1, 2);
					break;
				case 1:
					this.solveStage2_CubeToSide(2, 3);
					break;
				case 2:
					this.rAlg(5, false);
					this.solveStage2_CubeToSide(3, 4);
					break;
				case 3:
					this.rAlg(5, false);
					this.rAlg(5, false);
					this.solveStage2_CubeToSide(4, 1);
					break;

				default: throw new Error("switch default");
			}
			this.log("alg1_" + pos);
		}
		else if (this.check2(tiles5[3].colorN, c1, c2) && this.check2(tiles1[3].colorN, c1, c2))
		{
			switch (pos) {
				case 0:
					this.solveStage2_CubeToSide(1, 2);
					break;
				case 1:
					this.rAlg(5, false);
					this.solveStage2_CubeToSide(2, 3);
					break;
				case 2:
					this.rAlg(5, false);
					this.rAlg(5, false);
					this.solveStage2_CubeToSide(3, 4);
					break;
				case 3:
					this.rAlg(5, true);
					this.solveStage2_CubeToSide(4, 1);
					break;

				default: throw new Error("switch default");
			}
			this.log("alg2_" + pos);
		}
		else if (this.check2(tiles5[5].colorN, c1, c2) && this.check2(tiles4[1].colorN, c1, c2))
		{
			switch (pos) {
				case 0:
					this.rAlg(5, false);
					this.solveStage2_CubeToSide(1, 2);
					break;
				case 1:
					this.rAlg(5, false);
					this.rAlg(5, false);
					this.solveStage2_CubeToSide(2, 3);
					break;
				case 2:
					this.rAlg(5, true);
					this.solveStage2_CubeToSide(3, 4);
					break;
				case 3:
					this.solveStage2_CubeToSide(4, 1);
					break;

				default: throw new Error("switch default");
			}
			this.log("alg3_" + pos);
		}
		else if (this.check2(tiles5[7].colorN, c1, c2) && this.check2(tiles3[7].colorN, c1, c2))
		{
			switch (pos) {
				case 0:
					this.rAlg(5, false);
					this.rAlg(5, false);
					this.solveStage2_CubeToSide(1, 2);
					break;
				case 1:
					this.rAlg(5, true);
					this.solveStage2_CubeToSide(2, 3);
					break;
				case 2:
					this.solveStage2_CubeToSide(3, 4);
					break;
				case 3:
					this.rAlg(5, false);
					this.solveStage2_CubeToSide(4, 1);
					break;

				default: throw new Error("switch default");
			}
			this.log("alg4_" + pos);
		}
		//on side
		else if (this.check2(tiles1[5].colorN, c1, c2) && this.check2(tiles2[3].colorN, c1, c2))
		{
			this.solveStage2_CubeToSide(1, 2);
			this.log("alg5_" + pos);
		}
		else if (this.check2(tiles2[7].colorN, c1, c2) && this.check2(tiles3[5].colorN, c1, c2))
		{
			this.solveStage2_CubeToSide(2, 3);
			this.log("alg6_" + pos);
		}
		else if (this.check2(tiles3[1].colorN, c1, c2) && this.check2(tiles4[7].colorN, c1, c2))
		{
			this.solveStage2_CubeToSide(3, 4);
			this.log("alg7_" + pos);
		}
		else if (this.check2(tiles4[3].colorN, c1, c2) && this.check2(tiles1[1].colorN, c1, c2))
		{
			this.solveStage2_CubeToSide(4, 1);
			this.log("alg8_" + pos);
		}
	}
	private solveStage2_CubeToSide(frontSide: number, leftSide: number)
	{
		this.rAlg(5, true);
		this.rAlg(leftSide, true);
		this.rAlg(5, false);
		this.rAlg(leftSide, false);
		this.rAlg(5, false);
		this.rAlg(frontSide, false);
		this.rAlg(5, true);
		this.rAlg(frontSide, true);
	}

	private solveStage3()
	{
		const tiles1 = this.cube.sides[1].tiles;
		const tiles2 = this.cube.sides[2].tiles;
		const tiles3 = this.cube.sides[3].tiles;
		const tiles4 = this.cube.sides[4].tiles;
		const tiles5 = this.cube.sides[5].tiles;

		this.log("stage3:", this.DEV_stageColor);
		if (!(this.check2(tiles5[1].colorN, 2, 5) && this.check2(tiles2[5].colorN, 2, 5)))
		{
			this.log("alg1");
			if (this.check2(tiles5[3].colorN, 2, 5) && this.check2(tiles1[3].colorN, 2, 5))
			{
				this.rAlg(5, false);
			}
			else if (this.check2(tiles5[5].colorN, 2, 5) && this.check2(tiles4[1].colorN, 2, 5))
			{
				this.rAlg(5, true);
				this.rAlg(5, true);
			}
			else if (this.check2(tiles5[7].colorN, 2, 5) && this.check2(tiles3[7].colorN, 2, 5))
			{
				this.rAlg(5, true);
			}
		}
		else if (!(this.check2(tiles5[3].colorN, 1, 5) && this.check2(tiles1[3].colorN, 1, 5)))
		{
			this.log("alg2");
			if (this.check2(tiles5[5].colorN, 1, 5) && this.check2(tiles4[1].colorN, 1, 5))
			{
				this.solveStage3_SwapCubes(1, 2);
			}
			else if (this.check2(tiles5[7].colorN, 1, 5) && this.check2(tiles3[7].colorN, 1, 5))
			{
				this.solveStage3_SwapCubes(4, 1);
				this.solveStage3_SwapCubes(1, 2);
			}
		}
		else if (!(this.check2(tiles5[5].colorN, 4, 5) && this.check2(tiles4[1].colorN, 4, 5)))
		{
			this.log("alg3");
			this.solveStage3_SwapCubes(4, 1);
		}
		else
		{
			this.solveStage = 4;
		}
	}
	private solveStage3_SwapCubes(frontSide: number, rightSide: number)
	{
		this.rAlg(5, true);
		this.rAlg(frontSide, true);
		this.rAlg(rightSide, true);
		this.rAlg(5, true);
		this.rAlg(rightSide, false);
		this.rAlg(5, false);
		this.rAlg(frontSide, false);
	}

	private check2(num: number, check1: number, check2: number)
	{
		return (num == check1) || (num == check2);
	}
	private check3(num: number, check1: number, check2: number, check3: number)
	{
		return (num == check1) || (num == check2) || (num == check3);
	}
	private rAlg(side: number, toRight: boolean)
	{
		// this.rotationAlg.push(new RAlg(side, toRight, this.animSolve, this.cube));
		this.rotationAlg.push(new RAlg(side, toRight, this.solveStage >= 3 ? this.animSolve : false, this.cube));
	}
	private log(text: string, color = "")
	{
		if (this.DEV_log) console.log(`%c${text}`, `color: ${color}`);
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