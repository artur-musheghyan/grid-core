import { CellAlign, CellScale, ICellConfig, IContent, IContentConfig, IGridConfig, IMergedConfig } from './Types';
import { Point } from './utils/geom/Point';
import { Rect } from './utils/geom/Rect';
import { convertToRect, fillRect } from './utils/Utils';

export class Cell<T extends ICellConfig | IGridConfig> {
  private _config: T;
  private readonly _name: string;
  private readonly _cells: Cell<ICellConfig>[];
  private readonly _bounds: Rect;
  private readonly _scale: CellScale;
  private readonly _align: CellAlign;
  private readonly _padding: Rect;
  private readonly _offset: Point;
  private readonly _contents: IContent[];

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
    this._cells = this._buildCells(cells || []);
    this._contents = [];
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
  get cells(): Cell<ICellConfig>[] {
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
   * @description Scale type, used to scale contents in this cell
   * @returns {CellScale} scale type
   */
  get scale(): CellScale {
    return this._scale;
  }

  /**
   * @description Align type, used to align contents in this cell
   * @returns {CellAlign} align type
   */
  get align(): CellAlign {
    return this._align;
  }

  /**
   * @description Contents added in this cell
   * @returns {IContent[]} cell contents
   */
  get contents(): IContent[] {
    return this._contents;
  }

  /**
   * @description Cell bounds considered paddings
   * @returns {Rect} cell bounds considered paddings
   */
  get contentArea(): Rect {
    return this._padding;
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
  public getCells(): Cell<ICellConfig>[] {
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
  public getCellByName(name: string): Cell<ICellConfig> | undefined {
    return this.getCells().find(cell => cell._name === name);
  }

  /**
   * @description Merges content config into cell config. Content config has higher priority.
   * @param config Content config
   * @returns {IMergedConfig}
   */
  public mergeContentConfig(config: IContentConfig | undefined): IMergedConfig {
    const { align, contentArea, scale, bounds, offset } = this;

    if (config === undefined) {
      return { align, area: contentArea, scale, offset };
    }

    return {
      align: config.align ? config.align : align,
      area: config.padding ? convertToRect(config.padding, contentArea) : contentArea,
      offset: config.offset ? new Point(config.offset.x || offset.x, config.offset.y || offset.y) : offset,
      scale: config.scale ? config.scale : scale,
    };
  }

  private _getOffset(rawOffset?: { x?: number; y?: number }): Point {
    return rawOffset ? new Point(rawOffset.x || 0, rawOffset.y || 0) : new Point(0, 0);
  }

  private _buildCells(rawCells: ICellConfig[]): Cell<ICellConfig>[] {
    const cells = [];

    const { width: bw, height: bh, left: bl, right: br, top: bt, bottom: bb } = this.contentArea;
    for (const rawCell of rawCells) {
      const { bounds: rb } = rawCell;
      const rawBounds = Object.assign({}, rb);

      rb.x = rb.x !== undefined ? bl + rb.x * bw : Math.max(bl, ...cells.map(({ _bounds: b }) => b.right));
      rb.y = rb.y !== undefined ? bt + rb.y * bh : Math.max(bt, ...cells.map(({ _bounds: b }) => b.bottom));

      rb.width = rb.width !== undefined ? rb.width * bw : br - rb.x;
      rb.height = rb.height !== undefined ? rb.height * bh : bb - rb.y;

      const cell = new Cell(rawCell);
      cell.config.bounds = rawBounds;
      cells.push(cell);
    }

    return cells;
  }
}
