import { Link } from "react-router-dom";
import type { Competition } from "../types/competition/competition";
import {
  competitionTypeColors,
  mapCompetitionTypeToLabel,
} from "../types/competition/competitionType";

type CompetitionCardProps = {
  competition: Competition;
  index: number;
};

const CompetitionCard = ({ competition, index }: CompetitionCardProps) => {
  return (
    <Link
      to={`/competitions/${competition.id}`}
      title={competition.name}
      className="relative rounded-lg overflow-hidden py-3 px-2 border border-gray-600 hover:backdrop-brightness-300 hover:shadow-[0_0_4px_var(--color-text)]"
    >
      {competition.country && (
        <img
          src={competition.country?.flagUrl}
          alt={competition.country?.name}
          title={competition?.country?.name}
          className="h-7 w-7 object-contain absolute top-1 left-2"
        />
      )}
      <span
        title={`#${index + 1}`}
        className="absolute top-2 right-2 text-xs text-gray-400 font-semibold"
      >
        #{index + 1}
      </span>
      <img
        src={competition.logoUrl}
        alt={competition.name}
        title={competition.name}
        className="object-contain w-full h-20"
      />

      <div className="flex flex-col space-y-1 mt-1 font-bold text-center">
        <p className="text-lg truncate">{competition.name}</p>
        <p
          title={`Founded: ${competition.establishedAt.toString()}`}
          className="text-gray-300 text-sm"
        >
          Founded {new Date(competition.establishedAt).getFullYear()}
        </p>
        <p
          title={`Competition Type: ${
            mapCompetitionTypeToLabel[competition.competitionType]
          }`}
          className={`py-1 px-5 rounded-sm ${competitionTypeColors[
            competition.competitionType
          ].join(" ")}`}
        >
          {mapCompetitionTypeToLabel[competition.competitionType]}
        </p>
        <p title={competition.clubs?.map((c) => c.name).join(", ")}>
          {competition.clubs?.length}
          {competition.clubs?.length === 1 ? " Club" : " Clubs"}
        </p>
      </div>
    </Link>
  );
};

export default CompetitionCard;
