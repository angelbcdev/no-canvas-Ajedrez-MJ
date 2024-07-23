import { createContext, useContext, useEffect, useState } from "react";
import { fichasBlack, fichasWhite, Piece } from "./data";
import { cols, movePiecePeon } from "./movePieces";

// 192.168.1.153
import io from "socket.io-client";
const socket = io("localhost:3000");


const gameContext = createContext<any>(null);




export const GameContextProvider = ({ children }: any) => {
  const [piecesWhite, setPiecesWhite] = useState(fichasWhite)
  const [piecesBlack, setPiecesBlack] = useState(fichasBlack)
  
  const [piecetomove, setPiecetomove] = useState("")
  const [squaresSelected, setSquaresSelected] = useState<string[]>([])

  const [showAlert, setShowAlert] = useState(true)
  const [isPeonInGoal, setIsPeonInGoal] = useState(false)
  const [multiJugador, setMultiJugador] = useState(true)
  const [turn, setTurn] = useState("white")
  const [userTurn, setUserTurn] = useState('')
  const [userId, setUserId] = useState('')


  useEffect(() => {

    socket.on("connect", () => {
      setUserId(socket.id)
      socket.emit("find", {
        id: socket.id,
        
      })
     
      socket.on('userRegister', (data) => {
        
        setUserTurn(data[0].id == socket.id ? 'white' : 'black') 
      })
      socket.on("whiteActualize", (data) => {
        setTurn('black')
       
        setPiecesWhite(data.piecesWhite)
        setPiecesBlack(data.piecesBlack)
      })

      socket.on("peonWhiteChange", (data) => {
        setTurn('black')
        setShowAlert(false)
        setIsPeonInGoal(false)
        setPiecesWhite(data.piecesWhite)
        setPiecesBlack(data.piecesBlack)
      })

      socket.on("blackActualize", (data) => {
        setTurn('white')
        setPiecesWhite(data.piecesWhite)
        setPiecesBlack(data.piecesBlack)
      })

      socket.on("peonBlackChange", (data) => {
        setShowAlert(false)
        setIsPeonInGoal(false)
        setTurn('white')
        setPiecesWhite(data.piecesWhite)
        setPiecesBlack(data.piecesBlack)
      })
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    })
    
  }, [squaresSelected, showAlert])
  
  const moverToSquare = ({newLocation }:{newLocation:string}) => {

    if (turn === "white" && userTurn === 'white') {
      const piece = piecesWhite.find(piece => piece.idPiece === piecetomove)
      const oldPiece = piecesWhite.filter(piece => piece.idPiece !== piecetomove)
    
      if (piece !== undefined) {
        
        

        if (piecesWhite.map(piece => piece.initialPlace).includes(newLocation)) {
          return 
        }

        if (squaresSelected.includes(newLocation) ) {
          
          // setPiecesWhite([...oldPiece, {...piece, initialPlace: newLocation}])
          setTurn("black")
          setSquaresSelected([])
          setPiecetomove("")

          
          
          if (piece.ficha === 'peon' && newLocation[1] === '8' ){
          
            setPiecetomove(piece.idPiece +'-'+ piece.color+'-'+ newLocation)
            setIsPeonInGoal(true)
            setShowAlert(true)
            
            
          }else {
            const findEnemy = piecesBlack.find(piece => piece.initialPlace === newLocation)
            setTimeout(() => {
              socket.emit("whiteMoved", {piecesWhite:[...oldPiece, {...piece, initialPlace: newLocation}] , 
                piecesBlack:findEnemy ? piecesBlack.filter(piece => piece.idPiece !== findEnemy.idPiece) : piecesBlack})
            }, 500);
            

          }
          
         

          

        }else{
          setSquaresSelected([])
          setPiecetomove("")
        }

        
        // 
      }
     
      

    }
    if( turn === "black" && userTurn === 'black') {

      const piece = piecesBlack.find(piece => piece.idPiece === piecetomove)
      const oldPiece = piecesBlack.filter(piece => piece.idPiece !== piecetomove)
     
      if (piece !== undefined) {

        if (piecesBlack.map(piece => piece.initialPlace).includes(newLocation)) {
          return 
        }

        if (squaresSelected.includes(newLocation)) {
          
          setPiecesBlack([...oldPiece, {...piece, initialPlace: newLocation}])
          setTurn("white")
          setSquaresSelected([])
          setPiecetomove("")

          const findEnemy = piecesWhite.find(piece => piece.initialPlace === newLocation)
          
          if (piece.ficha === 'peon' && newLocation[1] === '1' ){
          
            setPiecetomove(piece.idPiece +'-'+ piece.color+'-'+ newLocation)
            setIsPeonInGoal(true)
            setShowAlert(true)
            
            
          }else{
            setTimeout(() => {
              socket.emit("blackMoved", {piecesWhite: findEnemy? piecesWhite.filter(piece => piece.idPiece !== findEnemy.idPiece) : piecesWhite
                , piecesBlack:[...oldPiece, {...piece, initialPlace: newLocation}]})
            }, 500);

          }
         
         

        }else{
          setSquaresSelected([])
          setPiecetomove("")
        }

        
        // 
      }
    }
    

    
  }
  const changePeonInGoal = (change:string) => {
    
    const details = piecetomove.split('-')
    
    if (details[1] === 'white') {
      const pieceToSchante = piecesWhite.find(piece => piece.idPiece === details[0])
      const oldPiece = piecesWhite.filter(piece => piece.idPiece !== details[0])
      if (pieceToSchante !== undefined) {
        setPiecesWhite([...oldPiece, {...pieceToSchante, ficha: change ,initialPlace:details[2]}])
        const findEnemy = piecesBlack.find(piece => piece.initialPlace === details[2])
        socket.emit("peonWhiteInGoal",{
          piecesWhite:[...oldPiece, {...pieceToSchante, ficha: change ,initialPlace:details[2]}]
          , piecesBlack:findEnemy ? piecesBlack.filter(piece => piece.idPiece !== findEnemy.idPiece) : piecesBlack
        } )
      }
 
    }else if (details[1] === 'black') {
      const pieceToSchante = piecesBlack.find(piece => piece.idPiece === details[0])
      const oldPiece = piecesBlack.filter(piece => piece.idPiece !== details[0])
      if (pieceToSchante !== undefined) {
        setPiecesBlack([...oldPiece, {...pieceToSchante, ficha: change ,initialPlace:details[2]}])
        const findEnemy = piecesWhite.find(piece => piece.initialPlace === details[2])
        socket.emit("peonBlackInGoal",{piecesBlack:[...oldPiece, {...pieceToSchante, ficha: change ,initialPlace:details[2]}]
          , piecesWhite:findEnemy ? piecesWhite.filter(piece => piece.idPiece !== findEnemy.idPiece) : piecesWhite} )
      }
 
      
    }
    
    // setChangePeonInGoal(false)
    
  }



  const values ={
    piecesWhite,piecesBlack,turn , piecetomove, setPiecetomove , moverToSquare,squaresSelected, setSquaresSelected ,showAlert, setShowAlert
  ,changePeonInGoal,isPeonInGoal ,multiJugador ,userTurn, setUserTurn , userId
  }
  return (
    <gameContext.Provider value={values}>
      {children}
    </gameContext.Provider>
  )
}

const useGameContext = () => useContext(gameContext);

export default useGameContext 