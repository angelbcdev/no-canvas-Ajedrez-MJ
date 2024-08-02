import { generateRandomString } from "../porvider/const";
import useGameContext from "../porvider/context";
import { movePieceAlfil, movePieceCaballo, movePieceKing, movePiecePeon, movePieceReina, movePieceTorre } from "../porvider/movePieces";
import SearchPiece from "./SearchPiece";

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
    needMoveKing, 
    isMultiJugador
    
  } = useGameContext();

  const piecesAlyWhite = piecesWhite.map((piece) => piece.initialPlace);
  const piecesAlyBlack = piecesBlack.map((piece) => piece.initialPlace);
  const allPiecesToogether = [...piecesAlyWhite, ...piecesAlyBlack];

  return (
    <section className=" border-[8px] border-black shadow-2xl rounded-lg">
      {cols.map((_, rowIndex) => (
        <div key={generateRandomString(3)} className="flex">
          {cols.map((col, squareIndex) => {
            const direction = isMultiJugador ?
              userTurn === "black" ? rowIndex + 1 : 8  - rowIndex : 8 - rowIndex

            const location = `${col}${direction}`;
            const piece = [...piecesWhite, ...piecesBlack].find(
              (piece) => piece.initialPlace === location
            );

            const isBlack =  isMultiJugador ?
              rowIndex % 2 === 0
                ? userTurn==="white" ? squareIndex % 2 === 0 :squareIndex % 2 !== 0
                : userTurn==="white" ? squareIndex % 2 !== 0 :squareIndex % 2 === 0
                : rowIndex % 2 !== 0  ? squareIndex % 2 === 0 :squareIndex % 2 !== 0

            const squareToMove = squaresSelected.find(
              (square) => square === location
            );

            return (
              <div
                onClick={() => {
                  if (userTurn == turn) {

                  
                     if(needMoveKing && piece?.ficha !== "rey"){ 
                      return
                    }

                    

                    if (piece !== undefined ) setPiecetomove(piece?.idPiece);
                      
                    
                      

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
                          ocupedSpot: allPiecesToogether,
                        });
                      } else if (piece?.ficha === "alfil") {
                        movePieceAlfil({
                          piece,
                          currentLocation,
                          currentRowIndex,
                          youCanMove: setSquaresSelected,
                          ocupedSpot: allPiecesToogether,
                        });
                      } else if (piece?.ficha === "reina") {
                        movePieceReina({
                          piece,
                          currentLocation,
                          currentRowIndex,
                          youCanMove: setSquaresSelected,
                          ocupedSpot: allPiecesToogether,
                        });
                      }
                    

                    }

                    
                  }
                }}
                key={generateRandomString(5)}
                className={` ${
                  isBlack ? "bg-white text-black/50" : "bg-black text-white/50"
                } relative z-0  w-[54px] h-[54px] sm:w-16 sm:h-16  flex justify-center items-center`}
              >
                {!allPiecesToogether.includes(location) && <p className="absolute z-0">{location}</p>}
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

export default Board;