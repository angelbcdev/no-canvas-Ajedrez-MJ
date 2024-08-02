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
  messageGoal,
  isMultiJugador,
  setOwnerPieces,
  setEnemyPieces,
  nextTurn,
  setUserTurn,
  setIsPeonInGoal,
  setShowAlert,
}:
{
  currentTurn: 'white' | 'black'
  nextTurn: 'white' | 'black'
  change: string
  details: string[]
  myPieces: Piece[]
  enemyPieces: Piece[]
  setMyOwnPieces: React.Dispatch<React.SetStateAction<Piece[]>>
  socket:  Socket<any, any>
  messageGoal: 'peonWhiteInGoal' | 'peonBlackInGoal'
  setOwnerPieces: React.Dispatch<React.SetStateAction<Piece[]>>
  setEnemyPieces: React.Dispatch<React.SetStateAction<Piece[]>>
  isMultiJugador: boolean
      setUserTurn: React.Dispatch<React.SetStateAction<string>>
      setIsPeonInGoal: React.Dispatch<React.SetStateAction<boolean>>
      setShowAlert: React.Dispatch<React.SetStateAction<boolean>>
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



    const playerPiecesUpdate = [
      ...oldPiece,
      { ...pieceToSchante, ficha: change, initialPlace: details[2] },
    ]
    const enemyPiecesUpdate = findEnemy
    ? enemyPieces.filter((piece) => piece.idPiece !== findEnemy.idPiece)
    : enemyPieces
            


    if (isMultiJugador) {

    socket.emit(messageGoal, {
      [currentTurn === "white" ? "piecesWhite" : "piecesBlack"]: playerPiecesUpdate,
      [currentTurn === "white" ? "piecesBlack" : "piecesWhite"]: enemyPiecesUpdate,
        uciMove
    });
  } else{

    setOwnerPieces(playerPiecesUpdate)
    setEnemyPieces(enemyPiecesUpdate)
    setUserTurn(nextTurn)
    setIsPeonInGoal(false)
    setShowAlert(false)
    console.log('updete move');
  }

  }
};

export default makePeonChange; 