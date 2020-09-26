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
		this.tiles.push(new Tile("yellow"));
		this.tiles.push(new Tile("gold"));
		this.tiles.push(new Tile("orange"));
		this.tiles.push(new Tile("red"));
		this.tiles.push(new Tile("lightgreen"));
		this.tiles.push(new Tile("lime"));
		this.tiles.push(new Tile("green"));
		this.tiles.push(new Tile("darkgreen"));
		// for (let i = 0; i < 8; i++)
		// {
		// 	this.tiles.push(new Tile(color));
		// }
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