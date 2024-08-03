import { Socket } from "socket.io-client";
import { Piece } from "./data";
import { piecesToUci } from "./movePieceFunct";
import {
  cols,
  movePieceAlfil,
  movePieceCaballo,
  movePieceReina,
  movePieceTorre,
} from "./movePieces";

const makePeonChange = ({
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
  setKingIsHake,
  makeUserMove,
  isPlayerVSIA,
}: {
  currentTurn: "white" | "black";
  nextTurn: "white" | "black";
  change: "reina" | "torre" | "caballo" | "alfil";
  details: string[];
  myPieces: Piece[];
  enemyPieces: Piece[];
  setMyOwnPieces: React.Dispatch<React.SetStateAction<Piece[]>>;
  socket: Socket<any, any>;
  messageGoal: "peonWhiteInGoal" | "peonBlackInGoal";
  setOwnerPieces: React.Dispatch<React.SetStateAction<Piece[]>>;
  setEnemyPieces: React.Dispatch<React.SetStateAction<Piece[]>>;
  isMultiJugador: boolean;
  setUserTurn: React.Dispatch<React.SetStateAction<string>>;
  setIsPeonInGoal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
  setKingIsHake: React.Dispatch<React.SetStateAction<string[]>>;
  makeUserMove?: (uci: string) => void;
  isPlayerVSIA?: boolean;
}) => {
  const pieceToSchante = myPieces.find((piece) => piece.idPiece === details[0]);
  const oldPiece = myPieces.filter((piece) => piece.idPiece !== details[0]);

  const newLocation = details[2];
  if (pieceToSchante !== undefined) {
    setMyOwnPieces([
      ...oldPiece,
      { ...pieceToSchante, ficha: change, initialPlace: newLocation },
    ]);
    const findEnemy = enemyPieces.find(
      (piece) => piece.initialPlace === newLocation
    );

    const currentLocation = {
      row: newLocation[0] as string,
      col: Number(newLocation[1]),
    };
    const currentRowIndex = cols.indexOf(currentLocation.row);

    const allPiecesToogether = [
      ...myPieces.map((piece) => piece.initialPlace),
      ...enemyPieces.map((piece) => piece.initialPlace),
    ];

    switch (change) {
      case "reina":
        movePieceReina({
          currentLocation,
          currentRowIndex,
          youCanMove: setKingIsHake,
          ocupedSpot: allPiecesToogether,
          piece: pieceToSchante,
        });

        break;
      case "torre":
        movePieceTorre({
          currentLocation,
          currentRowIndex,
          youCanMove: setKingIsHake,
          ocupedSpot: allPiecesToogether,
        });
        break;
      case "caballo":
        movePieceCaballo({
          currentLocation,
          currentRowIndex,
          youCanMove: setKingIsHake,
          piece: pieceToSchante,
        });
        break;
      case "alfil":
        movePieceAlfil({
          currentLocation,
          currentRowIndex,
          youCanMove: setKingIsHake,
          ocupedSpot: allPiecesToogether,
          piece: pieceToSchante,
        });
    }

    let isKill = "";
    const isPeonUCI = pieceToSchante?.ficha === "peon";
    if (findEnemy) {
      isKill = isPeonUCI ? `${pieceToSchante?.initialPlace[0]}x` : "x";
    }
    const transFormToUCI = `${
      isPeonUCI
        ? ""
        : `${
            piecesToUci[pieceToSchante!.ficha] &&
            piecesToUci[pieceToSchante!.ficha].toUpperCase()
          }`
    }  ${isKill}${details[2]}=${piecesToUci[change].toUpperCase()}`;
    const uciMove = transFormToUCI.replace(/ /g, "");

    const playerPiecesUpdate = [
      ...oldPiece,
      { ...pieceToSchante, ficha: change, initialPlace: details[2] },
    ];
    const enemyPiecesUpdate = findEnemy
      ? enemyPieces.filter((piece) => piece.idPiece !== findEnemy.idPiece)
      : enemyPieces;

    if (isMultiJugador) {
      socket.emit(messageGoal, {
        [currentTurn === "white" ? "piecesWhite" : "piecesBlack"]:
          playerPiecesUpdate,
        [currentTurn === "white" ? "piecesBlack" : "piecesWhite"]:
          enemyPiecesUpdate,
        uciMove,
      });
    } else {
      setOwnerPieces(playerPiecesUpdate);
      setEnemyPieces(enemyPiecesUpdate);
      setUserTurn(nextTurn);
      setIsPeonInGoal(false);
      setShowAlert(false);
      if (isPlayerVSIA) {
        makeUserMove && makeUserMove(uciMove);
      }
    }
  }
};

export default makePeonChange;
