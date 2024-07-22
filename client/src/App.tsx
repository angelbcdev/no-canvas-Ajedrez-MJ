// clearimport { useState } from 'react'
import { useEffect } from "react";
import io from "socket.io-client";
import useGameContext from "./porvider/context";
import { generateRandomString } from "./porvider/const";
import { Piece } from "./porvider/data";
import { movePieceCaballo, movePieceKing, movePiecePeon } from "./porvider/movePieces";
// 192.168.1.153
const socket = io("localhost:3000");



function App() {

  const { squaresSelected} = useGameContext()


  useEffect(() => {
   console.log('squaresSelected',squaresSelected);
   
    
    
  }, [squaresSelected])


  return (
    <main className='w-screen h-screen bg-red-400 flex justify-center items-center'>
      <Board  />
    
    </main>
  )
}

export default App

const Board = () => {
  const cols = ["a", "b", "c", "d", "e", "f", "g", "h"];

  const { moverToSquare , setPiecetomove ,squaresSelected ,turn , setSquaresSelected , piecesBlack, piecesWhite} = useGameContext()

  const piecesAlyWhite = piecesWhite.map(piece => piece.initialPlace )
  const piecesAlyBlack = piecesBlack.map(piece => piece.initialPlace )
  
  
  

  return(
    <section className="">
      {
        cols.map((_
          , rowIndex) => (
          <div key={generateRandomString(3)} className="flex">
            {
              cols.map((col, squareIndex ) =>{ 

                const location = `${col}${8 -rowIndex }`
                const piece = [...piecesWhite,... piecesBlack].find(piece => piece.initialPlace === location)
                 
                const isBlack =
                rowIndex % 2 === 0 ? squareIndex % 2 === 0 : squareIndex % 2 !== 0;
                
                 const squareToMove = squaresSelected.find(square => square === location)

                 

                 
                 
                 
                

                return(
                <div 
                onClick={() =>{ 
                  
                  setPiecetomove(piece?.idPiece);
                  moverToSquare({newLocation:location});
                  const currentLocation = {
                    row: piece?.initialPlace[0] as string,
                    col: Number(piece?.initialPlace[1]),
                  };
                  const currentRowIndex = cols.indexOf(currentLocation.row);
          
                  if (piece?.color === turn) {
                  

                  if (piece?.ficha === 'peon') {

                     movePiecePeon({
                      piece,
                      currentLocation,
                      youCanMove: setSquaresSelected,
                      enemyPieces: piece.color === 'black' ? piecesWhite : piecesBlack,
                      currentRowIndex
                    })
                    // const validCol =piece.color === 'white' ? [
     
                    //   currentLocation.col + 1,
                    //   Number(piece.initialPlace[1]) == 2 && currentLocation.col + 2,
                    // ]:[
                    //   currentLocation.col - 1,
                    //   Number(piece.initialPlace[1]) == 7 && currentLocation.col - 2,
                    // ]

                    // const validRow = [cols[currentRowIndex]];
                    
                    // for (let i = 0; i < validRow.length; i++) {
                    //   for (let j = 0; j < validCol.length ; j++) {
                    //     const createdLocation = validRow[i] + validCol[j]; // validCol.length
                        
                        
                       
                    //     // const hasEnemy = enemyPieces
                    //     //   .map((piece) => piece.initialPlace)
                    //     //   .includes(createdLocation);
                        
                
                  
                    //     // type.initialPlace != createdLocation &&
                    //     //   !hasEnemy &&
                    //       allMoveAvailable.push(createdLocation);
                
                    //       // if (hasEnemy) {
                    //       //   break; // Termina el bucle si se encuentra una ubicación ocupada
                    //       // }
                
                    //   }}

                      
                      
                    //    setSquaresSelected(allMoveAvailable)
                    
                    
                  }else if (piece?.ficha === 'caballo') {
                    movePieceCaballo({
                      currentLocation,
                      currentRowIndex,
                      youCanMove: setSquaresSelected,
                      piece,
                    })
                  }else if (piece?.ficha === 'rey') {
                    movePieceKing({
                      currentLocation,
                      currentRowIndex,
                      youCanMove: setSquaresSelected,
                      piece,
                    })
                  }
                  
               }
                
                }}
                
                key={generateRandomString(3)} className={` ${isBlack ? 'bg-white text-black' : 'bg-black text-white'} relative z-0  w-[54px] h-[54px] sm:w-16 sm:h-16  border border-black flex justify-center items-center`}>
                  <p className="absolute z-0">{location}</p>
                    <div className={`w-full h-full relative z-10  ${squareToMove === location ? (turn === 'white' ? piecesAlyWhite.includes(location) ? '' : 'bg-green-500/50' : piecesAlyBlack.includes(location) ? '' : 'bg-green-500/50') : ''}`}>  </div>
                    <SearchPiece pieces={piecesWhite} color="white" location={location} />
                    <SearchPiece pieces={piecesBlack} color="black"  location={location} />
                 

                  </div>
              )}
            
            )
            }   
          </div>
        ))
      }
    
    </section>
  )
}


const SearchPiece = ({pieces, location , color}:{pieces: Piece[], location: string ,  color: "white" | "black"} ) => {

  const {turn ,piecetomove , setPiecetomove , squaresSelected } = useGameContext()
  const piece = pieces.find(piece => piece.initialPlace === location)

  const isYourTurn = turn === color
  const isThisPieceSelected = piecetomove === piece?.idPiece


  

  const imEnemy = squaresSelected?.includes(location)

   


  if (piece === undefined) {
    return null
  }



  return(
    <div 
    // onClick={() => (isYourTurn && piecetomove == '') && }
    
    className={` z-50 w-[54px] h-[54px] sm:w-16 sm:h-16 absolute border-2
    ${imEnemy && turn !== piece.color ? "bg-red-500" : ""}
    ${isYourTurn ? "border-yellow-500" : ""}
    ${isThisPieceSelected && isYourTurn ? "bg-yellow-500" : ""}
    `}>
       <img
        className={`w-full h-full  ${piece?.color === "black" ? "invert" : ""}  `}
        src={`/${piece.ficha}-removebg-preview.png`}
        alt=""
      />
      
       
       </div>
  )

}
