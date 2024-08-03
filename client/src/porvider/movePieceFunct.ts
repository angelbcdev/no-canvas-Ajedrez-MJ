// if (turn === "white" && userTurn === "white") {

import { Socket  } from "socket.io-client";
import { Piece } from "./data";
import { cols, movePieceAlfil, movePieceCaballo, movePieceKing, movePiecePeon, movePieceReina, movePieceTorre } from "./movePieces";

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
  golPeon,
  setKingIsHake,
  needMoveKing,
  setNeedMoveKing,
  isMultiJugador,
  setOwnerPieces,
  setEnemyPieces,
  setReyIsDeath,
  setResult,

    setUserTurn,
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
  kingIsHake:string[]
  setKingIsHake:React.Dispatch<React.SetStateAction<string[]>>
  needMoveKing: boolean
  setNeedMoveKing: React.Dispatch<React.SetStateAction<boolean>>
  isMultiJugador: boolean
  setOwnerPieces: React.Dispatch<React.SetStateAction<Piece[]>>
  setEnemyPieces: React.Dispatch<React.SetStateAction<Piece[]>>
  setUserTurn: React.Dispatch<React.SetStateAction<string>>
  setReyIsDeath: React.Dispatch<React.SetStateAction<boolean>>
  setResult: React.Dispatch<React.SetStateAction<string>>
})=>{

  
  const piece = myPieces.find((piece) => piece.idPiece === piecetomove);
  const oldPiece = myPieces.filter((piece) => piece.idPiece !== piecetomove);


  const piecesAlyWhite = myPieces.map((piece) => piece.initialPlace);
  const piecesAlyBlack = enemyPieces.map((piece) => piece.initialPlace);
  const allPiecesToogether = [...piecesAlyWhite, ...piecesAlyBlack];
  
  if (needMoveKing && piece?.ficha === "rey"){ 
    setNeedMoveKing(false)
    socket.emit("kingIsSafe", false)
  
  }
 

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
            if (!isMultiJugador) {
              setReyIsDeath(true)
              setShowAlert(true)
              
              setResult('Partida terminada')
            }
          }


          let isKill = ''
          const isPeonUCI  = piece?.ficha === "peon"
          if (findEnemy) {
            isKill = isPeonUCI ? `${piece?.initialPlace[0]}x` : 'x'
          }
          const transFormToUCI = `${ isPeonUCI ?'' : `${piecesToUci[piece!.ficha] &&  piecesToUci[piece!.ficha].toUpperCase()}`}  ${isKill}${ newLocation}`
          const uciMove = transFormToUCI.replace(/ /g, "")

          //search for the Hake
          const currentLocation = {
            row: newLocation[0] as string,
            col: Number(newLocation[1]),
          };
          const currentRowIndex = cols.indexOf(currentLocation.row);
          if (piece.ficha === 'rey') {
            movePieceKing({
              currentLocation,
                currentRowIndex,
                youCanMove:setKingIsHake,
                piece
            })
          }

          if (piece.ficha === 'reina') {
            
            movePieceReina({
              currentLocation,
                currentRowIndex,
                youCanMove:setKingIsHake,
                ocupedSpot: allPiecesToogether,
                piece
            })
          }
         
          if (piece.ficha === 'alfil') {
            movePieceAlfil({
              piece,
              currentLocation,
                currentRowIndex,
                youCanMove:setKingIsHake,
                ocupedSpot: allPiecesToogether
            })
          }
          if (piece.ficha === 'torre') {
            movePieceTorre({
              currentLocation,
                currentRowIndex,
                youCanMove:setKingIsHake,
                ocupedSpot: allPiecesToogether
            })
          }
          if (piece.ficha === 'caballo') {
            movePieceCaballo({
              currentLocation,
                currentRowIndex,
                youCanMove:setKingIsHake,
                piece
            })
          }

          
          if (piece.ficha === 'peon') {
            movePiecePeon({
              piece,
                currentLocation,
                youCanMove:setKingIsHake,
                enemyPieces,
                currentRowIndex
            })
          }
         
          
          setTimeout(() => {
            const playerPiecesUpdate = [...oldPiece, { ...piece, initialPlace: newLocation }]
            const enemyPiecesUpdate =  findEnemy ? enemyPieces.filter((piece) => piece.idPiece !== findEnemy.idPiece) : enemyPieces
            if (isMultiJugador) {
              socket.emit(moveAlert, {
                [curretTurn === 'white' ? 'piecesWhite' : 'piecesBlack']: playerPiecesUpdate,
                [curretTurn === 'white' ? 'piecesBlack' : 'piecesWhite']: enemyPiecesUpdate,
                uciMove
              });
            }else{
             
              
              setOwnerPieces(playerPiecesUpdate)
              setEnemyPieces(enemyPiecesUpdate)
              setUserTurn(nextTurn)
              
            }
         
           
          }, 500);
        }
      } else {
        setSquaresSelected([]);
        setPiecetomove("");
      }
    }
  
}

export default movePieceFunct