import { createContext, useContext, useState } from "react";
import { fichasBlack, fichasWhite, Piece } from "./data";
import { cols, movePiecePeon } from "./movePieces";


const gameContext = createContext<any>(null);




export const GameContextProvider = ({ children }: any) => {
  const [piecesWhite, setPiecesWhite] = useState(fichasWhite)
  const [piecesBlack, setPiecesBlack] = useState(fichasBlack)
  const [turn, setTurn] = useState("white")
  const [piecetomove, setPiecetomove] = useState("")
  const [squaresSelected, setSquaresSelected] = useState<string[]>([])



  const moverToSquare = ({newLocation }:{newLocation:string}) => {
  
   
    
    if (turn === "white" ){
      const piece = piecesWhite.find(piece => piece.idPiece === piecetomove)
      const oldPiece = piecesWhite.filter(piece => piece.idPiece !== piecetomove)
    
      if (piece !== undefined) {

        if (piecesWhite.map(piece => piece.initialPlace).includes(newLocation)) {
          return 
        }

        if (squaresSelected.includes(newLocation) ) {
          
          setPiecesWhite([...oldPiece, {...piece, initialPlace: newLocation}])
          setTurn("black")
          setSquaresSelected([])
          setPiecetomove("")

          const findEnemy = piecesBlack.find(piece => piece.initialPlace === newLocation)
          if (findEnemy !== undefined) {
            setPiecesBlack(piecesBlack.filter(piece => piece.idPiece !== findEnemy.idPiece))
          }

        }else{
          setSquaresSelected([])
          setPiecetomove("")
        }

        
        // 
      }
     
      

    } else if( turn === "black") {

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
          if (findEnemy !== undefined) {
            setPiecesWhite(piecesWhite.filter(piece => piece.idPiece !== findEnemy.idPiece))
          }

        }else{
          setSquaresSelected([])
          setPiecetomove("")
        }

        
        // 
      }
    }

    
  }



  const values ={
    piecesWhite,piecesBlack,turn , piecetomove, setPiecetomove , moverToSquare,squaresSelected, setSquaresSelected
  }
  return (
    <gameContext.Provider value={values}>
      {children}
    </gameContext.Provider>
  )
}

const useGameContext = () => useContext(gameContext);

export default useGameContext 