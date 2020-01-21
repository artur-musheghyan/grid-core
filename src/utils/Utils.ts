import { CellAlign, CellScale, IDimension } from '../Types';
import { Point } from './geom/Point';
import { Rect } from './geom/Rect';

export function convertToRect(
  value: number | { x?: number; y?: number; width?: number; height?: number },
  bounds: Rect,
): Rect {
  const valueAsRect = typeof value === 'number' ? numberToRect(value) : fillRect(value);
  const { x: rx, y: ry, width: rw, height: rh } = valueAsRect;
  const { x: bx, y: by, width: bw, height: bh } = bounds;

  return new Rect(bx + rx * bw, by + ry * bh, bw * rw, bh * rh);
}

export function numberToRect(value: number): Rect {
  return new Rect(value, value, 1 - 2 * value, 1 - 2 * value);
}

export function fillRect({ x, y, width, height }: { x?: number; y?: number; width?: number; height?: number }): Rect {
  return new Rect(x || 0, y || 0, width || 1 - (x ? x : 0), height || 1 - (y ? y : 0));
}

/**
 * @description Represents scale difference needed to scale first dimension compared with second based on scale type
 * @param d1 Dimension to scale
 * @param d2 Dimension to compare with
 * @param scaleType Scale type
 * @returns {Point}
 */
export function fit(d1: IDimension, d2: IDimension, scaleType: CellScale): Point {
  switch (scaleType) {
    case CellScale.Fit:
      return _fit(d1, d2);
    case CellScale.Fill:
      return _fill(d1, d2);
    case CellScale.ShowAll:
      return _showAll(d1, d2);
    case CellScale.None:
      return new Point(1, 1);
    default:
      throw new Error(`Unknown scale type: ${scaleType}`);
  }
}

/**
 * @description Represents position difference needed to align dimension in rect based on align type
 * @param dimension Dimension to align
 * @param rect Rect to align to
 * @param alignType Align type
 * @returns {Point}
 */
export function align(dimension: IDimension, rect: Rect, alignType: CellAlign): Point {
  const { width: w1, height: h1 } = dimension;
  const { x: x2, y: y2, width: w2, height: h2 } = rect;
  const pos = new Point(x2, y2);

  switch (alignType) {
    case CellAlign.Center:
      return pos.set(x2 + (w2 - w1) / 2, y2 + (h2 - h1) / 2);
    case CellAlign.CenterTop:
      return pos.set(x2 + (w2 - w1) / 2, y2);
    case CellAlign.CenterBottom:
      return pos.set(x2 + (w2 - w1) / 2, y2 + (h2 - h1));
    case CellAlign.LeftCenter:
      return pos.set(x2, y2 + (h2 - h1) / 2);
    case CellAlign.LeftTop:
      return pos;
    case CellAlign.LeftBottom:
      return pos.set(x2, y2 + (h2 - h1));
    case CellAlign.RightCenter:
      return pos.set(x2 + (w2 - w1), y2 + (h2 - h1) / 2);
    case CellAlign.RightTop:
      return pos.set(x2 + (w2 - w1), y2);
    case CellAlign.RightBottom:
      return pos.set(x2 + (w2 - w1), y2 + (h2 - h1));
    case CellAlign.None:
      return pos;
    default:
      throw new Error(`Unknown align: ${align}`);
  }
}

function _fit(d1: IDimension, d2: IDimension): Point {
  const { width: w1, height: h1 } = d1;
  const { width: w2, height: h2 } = d2;
  const s = Math.min(w2 / w1, h2 / h1);

  return s < 1 ? new Point(s, s) : new Point(1, 1);
}

function _showAll(d1: IDimension, d2: IDimension): Point {
  const { width: w1, height: h1 } = d1;
  const { width: w2, height: h2 } = d2;
  const s = Math.min(w2 / w1, h2 / h1);

  return new Point(s, s);
}

function _fill(d1: IDimension, d2: IDimension): Point {
  const { width: w1, height: h1 } = d1;
  const { width: w2, height: h2 } = d2;

  return new Point(w2 / w1, h2 / h1);
}
