// clearimport { useState } from 'react'
import { useEffect } from "react";
import useGameContext from "./porvider/context";
import { generateRandomString } from "./porvider/const";
import { Piece } from "./porvider/data";
import {
  movePieceAlfil,
  movePieceCaballo,
  movePieceKing,
  movePiecePeon,
  movePieceReina,
  movePieceTorre,
} from "./porvider/movePieces";
import CoverBoard from "./UI/CoverBoard";

function App() {
  return (
    <main className="w-screen h-screen bg-gray-600 flex flex-col justify-center items-center">
      <CoverBoard />
      <UIMultiJugador>
        <Board />
      </UIMultiJugador>
    </main>
  );
}

export default App;

const UIMultiJugador = ({ children }: { children: React.ReactNode }) => {
  const { userTurn, userId, turn } = useGameContext();
  return (
    <div>
      <p className="text-2xl text-center mb-6">
        {" "}
        Turno de las {turn == "white" ? " blancas" : "negras"}
      </p>
      <div>{children}</div>
      <p>{userId ? userId.id : "Cargando..."}</p>
      <div className="text-2xl text-center mt-4">
        <p>{userTurn == "white" ? "Piezas blancas" : "Piezas negras"}</p>
        <span className="h-3">
          {userTurn == turn ? "Tu turno" : "Turno del oponente"}
        </span>
      </div>
    </div>
  );
};

const Board = () => {
  const cols = ["a", "b", "c", "d", "e", "f", "g", "h"];

  const {
    moverToSquare,
    setPiecetomove,
    squaresSelected,
    turn,
    setSquaresSelected,
    piecesBlack,
    piecesWhite,
    userTurn,
  } = useGameContext();

  const piecesAlyWhite = piecesWhite.map((piece) => piece.initialPlace);
  const piecesAlyBlack = piecesBlack.map((piece) => piece.initialPlace);

  return (
    <section className=" border-[8px] border-black shadow-2xl rounded-lg">
      {cols.map((_, rowIndex) => (
        <div key={generateRandomString(3)} className="flex">
          {cols.map((col, squareIndex) => {
            const direction =
              userTurn === "white" ? 8 - rowIndex : rowIndex + 1;

            const location = `${col}${direction}`;
            const piece = [...piecesWhite, ...piecesBlack].find(
              (piece) => piece.initialPlace === location
            );

            const isBlack =
              rowIndex % 2 === 0
                ? squareIndex % 2 === 0
                : squareIndex % 2 !== 0;

            const squareToMove = squaresSelected.find(
              (square) => square === location
            );

            return (
              <div
                onClick={() => {
                  if (userTurn == turn) {
                    setPiecetomove(piece?.idPiece);
                    moverToSquare({ newLocation: location });
                    const currentLocation = {
                      row: piece?.initialPlace[0] as string,
                      col: Number(piece?.initialPlace[1]),
                    };
                    const currentRowIndex = cols.indexOf(currentLocation.row);

                    if (piece?.color === turn) {
                      
                      if (piece?.ficha === "peon") {
                        movePiecePeon({
                          piece,
                          currentLocation,
                          youCanMove: setSquaresSelected,
                          enemyPieces:
                            piece.color === "black" ? piecesWhite : piecesBlack,
                          currentRowIndex,
                        });
                      } else if (piece?.ficha === "caballo") {
                        movePieceCaballo({
                          currentLocation,
                          currentRowIndex,
                          youCanMove: setSquaresSelected,
                          piece,
                        });
                      } else if (piece?.ficha === "rey") {
                        movePieceKing({
                          currentLocation,
                          currentRowIndex,
                          youCanMove: setSquaresSelected,
                          piece,
                        });
                      } else if (piece?.ficha === "torre") {
                        movePieceTorre({
                          currentLocation,
                          currentRowIndex,
                          youCanMove: setSquaresSelected,
                          ocupedSpot: [
                            ...piecesWhite.map((piece) => piece.initialPlace),
                            ...piecesBlack.map((piece) => piece.initialPlace),
                          ],
                        });
                      } else if (piece?.ficha === "alfil") {
                        console.log("piece?.ficha", piece?.ficha);

                        movePieceAlfil({
                          piece,
                          currentLocation,
                          currentRowIndex,
                          youCanMove: setSquaresSelected,
                          ocupedSpot: [
                            ...piecesWhite.map((piece) => piece.initialPlace),
                            ...piecesBlack.map((piece) => piece.initialPlace),
                          ],
                        });
                      } else if (piece?.ficha === "reina") {
                        movePieceReina({
                          piece,
                          currentLocation,
                          currentRowIndex,
                          youCanMove: setSquaresSelected,
                          ocupedSpot: [
                            ...piecesWhite.map((piece) => piece.initialPlace),
                            ...piecesBlack.map((piece) => piece.initialPlace),
                          ],
                        });
                      }


                    }
                  }
                }}
                key={generateRandomString(3)}
                className={` ${
                  isBlack ? "bg-white text-black" : "bg-black text-white"
                } relative z-0  w-[54px] h-[54px] sm:w-16 sm:h-16  border border-black flex justify-center items-center`}
              >
                <p className="absolute z-0">{location}</p>
                <div
                  className={`w-full h-full relative z-10  ${
                    squareToMove === location
                      ? turn === "white"
                        ? piecesAlyWhite.includes(location)
                          ? ""
                          : "bg-yellow-500/50"
                        : piecesAlyBlack.includes(location)
                        ? ""
                        : "bg-yellow-500/50"
                      : ""
                  }`}
                >
                  {" "}
                </div>
                <SearchPiece
                  pieces={piecesWhite}
                  color="white"
                  location={location}
                />
                <SearchPiece
                  pieces={piecesBlack}
                  color="black"
                  location={location}
                />
              </div>
            );
          })}
        </div>
      ))}
    </section>
  );
};



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

      className={` z-50 w-[54px] h-[54px] sm:w-16 sm:h-16 absolute border-2
    ${imEnemy && turn !== piece.color ? "bg-red-500" : ""}
    ${
      userTurn == color
        ? isYourTurn
          ? "border-yellow-500"
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
