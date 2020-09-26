export class Side
{
	public tiles: Tile[] = [];
	public color: string;
	private top: Side = this;
	private left: Side = this;
	private right: Side = this;
	private down: Side = this;

	constructor(color: string)
	{
		this.color = color;
		for (let i = 0; i < 8; i++)
		{
			this.tiles.push(new Tile(color));
		}
	}

	public setSides(top: Side, right: Side, down: Side, left: Side)
	{
		this.top = top;
		this.left = left;
		this.right = right;
		this.down = down;
	}

	public rotateRight()
	{
		const tilesRotated = [
			this.tiles[6],
			this.tiles[7],
			this.tiles[0],
			this.tiles[1],
			this.tiles[2],
			this.tiles[3],
			this.tiles[4],
			this.tiles[5],
		];
		this.tiles = tilesRotated;

		const t_top = this.top.getTiles(this);
		const t_right = this.right.getTiles(this);
		const t_down = this.down.getTiles(this);
		const t_left = this.left.getTiles(this);

		this.top.setTiles(t_left, this);
		this.right.setTiles(t_top, this);
		this.down.setTiles(t_right, this);
		this.left.setTiles(t_down, this);
	}
	rotateLeft()
	{
		const tilesRotated = [
			this.tiles[2],
			this.tiles[3],
			this.tiles[4],
			this.tiles[5],
			this.tiles[6],
			this.tiles[7],
			this.tiles[0],
			this.tiles[1],
		];
		this.tiles = tilesRotated;

		const t_top = this.top.getTiles(this);
		const t_right = this.right.getTiles(this);
		const t_down = this.down.getTiles(this);
		const t_left = this.left.getTiles(this);

		this.top.setTiles(t_right, this);
		this.right.setTiles(t_down, this);
		this.down.setTiles(t_left, this);
		this.left.setTiles(t_top, this);
	}


	private getTiles(side: Side)
	{
		if (side == this.top) return [this.tiles[0], this.tiles[1], this.tiles[2]];
		else if (side == this.right) return [this.tiles[2], this.tiles[3], this.tiles[4]];
		else if (side == this.down) return [this.tiles[4], this.tiles[5], this.tiles[6]];
		else if (side == this.left) return [this.tiles[6], this.tiles[7], this.tiles[0]];
		else throw new Error("switch default");
	}
	private setTiles(tiles: Tile[], side: Side)
	{
		if (side == this.top)  this.tiles[0] = tiles[0], this.tiles[1] = tiles[1], this.tiles[2] = tiles[2];
		else if (side == this.right) this.tiles[2] = tiles[0], this.tiles[3] = tiles[1], this.tiles[4] = tiles[2];
		else if (side == this.down) this.tiles[4] = tiles[0], this.tiles[5] = tiles[1], this.tiles[6] = tiles[2];
		else if (side == this.left) this.tiles[6] = tiles[0], this.tiles[7] = tiles[1], this.tiles[0] = tiles[2];
		else throw new Error("switch default");
	}
}


export class Tile
{
	public color: string;

	constructor(color: string)
	{
		this.color = color;
	}
}