import { Link } from "react-router-dom";
import type { Player } from "../types/player/player";
import { mapPositionToLabel, positionColors } from "../types/player/position";

type PlayerCardProps = {
  player: Player;
  index: number;
  onRemoveFromClub?: (
    e: React.MouseEvent<HTMLButtonElement>,
    player: Player
  ) => void;
};

const PlayerCard = ({ player, index, onRemoveFromClub }: PlayerCardProps) => {
  return (
    <Link
      to={`/players/${player.id}`}
      title={player.name}
      className="relative bg-(--color-text)/10 rounded-lg overflow-hidden hover:backdrop-brightness-150 hover:shadow-[0_0_4px_var(--color-text)]"
    >
      <div className="flex flex-col absolute top-1 left-2 font-extrabold">
        <p title={player.rating.toString()}>{player.rating}</p>
        <p
          title={mapPositionToLabel[player.position]}
          className={positionColors[player.position].join(" ")}
        >
          {player.position}
        </p>
        <img
          src={player.nationality.flagUrl}
          alt={player.nationality.name}
          title={player.nationality.name}
          className="h-6 w-6 object-contain"
        />
        {player.club && (
          <img
            src={player.club.logoUrl}
            alt={player.club.name}
            title={player.club.name}
            className="h-6 w-6 object-contain"
          />
        )}
      </div>

      <div className="absolute flex flex-col top-1 right-1 font-semibold">
        <span title={`#${index + 1}`} className="text-xs text-gray-400">
          #{index + 1}
        </span>
        {onRemoveFromClub && (
          <button
            onClick={(e) => onRemoveFromClub(e, player)}
            className="text-sm hover:brightness-85"
            title="Remove Player From Club"
          >
            <i className="fas fa-user-slash"></i>
          </button>
        )}
      </div>

      <img
        src={player.imageUrl}
        alt={player.name}
        title={player.name}
        className="object-fill w-full h-40"
      />

      <div className="p-2 space-y-1">
        <h3 className="text-xl text-center font-bold text-(--color-primary) truncate">
          {player.name.indexOf(" ") === -1
            ? player.name
            : `${player.name.charAt(0)}. ${player.name.substring(
                player.name.indexOf(" ")
              )}`}
        </h3>
        <p className="text-gray-300 text-sm">
          Market Value{" "}
          <span className="font-bold text-(--color-text)">
            ${player.marketValue}M
          </span>
        </p>
        <p className="text-gray-300 text-sm">
          Age{" "}
          <span className="font-bold text-(--color-text)">{player.age}</span>
        </p>
      </div>
    </Link>
  );
};

export default PlayerCard;
