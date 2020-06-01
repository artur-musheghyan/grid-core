import { CellAlign, CellScale, ICellConfig, IGridConfig } from './Types';
import { Point } from './utils/geom/Point';
import { Rect } from './utils/geom/Rect';
import { convertToRect, fillRect } from './utils/Utils';

export class Cell<T extends ICellConfig | IGridConfig, K> {
  private _config: T;
  private readonly _name: string;
  private readonly _cells: Cell<T, K>[];
  private readonly _bounds: Rect;
  private readonly _scale: CellScale;
  private readonly _align: CellAlign;
  private readonly _padding: Rect;
  private readonly _offset: Point;
  private readonly _contents: K[];

  /**
   * @param config Input configuration object.
   */
  constructor(config: T) {
    const { name, bounds, cells, scale, align, padding, offset } = config;

    this._config = config;
    this._name = name;
    this._scale = scale || CellScale.Fit;
    this._align = align || CellAlign.Center;
    this._bounds = fillRect(bounds ? (typeof bounds === 'function' ? bounds() : bounds) : {});
    this._padding = convertToRect(padding || 0, this._bounds);
    this._offset = this._getOffset(offset);
    this._cells = this._buildCells(cells || new Array(0));
    this._contents = new Array(0);
  }

  /**
   * @description Configuration object reference passed in constructor
   * @returns {T} configuration object
   */
  get config(): T {
    return this._config;
  }

  set config(value: T) {
    this._config = value;
  }

  /**
   * @description Cell name defined in configuration object
   * @returns {string} cell name
   */
  get name(): string {
    return this._name;
  }

  /**
   * @description Array of child cells
   * @returns {Cell[]} child cells
   */
  get cells(): Cell<T, K>[] {
    return this._cells;
  }

  /**
   * @description Bounds area in pixels
   * @returns {Rect} bounds area
   */
  get bounds(): Rect {
    return this._bounds;
  }

  /**
   * @description Padding area in pixels
   * @returns {Rect} padding area
   */
  get padding(): Rect {
    return this._padding;
  }

  /**
   * @description Scale type, used to scale contents
   * @returns {CellScale} scale type
   */
  get scale(): CellScale {
    return this._scale;
  }

  /**
   * @description Align type, used to align contents
   * @returns {CellAlign} align type
   */
  get align(): CellAlign {
    return this._align;
  }

  /**
   * @description Contents
   * @returns {K[]} cell contents
   */
  get contents(): K[] {
    return this._contents;
  }

  /**
   * @description Cell bounds considered paddings and offsets
   * @returns {Rect} Rectangle considered paddings and offsets
   */
  get area(): Rect {
    const { padding: p, offset: o } = this;

    return new Rect(p.x + o.x, p.y + o.y, p.width, p.height);
  }

  /**
   * @description Cell offset
   * @returns {Point} cell offset
   */
  get offset(): Point {
    return this._offset;
  }

  /**
   * @description Returns cells way down of the tree, recursively
   * @returns {Cell[]} Array of cells
   */
  public getCells(): Cell<T, K>[] {
    const cells = [];
    cells.push(this);
    this._cells.forEach(cell => cells.push(...cell.getCells()));

    return cells;
  }

  /**
   * @description Returns cell based on given name
   * @param name The name of the cell
   * @returns {Cell | undefined}
   */
  public getCellByName(name: string): Cell<T, K> | undefined {
    return this.getCells().find(cell => cell._name === name);
  }

  private _getOffset(rawOffset?: { x?: number; y?: number }): Point {
    return rawOffset ? new Point(rawOffset.x || 0, rawOffset.y || 0) : new Point(0, 0);
  }

  private _buildCells(rawCells: T[]): Cell<T, K>[] {
    const cells = [];

    const { width: bw, height: bh, left: bl, right: br, top: bt, bottom: bb } = this.area;
    for (const rawCell of rawCells) {
      const { bounds: rb } = rawCell;
      const rawBounds = Object.assign({}, rb);

      rb.x = rb.x !== undefined ? bl + rb.x * bw : Math.max(bl, ...cells.map(({ _bounds: b }) => b.right));
      rb.y = rb.y !== undefined ? bt + rb.y * bh : Math.max(bt, ...cells.map(({ _bounds: b }) => b.bottom));

      rb.width = rb.width !== undefined ? rb.width * bw : br - rb.x;
      rb.height = rb.height !== undefined ? rb.height * bh : bb - rb.y;

      const cell = new Cell<T, K>(rawCell);
      cell.config.bounds = rawBounds;
      cells.push(cell);
    }

    return cells;
  }
}
