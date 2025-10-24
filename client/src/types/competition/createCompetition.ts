import type { CompetitionType } from "./competitionType";

export type CreateCompetition = {
  name: string;

  logoUrl: string;

  establishedAt?: Date;

  competitionType: CompetitionType;

  countryId?: number;

  clubsIds?: number[];
};
