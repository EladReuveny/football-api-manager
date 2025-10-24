export type CompetitionType =
  | "LEAGUE"
  | "CUP"
  | "SUPER_CUP"
  | "INTERNATIONAL"
  | "FRIENDLY";

export const competitionTypes: { value: CompetitionType; label: string }[] = [
  { value: "LEAGUE", label: "League" },
  { value: "CUP", label: "Cup" },
  { value: "SUPER_CUP", label: "Super Cup" },
  { value: "INTERNATIONAL", label: "International" },
  { value: "FRIENDLY", label: "Friendly" },
];

export const mapCompetitionTypeToLabel: Record<CompetitionType, string> = {
  LEAGUE: "League",
  CUP: "Cup",
  SUPER_CUP: "Super Cup",
  INTERNATIONAL: "International",
  FRIENDLY: "Friendly",
};

export const competitionTypeColors: Record<
  CompetitionType,
  [textBaseColor: string, bgBaseColorLighter: string]
> = {
  LEAGUE: ["text-yellow-300", "bg-yellow-300/40"],
  CUP: ["text-red-500", "bg-red-500/40"],
  SUPER_CUP: ["text-blue-500", "bg-blue-500/40"],
  INTERNATIONAL: ["text-green-500", "bg-green-500/40"],
  FRIENDLY: ["text-gray-400", "bg-gray-500/40"],
};
