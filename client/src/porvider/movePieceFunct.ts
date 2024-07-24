// if (turn === "white" && userTurn === "white") {

import { Socket  } from "socket.io-client";
import { Piece } from "./data";

export const piecesToUci: Record< string , string> = {
  peon: "p",
  torre: "t",
  caballo: "c",
  alfil: "a",
  rey: "k",
  reina: "q",
};


const movePieceFunct = ({
  curretTurn,
  myPieces,
  piecetomove,
  newLocation,
  setPiecetomove,
  setTurn,
  setSquaresSelected,
  squaresSelected,
  setIsPeonInGoal,
  setShowAlert,
  socket,
  enemyPieces,
  nextTurn,
  moveAlert,
  moveToWin,
  golPeon
}:{
  curretTurn: 'white' | 'black'
  myPieces: Piece[],
  piecetomove: string
  newLocation: string
  setPiecetomove: React.Dispatch<React.SetStateAction<string>>;
  setTurn: React.Dispatch<React.SetStateAction<string>>;
  setSquaresSelected: React.Dispatch<React.SetStateAction<string[]>>;
  squaresSelected: string[]
  setIsPeonInGoal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
  enemyPieces: Piece[]
  nextTurn: 'white' | 'black'
  moveAlert:'whiteMoved' | 'blackMoved'
  moveToWin:'whiteKillKing' | 'blackKillKing'
  golPeon:'8' | '1'
  socket:  Socket<any, any>
})=>{

  
    const piece = myPieces.find((piece) => piece.idPiece === piecetomove);
    const oldPiece = myPieces.filter((piece) => piece.idPiece !== piecetomove);

    if (piece !== undefined) {
      if (myPieces.map((piece) => piece.initialPlace).includes(newLocation)) {
        return;
      }

      if (squaresSelected.includes(newLocation)) {
        setTurn(nextTurn);
        setSquaresSelected([]);
        setPiecetomove("");

        if (piece.ficha === "peon" && newLocation[1] === golPeon) {
          setPiecetomove(piece.idPiece + "-" + piece.color + "-" + newLocation);
          setIsPeonInGoal(true);
          setShowAlert(true);
        } else {
          const findEnemy = enemyPieces.find((piece) => piece.initialPlace === newLocation);
          if (findEnemy?.ficha == 'rey' ) {
            socket.emit(moveToWin, 'Jugador white gano' )
          }


          let isKill = ''
          const isPeonUCI  = piece?.ficha === "peon"
          if (findEnemy) {
            isKill = isPeonUCI ? `${piece?.initialPlace[0]}x` : 'x'
          }
          const transFormToUCI = `${ isPeonUCI ?'' : `${piecesToUci[piece!.ficha] &&  piecesToUci[piece!.ficha].toUpperCase()}`}  ${isKill}${ newLocation}`
          const uciMove = transFormToUCI.replace(/ /g, "")

          
          
          setTimeout(() => {
            socket.emit(moveAlert, {
              [curretTurn === 'white' ? 'piecesWhite' : 'piecesBlack']: [...oldPiece, { ...piece, initialPlace: newLocation }],
              [curretTurn === 'white' ? 'piecesBlack' : 'piecesWhite']: findEnemy ? enemyPieces.filter((piece) => piece.idPiece !== findEnemy.idPiece) : enemyPieces,
              uciMove
            });
          }, 500);
        }
      } else {
        setSquaresSelected([]);
        setPiecetomove("");
      }
    }
  
}

export default movePieceFunct