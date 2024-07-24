import { Socket } from "socket.io-client";
import { Piece } from "./data";
import { piecesToUci } from "./movePieceFunct";


const makePeonChange =({
  currentTurn,
  change,
  details,
  myPieces,
  setMyOwnPieces,
  enemyPieces,
  socket,
  messageGoal
}:
{
  currentTurn: 'white' | 'black'
  change: string
  details: string[]
  myPieces: Piece[]
  enemyPieces: Piece[]
  setMyOwnPieces: React.Dispatch<React.SetStateAction<Piece[]>>
  socket:  Socket<any, any>
  messageGoal: 'peonWhiteInGoal' | 'peonBlackInGoal'
})=>{

  const pieceToSchante = myPieces.find(
    (piece) => piece.idPiece === details[0]
  );
  const oldPiece = myPieces.filter(
    (piece) => piece.idPiece !== details[0]
  );
  if (pieceToSchante !== undefined) {
    setMyOwnPieces([
      ...oldPiece,
      { ...pieceToSchante, ficha: change, initialPlace: details[2] },
    ]);
    const findEnemy =   enemyPieces
    .find(
      (piece) => piece.initialPlace === details[2]
    );



    let isKill = ''
    const isPeonUCI  = pieceToSchante?.ficha === "peon"
    if (findEnemy) {
      isKill = isPeonUCI ? `${pieceToSchante?.initialPlace[0]}x` : 'x'
    }
    const transFormToUCI = `${ isPeonUCI ?'' : `${piecesToUci[pieceToSchante!.ficha] &&  piecesToUci[pieceToSchante!.ficha].toUpperCase()}`}  ${isKill}${ details[2]}=${piecesToUci[change].toUpperCase()}`
    const uciMove = transFormToUCI.replace(/ /g, "")








    socket.emit(messageGoal, {
      [currentTurn === "white" ? "piecesWhite" : "piecesBlack"]: [
        ...oldPiece,
        { ...pieceToSchante, ficha: change, initialPlace: details[2] },
      ],
      [currentTurn === "white" ? "piecesBlack" : "piecesWhite"]: findEnemy
        ? enemyPieces.filter((piece) => piece.idPiece !== findEnemy.idPiece)
        : enemyPieces,
        uciMove
    });
  }
};

export default makePeonChange; 