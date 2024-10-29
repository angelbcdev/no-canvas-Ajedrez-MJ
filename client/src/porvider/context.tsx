import { createContext, useContext, useEffect, useState } from "react";
import { fichasBlack, fichasWhite, Piece } from "./data";
import io from "socket.io-client";
import movePieceFunct from "./movePieceFunct";
import makePeonChange from "./makePeonChange";
import showKinIsHake from "./showKinIsHake";
import { Chess } from "chess.js";



const socket = io('https://multjugador-jedrez.onrender.com/'); // https://multjugador-jedrez.onrender.com/

const controlBoard = new Chess();

console.log('socket', document.location.hostname);


//react-jedrez.netlify.app

interface IGameContext {
  piecesWhite: Piece[];
  piecesBlack: Piece[];
  setPiecesWhite: React.Dispatch<React.SetStateAction<Piece[]>>;
  setPiecesBlack: React.Dispatch<React.SetStateAction<Piece[]>>;
  piecetomove: string;
  setPiecetomove: React.Dispatch<React.SetStateAction<string>>;
  squaresSelected: string[];
  setSquaresSelected: React.Dispatch<React.SetStateAction<string[]>>;
  showAlert: boolean;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
  waitForUser: boolean;
  setWaitForUser: React.Dispatch<React.SetStateAction<boolean>>;
  isPeonInGoal: boolean;
  setIsPeonInGoal: React.Dispatch<React.SetStateAction<boolean>>;
  multiJugador: boolean;
  setMultiJugador: React.Dispatch<React.SetStateAction<boolean>>;
  turn: string;
  setTurn: React.Dispatch<React.SetStateAction<string>>;
  userTurn: string;
  setUserTurn: React.Dispatch<React.SetStateAction<string>>;
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  moverToSquare: ({ newLocation }: { newLocation: string }) => void;
  changePeonInGoal: (change: "reina" | "torre" | "caballo" | "alfil") => void;
  reyIsDeath: boolean;
  setReyIsDeath: React.Dispatch<React.SetStateAction<boolean>>;
  result: string;
  setResult: React.Dispatch<React.SetStateAction<string>>;
  showPiecesCount: boolean;
  setShowPiecesCount: React.Dispatch<React.SetStateAction<boolean>>;
  history: string[];
  setHistory?: React.Dispatch<React.SetStateAction<string[]>>
  kingIsHake: string[];
  setKingIsHake: React.Dispatch<React.SetStateAction<string[]>>;
  needMoveKing: boolean;
  setNeedMoveKing: React.Dispatch<React.SetStateAction<boolean>>;
  views: number;
  niceAlert: boolean;
  changeNiceAlert: () => void;
  greatAlert: boolean;
  changeGreatAlert: () => void;
  goodAlert: boolean;
  changeGoodAlert: () => void;
  isMultiJugador: boolean;
  setIsMultiJugador: React.Dispatch<React.SetStateAction<boolean>>;
  makeSetupMultiJugador: () => void
  playerSurrender: boolean;
  statusBoard: string[];
  isPlayerVSIA: boolean;
  setIsPlayerVSIA: React.Dispatch<React.SetStateAction<boolean>>
  isPlayerVsPlayer: boolean;
  setIsPlayerVsPlayer: React.Dispatch<React.SetStateAction<boolean>>
  kingIsInHake: boolean;
}


const gameContext = createContext<IGameContext>({} as IGameContext);
const backupHistory: string[] = [];

const saveToBackup = ({
  newMove,
  saveMove
}: {
  newMove: string
  saveMove: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  if (!backupHistory.includes(newMove)) {
    backupHistory.push(newMove);
    saveMove(data => [...data, newMove]);

  }


}

export const GameContextProvider = ({ children }: any) => {
  const [piecesWhite, setPiecesWhite] = useState<Piece[]>(fichasWhite);
  const [piecesBlack, setPiecesBlack] = useState<Piece[]>(fichasBlack);

  const [piecetomove, setPiecetomove] = useState<string>("");
  const [squaresSelected, setSquaresSelected] = useState<string[]>([]);

  const [showAlert, setShowAlert] = useState<boolean>(true);
  const [waitForUser, setWaitForUser] = useState<boolean>(true);
  const [isPeonInGoal, setIsPeonInGoal] = useState<boolean>(false);
  const [multiJugador, setMultiJugador] = useState<boolean>(true);
  const [turn, setTurn] = useState<string>("white");
  const [userTurn, setUserTurn] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const [reyIsDeath, setReyIsDeath] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const [showPiecesCount, setShowPiecesCount] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([]);

  const [needMoveKing, setNeedMoveKing] = useState<boolean>(false);
  const [kingIsHake, setKingIsHake] = useState<string[]>([]);
  const [views, setViews] = useState<number>(0);
  const [niceAlert, setNiceAlert] = useState<boolean>(false);
  const [greatAlert, setGreatAlert] = useState<boolean>(false);
  const [goodAlert, setGoodAlert] = useState<boolean>(false);
  const [isPlayerVsPlayer, setIsPlayerVsPlayer] = useState<boolean>(false);
  const [isMultiJugador, setIsMultiJugador] = useState<boolean>(false);
  const [isPlayerVSIA, setIsPlayerVSIA] = useState<boolean>(false);
  const [playerSurrender, setPlayerSurrender] = useState<boolean>(false);

  //chess IA Controller


  const [statusBoard, setStatusBoard] = useState(
    controlBoard.ascii().split("\n")
  );
  const [kingIsInHake, setKingIsInHake] = useState(false);
  const allmoves = controlBoard.moves();

  const refrechshowBoard = () => {
    setStatusBoard(controlBoard.ascii().split("\n"));
  };
  const makeUserMove = (uci: string) => {



    let extraMove = "";

    if (allmoves.includes(uci + "+")) {
      extraMove = "+";
      setKingIsInHake(true);
    }
    if (allmoves.includes(uci + "#")) {
      extraMove = "#";
      setKingIsInHake(true);
    }

    try {
      controlBoard.move(uci + extraMove);
    } catch (error) {
      console.log("error", error);
    }

    refrechshowBoard();
  };



  const IAMakeMove = () => {
    let moveIsKill = false;
    let moveSaved = "";

    const moves = controlBoard.moves();

    let move = ""
    if (moves.length === 0) {

      setReyIsDeath(true)
      setShowAlert(true)

      setResult('Partida terminada')

    } else {
      move = moves[Math.floor(Math.random() * moves.length)] == 'O-O' ? moves[Math.floor(Math.random() * moves.length)] : moves[Math.floor(Math.random() * moves.length)];
      const moveCanBeKill = moves.find((m) => m[1] === "x");
      if (moveCanBeKill) {
        moveSaved = moveCanBeKill;
        controlBoard.move(moveCanBeKill);

        moveIsKill = true;

      } else {
        moveSaved = move;
        controlBoard.move(move);
      }
    }





    refrechshowBoard();
    const history = controlBoard.history({ verbose: true });


    saveToBackup({ newMove: moveSaved, saveMove: setHistory })
    return {
      from: history[history.length - 1].from,
      to: history[history.length - 1].to,
      moveIsKill,
      moves
    };
  };


  useEffect(() => {
    if (isPlayerVSIA && userTurn === 'black') {


      if (turn === "black" && userTurn === "black") {

        const result = IAMakeMove()!;

        if (result.moveIsKill) {
          const piecePlayerToRemove = piecesWhite.filter(
            (piece) => piece.initialPlace !== result.to
          );

          setPiecesWhite(piecePlayerToRemove);
        }

        const seletedEnemyPiece: Piece | undefined = piecesBlack.find(
          (piece) => piece.initialPlace === result.from
        );

        if (seletedEnemyPiece === undefined) return



        const ollPieves = piecesBlack.filter(
          (piece) => piece.idPiece !== seletedEnemyPiece?.idPiece
        );



        setPiecesBlack([...ollPieves, { ...seletedEnemyPiece, initialPlace: result.to }]);
        setUserTurn("white");
        setTurn("white");

      }

    }
  }
    , [userTurn])




  //***************************************
  const changeGreatAlert = () => {
    socket.emit("changeAlert", "great");

  }

  const changeNiceAlert = () => {
    socket.emit("changeAlert", "nice");

  }

  const changeGoodAlert = () => {
    socket.emit("changeAlert", "good");

  }
  const activeNiceAlert = () => {
    setNiceAlert(true);
    setTimeout(() => {
      setNiceAlert(false);
    }, 3000);
  }

  const activeGreatAlert = () => {
    setGreatAlert(true);
    setTimeout(() => {
      setGreatAlert(false);
    }, 3000);
  }


  const activeGoodAlert = () => {
    setGoodAlert(true);
    setTimeout(() => {
      setGoodAlert(false);
    }, 3000);
  }


  const makeSetupMultiJugador = () => {


    setUserId(socket.id || "");
    socket.emit("find", {
      id: socket.id,
      // });

    });
  }


  if (isMultiJugador) {


    socket.on("userRegister", (data: any) => {

      const myIndex = data.findIndex((p: any) => p.id === socket.id);
      setShowAlert(false);
      setWaitForUser(false);

      if (myIndex !== -1) {
        switch (myIndex) {
          case 0:
            setUserTurn("white");
            break;
          case 1:
            setUserTurn("black");
            break;

          default:
            setUserTurn("espectador");
            setViews(data.length);
            break;
        }

      }
    });

    socket.on("whiteActualize", (data: any) => {
      setTurn("black");
      setPiecesWhite(data.piecesWhite);
      setPiecesBlack(data.piecesBlack);

      saveToBackup({ newMove: data.uciMove, saveMove: setHistory })
    });

    socket.on("peonWhiteChange", (data: any) => {
      setTurn("black");
      setShowAlert(false);
      setIsPeonInGoal(false);
      setPiecesWhite(data.piecesWhite);
      setPiecesBlack(data.piecesBlack);
      saveToBackup({ newMove: data.uciMove, saveMove: setHistory })
    });

    socket.on("blackActualize", (data: any) => {
      setTurn("white");
      setPiecesWhite(data.piecesWhite);
      setPiecesBlack(data.piecesBlack);

      saveToBackup({ newMove: data.uciMove, saveMove: setHistory })
    });

    socket.on("peonBlackChange", (data: any) => {
      setShowAlert(false);
      setIsPeonInGoal(false);
      setTurn("white");
      setPiecesWhite(data.piecesWhite);
      setPiecesBlack(data.piecesBlack);
      saveToBackup({ newMove: data.uciMove, saveMove: setHistory })

    });

    socket.on("userIsDisconected", (mainPlayerOff: boolean) => {
      if (mainPlayerOff) {
        setShowAlert(true);
        setPlayerSurrender(true);

        setPiecesWhite(fichasWhite)
        setPiecesBlack(fichasBlack)

      }
    });



    socket.on("blackWin", () => {
      setShowAlert(true);
      setReyIsDeath(true);
      setResult("black wins");
    });

    socket.on("whiteWin", () => {
      setShowAlert(true);
      setReyIsDeath(true);
      setResult("white wins");
    });

    socket.on("showKinIsHake", (data: any) => {
      setNeedMoveKing(true);
      setPiecetomove(data);
    })

    socket.on("kingIsSafeAndMoved", () => {
      setNeedMoveKing(false);
    })

    socket.on("turnAlert", (data: "nice" | "great" | "good") => {

      switch (data) {
        case "nice":
          activeNiceAlert();
          break;
        case "great":
          activeGreatAlert();
          break;
        case "good":
          activeGoodAlert();
          break;
        default:
          break;
      }

    });


  }


  useEffect(() => {


    if (turn === "black") { //search for king in black pieces
      showKinIsHake({
        enemyPieces: piecesBlack,
        kingIsHake,
        setPiecetomove,
        socket
      });

    }
    if (turn === "white") { //search for king in white pieces
      showKinIsHake({
        enemyPieces: piecesWhite,
        kingIsHake,
        setPiecetomove,
        socket
      });
    }




  }, [kingIsHake]);

  useEffect(() => {


    if (!isMultiJugador) {
      setUserTurn("white");


    }





  }, []);



  const moverToSquare = ({ newLocation }: { newLocation: string }) => {

    if (turn === "white" && userTurn === "white") {



      movePieceFunct({
        curretTurn: "white",
        myPieces: piecesWhite,
        piecetomove,
        newLocation,
        setPiecetomove,
        setTurn,
        setSquaresSelected,
        squaresSelected,
        setIsPeonInGoal,
        setShowAlert,
        socket,
        enemyPieces: piecesBlack,
        nextTurn: "black",
        moveAlert: "whiteMoved",
        moveToWin: "whiteKillKing",
        golPeon: "8",
        setKingIsHake,
        kingIsHake,
        needMoveKing,
        setNeedMoveKing,
        isMultiJugador,
        setOwnerPieces: setPiecesWhite,
        setEnemyPieces: setPiecesBlack,
        setUserTurn,
        setReyIsDeath,
        setResult,
        saveToBackup,
        setHistory,
        isPlayerVSIA,
        makeUserMove,
        isPlayerVsPlayer,
      });
    }


    if (turn === "black" && userTurn === "black") {




      movePieceFunct({
        curretTurn: "black",
        myPieces: piecesBlack,
        piecetomove,
        newLocation,
        setPiecetomove,
        setTurn,
        setSquaresSelected,
        squaresSelected,
        setIsPeonInGoal,
        setShowAlert,
        socket,
        enemyPieces: piecesWhite,
        nextTurn: "white",
        moveAlert: "blackMoved",
        moveToWin: "blackKillKing",
        golPeon: "1",
        setKingIsHake,
        kingIsHake,
        needMoveKing,
        setNeedMoveKing,
        isMultiJugador,
        setOwnerPieces: setPiecesBlack,
        setEnemyPieces: setPiecesWhite,
        setUserTurn,
        setReyIsDeath,
        setResult,
        saveToBackup,
        setHistory,


        isPlayerVsPlayer
      });
    }
  };

  const changePeonInGoal = (change: "reina" | "caballo" | "torre" | "alfil") => {
    const details = piecetomove.split("-");

    if (details[1] === "white") {
      makePeonChange({
        currentTurn: "white",
        change,
        details,
        myPieces: piecesWhite,
        setMyOwnPieces: setPiecesWhite,
        enemyPieces: piecesBlack,
        socket,
        messageGoal: 'peonWhiteInGoal',
        isMultiJugador,
        setOwnerPieces: setPiecesWhite,
        setEnemyPieces: setPiecesBlack,
        setUserTurn,
        nextTurn: "black",
        setIsPeonInGoal,
        setShowAlert,
        setKingIsHake,
        makeUserMove,
        isPlayerVSIA,
      });


    } else if (details[1] === "black") {
      makePeonChange({
        currentTurn: "black",
        change,
        details,
        myPieces: piecesBlack,
        setMyOwnPieces: setPiecesBlack,
        enemyPieces: piecesWhite,
        socket,
        messageGoal: 'peonBlackInGoal',
        isMultiJugador,
        setOwnerPieces: setPiecesBlack,
        setEnemyPieces: setPiecesWhite,
        setUserTurn,
        nextTurn: "white",
        setIsPeonInGoal,
        setShowAlert,
        setKingIsHake
      });


    }
  };

  const values: IGameContext = {
    piecesWhite,
    piecesBlack,
    setPiecesWhite,
    setPiecesBlack,
    piecetomove,
    setPiecetomove,
    squaresSelected,
    setSquaresSelected,
    showAlert,
    setShowAlert,
    waitForUser,
    setWaitForUser,
    isPeonInGoal,
    setIsPeonInGoal,
    multiJugador,
    setMultiJugador,
    turn,
    setTurn,
    setUserTurn,
    userTurn,
    userId,
    setUserId,
    moverToSquare,
    changePeonInGoal,
    reyIsDeath,
    setReyIsDeath,
    result,
    setResult,
    showPiecesCount,
    setShowPiecesCount,
    history,
    kingIsHake, setKingIsHake,
    needMoveKing, setNeedMoveKing, views,
    niceAlert,
    changeNiceAlert,
    greatAlert, changeGreatAlert,
    changeGoodAlert,
    goodAlert,
    isMultiJugador, setIsMultiJugador,
    makeSetupMultiJugador,
    playerSurrender,
    statusBoard,
    isPlayerVSIA,
    setIsPlayerVSIA,
    isPlayerVsPlayer,
    setIsPlayerVsPlayer,
    kingIsInHake

  };

  return <gameContext.Provider value={values}>{children}</gameContext.Provider>;
};

const useGameContext = () => useContext(gameContext);

export default useGameContext;
