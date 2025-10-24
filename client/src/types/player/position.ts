export type Position =
  | "GK"
  | "LB"
  | "CB"
  | "RB"
  | "LWB"
  | "RWB"
  | "CDM"
  | "CM"
  | "LM"
  | "RM"
  | "CAM"
  | "RW"
  | "LW"
  | "ST"
  | "CF";

export const positions: {
  value: Position;
  label: string;
}[] = [
  { value: "GK", label: "Goalkeeper" },
  { value: "LB", label: "Left Back" },
  { value: "CB", label: "Center Back" },
  { value: "RB", label: "Right Back" },
  { value: "LWB", label: "Left Wing Back" },
  { value: "RWB", label: "Right Wing Back" },
  { value: "CDM", label: "Central Defensive Midfielder" },
  { value: "CM", label: "Central Midfielder" },
  { value: "LM", label: "Left Midfielder" },
  { value: "RM", label: "Right Midfielder" },
  { value: "CAM", label: "Central Attacking Midfielder" },
  { value: "RW", label: "Right Winger" },
  { value: "LW", label: "Left Winger" },
  { value: "ST", label: "Striker" },
  { value: "CF", label: "Center Forward" },
];

export const mapPositionToLabel: Record<Position, string> = {
  GK: "Goalkeeper",
  LB: "Left Back",
  CB: "Center Back",
  RB: "Right Back",
  LWB: "Left Wing Back",
  RWB: "Right Wing Back",
  CDM: "Central Defensive Midfielder",
  CM: "Central Midfielder",
  LM: "Left Midfielder",
  RM: "Right Midfielder",
  CAM: "Central Attacking Midfielder",
  RW: "Right Winger",
  LW: "Left Winger",
  ST: "Striker",
  CF: "Center Forward",
};

export const positionColors: Record<
  Position,
  [textBaseColor: string, bgBaseColorLighter: string, borderBaseColor: string]
> = {
  // Goalkeepers
  GK: ["text-purple-500", "bg-purple-500/15", "border-purple-500"],

  // Defenders
  LB: ["text-emerald-500", "bg-emerald-500/15", "border-emerald-500"],
  CB: ["text-emerald-500", "bg-emerald-500/15", "border-emerald-500"],
  RB: ["text-emerald-500", "bg-emerald-500/15", "border-emerald-500"],
  LWB: ["text-emerald-500", "bg-emerald-500/15", "border-emerald-500"],
  RWB: ["text-emerald-500", "bg-emerald-500/15", "border-emerald-500"],

  // Midfielders
  CDM: ["text-yellow-300", "bg-yellow-300/15", "border-yellow-500"],
  CM: ["text-yellow-300", "bg-yellow-300/15", "border-yellow-500"],
  LM: ["text-yellow-300", "bg-yellow-300/15", "border-yellow-500"],
  RM: ["text-yellow-300", "bg-yellow-300/15", "border-yellow-500"],
  CAM: ["text-yellow-300", "bg-yellow-300/15", "border-yellow-500"],

  // Wingers (Attackers)
  RW: ["text-blue-500", "bg-blue-500/15", "border-blue-500"],
  LW: ["text-blue-500", "bg-blue-500/15", "border-blue-500"],

  // Strikers (Attackers)
  ST: ["text-red-500", "bg-red-500/15", "border-red-500"],
  CF: ["text-red-500", "bg-red-500/15", "border-red-500"],
};
