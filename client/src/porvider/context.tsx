import { createContext, useContext, useEffect, useState } from "react";
import { fichasBlack, fichasWhite, Piece } from "./data";
import io from "socket.io-client";
import movePieceFunct from "./movePieceFunct";
import makePeonChange from "./makePeonChange";
import showKinIsHake from "./showKinIsHake";

const socket = io("192.168.12.158:3000"); // io("192.168.10.196:3000"); //

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
  changePeonInGoal: (change: string) => void;
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
}

const gameContext = createContext<IGameContext>({} as IGameContext);
const backupHistory: string[] = [];

const saveToBackup = ({
  newMove,
  saveMove
}:{
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
  const [waitForUser, setWaitForUser] = useState<boolean>(false);
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

  useEffect(() => {
  

    if (turn === "black") { //search for king in black pieces
      showKinIsHake({ 
        enemyPieces: piecesBlack,
        kingIsHake,
        setPiecetomove,
        socket});

    }
    if (turn === "white") { //search for king in white pieces
      showKinIsHake({ 
        enemyPieces: piecesWhite,
        kingIsHake,
        setPiecetomove,
        socket});
    }
    

    
    
  }, [kingIsHake]);

  useEffect(() => {
    socket.on("connect", () => {
      setUserId(socket.id || "");
      socket.emit("find", {
        id: socket.id,
      });

      socket.on("waitForPlayer", () => {
        setShowAlert(true);
        setWaitForUser(true);
      });

      socket.on("userRegister", (data) => {
        setUserTurn(data[0].id === socket.id ? "white" : "black");
      });

      socket.on("whiteActualize", (data) => {
        setTurn("black");
        setPiecesWhite(data.piecesWhite);
        setPiecesBlack(data.piecesBlack);
       
        saveToBackup({newMove: data.uciMove, saveMove: setHistory})
      });

      socket.on("peonWhiteChange", (data) => {
        setTurn("black");
        setShowAlert(false);
        setIsPeonInGoal(false);
        setPiecesWhite(data.piecesWhite);
        setPiecesBlack(data.piecesBlack);
        saveToBackup({newMove: data.uciMove, saveMove: setHistory})
      });

      socket.on("blackActualize", (data) => {
        setTurn("white");
        setPiecesWhite(data.piecesWhite);
        setPiecesBlack(data.piecesBlack);
       
        saveToBackup({newMove: data.uciMove, saveMove: setHistory})
      });

      socket.on("peonBlackChange", (data) => {
        setShowAlert(false);
        setIsPeonInGoal(false);
        setTurn("white");
        setPiecesWhite(data.piecesWhite);
        setPiecesBlack(data.piecesBlack);
        saveToBackup({newMove: data.uciMove, saveMove: setHistory})
        
      });

      socket.on("userIsDisconected", () => {
        setShowAlert(true);
      });
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

    socket.on("showKinIsHake", (data) => {
      setNeedMoveKing(true);
      setPiecetomove(data);
    })

    socket.on("kingIsSafeAndMoved", () => {
      setNeedMoveKing(false);
    })
  }, [squaresSelected, showAlert]);

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
      });
    }
  };

  const changePeonInGoal = (change: string) => {
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
        messageGoal : 'peonWhiteInGoal',
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
        messageGoal : 'peonBlackInGoal',
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
    userTurn,
    setUserTurn,
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
    needMoveKing, setNeedMoveKing
  };

  return <gameContext.Provider value={values}>{children}</gameContext.Provider>;
};

const useGameContext = () => useContext(gameContext);

export default useGameContext;
