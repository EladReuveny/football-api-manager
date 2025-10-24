import { Link } from "react-router-dom";
import type { Club } from "../types/club/club";

type ClubCardProps = {
  club: Club;
  index: number;
};

const ClubCard = ({ club, index }: ClubCardProps) => {
  return (
    <Link
      to={`/clubs/${club.id}`}
      title={club.name}
      className="relative rounded-lg overflow-hidden py-3 px-2 border border-gray-600 hover:backdrop-brightness-300 hover:shadow-[0_0_4px_var(--color-text)]"
    >
      <img
        src={club.country.flagUrl}
        alt={club.country.name}
        title={club.country.name}
        className="h-7 w-7 object-contain absolute top-1 left-2"
      />
      <span
        title={`#${index + 1}`}
        className="absolute top-2 right-2 text-xs text-gray-400 font-semibold"
      >
        #{index + 1}
      </span>
      <img
        src={club.logoUrl}
        alt={club.name}
        title={club.name}
        className="object-contain w-full h-20"
      />

      <div className="flex flex-col space-y-1 mt-1 font-bold text-center">
        <p className="text-lg truncate">{club.name}</p>
        <p
          className="text-gray-300 text-sm"
          title={`Founded: ${club.establishedAt.toString()}`}
        >
          Founded {new Date(club.establishedAt).getFullYear()}
        </p>

        {club?.competitions?.length ? (
          <div className="flex flex-wrap justify-center items-center gap-1 mt-2">
            {club.competitions.slice(0, 3).map((competition) => (
              <img
                key={competition.id}
                src={competition.logoUrl}
                alt={competition.name}
                title={competition.name}
                className="object-contain w-7 h-7"
              />
            ))}
            {club.competitions.length > 3 && (
              <span
                className="text-gray-400 text-sm"
                title={club.competitions
                  .slice(3)
                  .map((c) => c.name)
                  .join(", ")}
              >
                +{club.competitions.length - 3}
              </span>
            )}
          </div>
        ) : (
          <span title="Not Available" className="text-gray-400 italic text-sm">
            N/A
          </span>
        )}
      </div>
    </Link>
  );
};

export default ClubCard;
