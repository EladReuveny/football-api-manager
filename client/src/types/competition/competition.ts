import type { Club } from "../club/club";
import type { Country } from "../countries/country";
import type { CompetitionType } from "./competitionType";

export type Competition = {
  id: number;

  name: string;

  logoUrl: string;

  establishedAt: Date;

  competitionType: CompetitionType;

  country?: Country;

  clubs?: Club[];
};
