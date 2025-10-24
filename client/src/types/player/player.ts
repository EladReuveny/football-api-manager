import type { Club } from "../club/club";
import type { Country } from "../countries/country";
import type { Position } from "./position";

export type Player = {
  id: number;

  name: string;

  age: number;

  position: Position;

  rating: number;

  marketValue: number;

  imageUrl: string;

  club?: Club;

  nationality: Country;
};
