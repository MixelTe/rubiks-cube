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
}

export class Tile
{
	public color: string;

	constructor(color: string)
	{
		this.color = color;
	}
}