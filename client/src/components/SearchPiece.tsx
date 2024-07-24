import useGameContext from "../porvider/context";
import { Piece } from "../porvider/data";

const SearchPiece = ({
  pieces,
  location,
  color,
}: {
  pieces: Piece[];
  location: string;
  color: "white" | "black";
}) => {
  const { turn, piecetomove, userTurn, squaresSelected } = useGameContext();
  const piece = pieces.find((piece) => piece.initialPlace === location);

  const isYourTurn = turn === color;
  const isThisPieceSelected = piecetomove === piece?.idPiece;

  const imEnemy = squaresSelected?.includes(location);

  if (piece === undefined) {
    return null;
  }

  return (
    <div
      // onClick={() => (isYourTurn && piecetomove == '') && }

      className={` z-50 w-[54px] h-[54px] sm:w-16 sm:h-16 absolute 
    ${imEnemy && turn !== piece.color ? "bg-red-500" : ""}
    ${
      userTurn == color
        ? isYourTurn
          ? "border-yellow-500 border-[3px]"
          : ""
        : "border-blue-500"
    }
    ${isThisPieceSelected && isYourTurn ? "bg-yellow-500" : ""}
    `}
    >
      <img
        className={`w-full h-full  ${
          piece?.color === "black" ? "invert" : ""
        }  `}
        src={`/${piece.ficha}-removebg-preview.png`}
        alt=""
      />
    </div>
  );
};

export default SearchPiece;