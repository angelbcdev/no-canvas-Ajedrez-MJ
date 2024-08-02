import { useEffect, useRef, useState } from "react";
import useGameContext from "../porvider/context";
import { Piece, PieceName } from "../porvider/data";

const UIMultiJugador = ({ children }: { children: React.ReactNode }) => {
  const { userTurn, userId, turn, piecesWhite, piecesBlack, showPiecesCount, setShowPiecesCount, history, piecetomove } = useGameContext();
  const [showHistory, setShowHistory] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }

  }, [history]);

  useEffect(() => {

    setShowHistory(false)
  }, [piecetomove]);

  const isWhite = userTurn == "white";
  return (
    <div className="font-montserrat  select-none relative ">
       <ObserverViews />

      
      <div className="relative"
        onClick={() => setShowHistory(!showHistory)}
      >
        <p className=" text-2xl text-center mb-6 py-3  bg-black text-white rounded-lg ">Last Move: {history[history.length - 1]}</p>
        <p className=" absolute bottom-4 left-4 z-30 text-center  bg-black text-white rounded-lg ">{showHistory ? "Hide History" : "Show History"}</p>
        <div
          ref={scrollContainerRef}
          className={` overflow-scroll absolute  top-10 ${!showHistory ? "z-0 h-10 bg-black overflow-hidden hidden" : " z-40  h-[300px] bg-[#f0efef]"} flex flex-col gap-3 w-[160px] left-0  rounded-2xl p-6 animation-all duration-300 `}>

          {
            history.map((item, index) => {

              return (
                <div
                  className="flex gap-3  items-center"
                  key={index}>
                  <p
                    className="text-sm "
                  >{index % 2 == 0 ? "white" : "black"} -{`>`}</p>
                  <p>{item}</p>
                </div>
              );
            })
          }
        </div>
      </div>
      <div className={`flex 
        ${!isWhite ? "sm:flex-row-reverse" : "sm:flex-row"}
        ${!isWhite ? "flex-col-reverse" : "flex-col"} `}>
        {showPiecesCount && <ShowCountPices pieces={piecesWhite} />}
        <div className="hiddend flex flex-row">
          {children}
        </div>
        {showPiecesCount && <ShowCountPices pieces={piecesBlack} />}
      </div>

      <p>{userId ? '' : "Cargando..."}</p>


      <div className="text-2xl text-center mt-4 py-2  bg-black text-white rounded-lg relative">
        <p>{userTurn != 'espectador' ? userTurn : ''}</p>
        <span className="h-3">
          {userTurn !== 'espectador' ? userTurn == turn ? "Tu turno" : "Turno del oponente" : (<p className="h-20 items-center text-xl flex justify-center ">espectador</p>)}
        </span>
        <div
          onClick={() => setShowPiecesCount(!showPiecesCount)}
          className="absolute top-4 sm:top-[30px] right-3 bg-blue-600 rounded-full">
          <p className="text-sm px-2">{showPiecesCount ? "Mostrar piezas" : "Ocultar piezas"}</p>
        </div>
      </div>
    </div>
  );
};

export default UIMultiJugador


const ShowCountPices = ({ pieces }: { pieces: Piece[] }) => {

  const piecesCount: Record<PieceName, number> = {
    peon: 0,
    torre: 0,
    caballo: 0,
    alfil: 0,
    reina: 0,
    rey: 0,
  }

  pieces.forEach((piece) => {
    piecesCount[piece.ficha as PieceName]++
  })
  const isWhite = pieces[0].color == "black"

  return (
    <section className="mx-4 flex flex-row sm:flex-col w-full justify-center">
      {Object.entries(piecesCount).map(([key, value]) => {

        if (key === 'rey') return null
        return (
          <div
            className={`flex flex-col   items-center  justify-center  ${isWhite ? ' ' : 'invert'} `}
            key={key}>
            <img
              className="w-10 h-12"
              src={`/${key}-removebg-preview.png`} alt="" />
            <p className={` ${value > 0 ? " text-white" : "text-red-500"} h-12 flex items-center relative top-2`}>{value}</p>

          </div>
        )
      })}
    </section>
  )
}

const ObserverViews = () => {
  const { userTurn,  views ,niceAlert,
    changeNiceAlert ,greatAlert, changeGreatAlert, changeGoodAlert,
    goodAlert, } = useGameContext();
  const isEpectador = userTurn == 'espectador'
  
  return (<div className={`
  ${isEpectador ? 'pl-8' : 'justify-center '}
  z-50 text-2xl text-center mb-6 py-6  bg-black text-white rounded-lg flex flex-row items-center gap-4 w relative`}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z" stroke="#ffffff" stroke-width="1.5"></path> <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="#ffffff" stroke-width="1.5"></path> </g></svg>
    <p>:</p>
    <p className=" "> {views - 2 < 0 ? 0 : views - 2}</p>
    {isEpectador &&
      <section className="flex flex-row items-center gap-2 text-sm justify-evenly w-full">
        <p onClick={changeNiceAlert} className="bg-blue-600 px-5 py-1 rounded-full hover:bg-blue-400 cursor-pointer" >Nice !!</p>
        <p onClick={changeGreatAlert} className="bg-green-600 px-5 py-1 rounded-full  hover:bg-green-400 cursor-pointer" >great !!</p>
        <p onClick={changeGoodAlert} className="bg-orange-600 px-5 py-1 rounded-full hover:bg-orange-400 cursor-pointer">Uiii !!</p>
      
      </section>
    }


      <section className=" w-[443px] sm:w-[520px] h-[200px] flex flex-col items-center gap-2 left-0 text-sm justify-evenly absolute top-72 bg-transparent  text-white rounded-lg    pointer-events-none ">
      { niceAlert && <p className="bg-blue-600 px-5 py-1 rounded-full hover:bg-blue-400 cursor-pointer animate-bounce" >Nice played !!</p>}
       {greatAlert && <p className="bg-green-600 px-5 py-1 rounded-full  hover:bg-green-400 cursor-pointer animate-bounce delay-500" >great moved !!</p>}
        {goodAlert && <p className="bg-orange-600 px-5 py-1 rounded-full hover:bg-orange-400 cursor-pointer animate-bounce">whoo now can you do? !!</p>}
        
        {/* <p className="bg-red-600 px-5 py-1 rounded-full hover:bg-red-400 cursor-pointer  a  animate-bounce delay-500">Holaaa {turn}</p> */}
      </section>

  </div>
  )
}