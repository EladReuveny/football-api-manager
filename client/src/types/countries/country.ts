import type { Club } from "../club/club";
import type { Competition } from "../competition/competition";
import type { Player } from "../player/player";

export type Country = {
  id: number;
  name: string;
  isoCode: string;
  flagUrl: string;
  players: Player[];
  clubs: Club[];
  competitions: Competition[];
};
