import { createContext, useContext, useEffect, useState } from "react";
import { fichasBlack, fichasWhite, Piece } from "./data";
import io from "socket.io-client";

const socket =  io('192.168.12.158:3000')     // io("192.168.10.196:3000"); //



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
}

const gameContext = createContext<IGameContext>({} as IGameContext);

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
  const [result , setResult] = useState<string>("")
  const [showPiecesCount , setShowPiecesCount] = useState<boolean>(false)

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
      });

      socket.on("peonWhiteChange", (data) => {
        setTurn("black");
        setShowAlert(false);
        setIsPeonInGoal(false);
        setPiecesWhite(data.piecesWhite);
        setPiecesBlack(data.piecesBlack);
      });

      socket.on("blackActualize", (data) => {
        setTurn("white");
        setPiecesWhite(data.piecesWhite);
        setPiecesBlack(data.piecesBlack);
      });

      socket.on("peonBlackChange", (data) => {
        setShowAlert(false);
        setIsPeonInGoal(false);
        setTurn("white");
        setPiecesWhite(data.piecesWhite);
        setPiecesBlack(data.piecesBlack);
      });

      socket.on("userIsDisconected", () => {
        setShowAlert(true);
      });
    });
     socket.on("blackWin", () => {
       setShowAlert(true);
       setReyIsDeath(true);
       setResult('black wins')
     })

     socket.on("whiteWin", () => {
       setShowAlert(true);
       setReyIsDeath(true);
       setResult('white wins')
     })
    


  }, [squaresSelected, showAlert]);

  const moverToSquare = ({ newLocation }: { newLocation: string }) => {
    if (turn === "white" && userTurn === "white") {
      const piece = piecesWhite.find((piece) => piece.idPiece === piecetomove);
      const oldPiece = piecesWhite.filter((piece) => piece.idPiece !== piecetomove);

      if (piece !== undefined) {
        if (piecesWhite.map((piece) => piece.initialPlace).includes(newLocation)) {
          return;
        }

        if (squaresSelected.includes(newLocation)) {
          setTurn("black");
          setSquaresSelected([]);
          setPiecetomove("");

          if (piece.ficha === "peon" && newLocation[1] === "8") {
            setPiecetomove(piece.idPiece + "-" + piece.color + "-" + newLocation);
            setIsPeonInGoal(true);
            setShowAlert(true);
          } else {
            const findEnemy = piecesBlack.find((piece) => piece.initialPlace === newLocation);
            if (findEnemy?.ficha == 'rey' ) {
              socket.emit("whiteKillKing", 'Jugador white gano' )
            }
            setTimeout(() => {
              socket.emit("whiteMoved", {
                piecesWhite: [...oldPiece, { ...piece, initialPlace: newLocation }],
                piecesBlack: findEnemy ? piecesBlack.filter((piece) => piece.idPiece !== findEnemy.idPiece) : piecesBlack,
              });
            }, 500);
          }
        } else {
          setSquaresSelected([]);
          setPiecetomove("");
        }
      }
    }

    if (turn === "black" && userTurn === "black") {
      const piece = piecesBlack.find((piece) => piece.idPiece === piecetomove);
      const oldPiece = piecesBlack.filter((piece) => piece.idPiece !== piecetomove);

      if (piece !== undefined) {
        if (piecesBlack.map((piece) => piece.initialPlace).includes(newLocation)) {
          return;
        }

        if (squaresSelected.includes(newLocation)) {
          setPiecesBlack([...oldPiece, { ...piece, initialPlace: newLocation }]);
          setTurn("white");
          setSquaresSelected([]);
          setPiecetomove("");

          const findEnemy = piecesWhite.find((piece) => piece.initialPlace === newLocation);

          if (findEnemy?.ficha == 'rey' ) {
            socket.emit("blackKillKing", 'Jugador Negro gano' )

          }

          if (piece.ficha === "peon" && newLocation[1] === "1") {
            setPiecetomove(piece.idPiece + "-" + piece.color + "-" + newLocation);
            setIsPeonInGoal(true);
            setShowAlert(true);
          } else {
            setTimeout(() => {
              socket.emit("blackMoved", {
                piecesWhite: findEnemy ? piecesWhite.filter((piece) => piece.idPiece !== findEnemy.idPiece) : piecesWhite,
                piecesBlack: [...oldPiece, { ...piece, initialPlace: newLocation }],
              });
            }, 500);
          }
        } else {
          setSquaresSelected([]);
          setPiecetomove("");
        }
      }
    }
  };

  const changePeonInGoal = (change: string) => {
    const details = piecetomove.split("-");

    if (details[1] === "white") {
      const pieceToSchante = piecesWhite.find((piece) => piece.idPiece === details[0]);
      const oldPiece = piecesWhite.filter((piece) => piece.idPiece !== details[0]);
      if (pieceToSchante !== undefined) {
        setPiecesWhite([...oldPiece, { ...pieceToSchante, ficha: change, initialPlace: details[2] }]);
        const findEnemy = piecesBlack.find((piece) => piece.initialPlace === details[2]);
        socket.emit("peonWhiteInGoal", {
          piecesWhite: [...oldPiece, { ...pieceToSchante, ficha: change, initialPlace: details[2] }],
          piecesBlack: findEnemy ? piecesBlack.filter((piece) => piece.idPiece !== findEnemy.idPiece) : piecesBlack,
        });
      }
    } else if (details[1] === "black") {
      const pieceToSchante = piecesBlack.find((piece) => piece.idPiece === details[0]);
      const oldPiece = piecesBlack.filter((piece) => piece.idPiece !== details[0]);
      if (pieceToSchante !== undefined) {
        setPiecesBlack([...oldPiece, { ...pieceToSchante, ficha: change, initialPlace: details[2] }]);
        const findEnemy = piecesWhite.find((piece) => piece.initialPlace === details[2]);
        socket.emit("peonBlackInGoal", {
          piecesBlack: [...oldPiece, { ...pieceToSchante, ficha: change, initialPlace: details[2] }],
          piecesWhite: findEnemy ? piecesWhite.filter((piece) => piece.idPiece !== findEnemy.idPiece) : piecesWhite,
        });
      }
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
    reyIsDeath, setReyIsDeath,
    result,
    setResult,
    showPiecesCount , setShowPiecesCount

  };

  return (
    <gameContext.Provider value={values}>
      {children}
    </gameContext.Provider>
  );
};

const useGameContext = () => useContext(gameContext);

export default useGameContext;
