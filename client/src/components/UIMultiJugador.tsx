import useGameContext from "../porvider/context";
import { Piece, PieceName } from "../porvider/data";

const UIMultiJugador = ({ children }: { children: React.ReactNode }) => {
  const { userTurn, userId, turn  ,piecesWhite, piecesBlack ,showPiecesCount ,setShowPiecesCount } = useGameContext();

  const isWhite = userTurn == "white";
  return (
    <div className="font-montserrat  select-none ">
      <p className=" text-2xl text-center mb-6 py-6  bg-black text-white rounded-lg">
        {" "}
        Turno de las {turn == "white" ? " blancas" : "negras"}
      </p>

      <div className={`flex 
        ${!isWhite ? "sm:flex-row-reverse" : "sm:flex-row"}
        ${!isWhite ? "flex-col-reverse" : "flex-col"} `}>
       {showPiecesCount && <ShowCountPices pieces={piecesWhite}/>}
        <div className="hiddend flex flex-row">
        {children}
        </div>
        {showPiecesCount && <ShowCountPices pieces={piecesBlack}/>}
        </div>

      <p>{userId ? '' : "Cargando..."}</p>

      
     {userId != "" && <div className="text-2xl text-center mt-4 py-2  bg-black text-white rounded-lg relative">
        <p>{userTurn == "white" ? "Piezas blancas" : "Piezas negras"}</p>
        <span className="h-3">
          {userTurn == turn ? "Tu turno" : "Turno del oponente"}
        </span>
        <div
         onClick={() => setShowPiecesCount(!showPiecesCount)}
         className="absolute top-4 sm:top-[30px] right-3 bg-blue-600 rounded-full">
          <p className="text-sm px-2">{showPiecesCount ? "Mostrar piezas" : "Ocultar piezas"}</p>
        </div>
      </div>}
    </div>
  );
};

export default UIMultiJugador


const ShowCountPices = ({pieces}: {pieces: Piece[]}) => {
 
  const piecesCount: Record<PieceName, number> = {
    peon: 0,
    torre: 0,
    caballo: 0,
    alfil: 0,
    reina: 0,
    rey: 0,
  }

  pieces.forEach((piece ) => {
    piecesCount[piece.ficha as PieceName]++ 
  })
  const isWhite = pieces[0].color == "black"

  return (
    <section className="mx-4 flex flex-row sm:flex-col w-full justify-center">
      {Object.entries(piecesCount).map(([key, value]) => {
        
        if (key === 'rey') return null
        return (
        <div
        className={`flex flex-col   items-center  justify-center  ${isWhite? ' ':'invert'} `}
        key={key}> 
        <img
        className="w-10 h-12"
        src={`/${key}-removebg-preview.png`} alt="" />
        <p  className={` ${value > 0 ? " text-white" : "text-red-500"} h-12 flex items-center relative top-2`}>{value}</p>
          
        </div>
      )})}
    </section>
  )
}