import type { Competition } from "../competition/competition";
import type { Country } from "../countries/country";
import type { Player } from "../player/player";

export type Club = {
  id: number;

  name: string;

  logoUrl: string;

  country: Country;

  establishedAt: Date;

  players?: Player[];

  competitions?: Competition[];
};
