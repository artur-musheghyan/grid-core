export interface ICellConfig {
  name: string;
  debug?: { color?: number; fill?: boolean };
  scale?: CellScale;
  align?: CellAlign;
  cells?: ICellConfig[];
  bounds: { x?: number; y?: number; width?: number; height?: number };
  padding?: number | { x?: number; y?: number; width: number; height: number };
  offset?: { x?: number; y?: number };
}

export type IGridConfig = ICellConfig & {
  bounds?: () => { x: number; y: number; width: number; height: number };
};

export interface IDimension {
  width: number;
  height: number;
}

export enum CellScale {
  None = 1,
  Fit,
  Fill,
  ShowAll,
  Envelop,
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
