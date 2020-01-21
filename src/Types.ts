import { Rect } from './utils/geom/Rect';

export interface ICellConfig {
  name: string;
  scale?: CellScale;
  align?: CellAlign;
  cells?: ICellConfig[];
  bounds: { x?: number; y?: number; width?: number; height?: number };
  padding?: number | { x?: number; y?: number; width: number; height: number };
}

export type IGridConfig = ICellConfig & {
  debug?: { color?: number };
  bounds: () => { x: number; y: number; width: number; height: number };
};

export interface IContent {
  child: any;
  config?: IContentConfig;
}

export interface IContentConfig {
  scale?: CellScale;
  align?: CellAlign;
  padding?: number | { x?: number; y?: number; width?: number; height?: number };
  offset?: { x?: number; y?: number };
  debug?: { color?: number };
}

export interface IMergedConfig {
  scale: CellScale;
  align: CellAlign;
  area: Rect;
  offset: { x: number; y: number };
}

export interface IDimension {
  width: number;
  height: number;
}

export enum CellScale {
  None = 1,
  Fit,
  Fill,
  ShowAll,
}

export enum CellAlign {
  None = 1,
  Center,
  CenterTop,
  CenterBottom,
  LeftCenter,
  LeftTop,
  LeftBottom,
  RightCenter,
  RightTop,
  RightBottom,
}
