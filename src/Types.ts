export type IRawOffset = { x?: number; y?: number };

export type IRawRect = { x?: number; y?: number; width?: number; height?: number };

export type IRawPadding = number | IRawRect;

export type IRawBounds = IRawRect;

export type IDebug = { color?: number; fill?: boolean };

export type ICellConfig = {
  name: string;
  debug?: IDebug;
  scale?: CellScale;
  align?: CellAlign;
  cells?: ICellConfig[];
  bounds?: IRawBounds;
  padding?: IRawPadding;
  offset?: IRawOffset;
};

export type IDimension = {
  width: number;
  height: number;
};

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
