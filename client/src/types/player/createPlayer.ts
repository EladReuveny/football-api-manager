import type { Position } from "./position";

export type CreatePlayer = {
  name: string;

  age: number;

  position: Position;

  rating: number;

  marketValue: number;

  imageUrl: string;

  clubId?: number;

  nationalityId: number;
};
