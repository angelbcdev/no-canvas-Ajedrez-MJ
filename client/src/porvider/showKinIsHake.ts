
import { Socket } from "socket.io-client";
import { Piece } from "./data";


const showKinIsHake =({
  enemyPieces,
  kingIsHake,
  setPiecetomove,
  socket
}:
{
  enemyPieces: Piece[]
  kingIsHake:string[]
  setPiecetomove: React.Dispatch<React.SetStateAction<string>>
  socket:  Socket<any, any>
})=>{
  const king = enemyPieces.find(piece => piece.ficha === "rey");

  if (king && kingIsHake.includes(king.initialPlace )) {
     
      setPiecetomove(king.idPiece );
      socket.emit("kingIsHake", king.idPiece);
  }
  
};

export default showKinIsHake; 