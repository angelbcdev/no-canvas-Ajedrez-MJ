import useGameContext from "../../porvider/context";

type TOpation = "Player vs Player" | "Player vs AI" | "Multiplayer";

const options: TOpation[] = ["Player vs Player", "Player vs AI", "Multiplayer"];

const WaitForUserWindow = () => {
  const { setShowAlert, setWaitForUser, setIsMultiJugador, isMultiJugador
    , makeSetupMultiJugador, setIsPlayerVSIA,
    setIsPlayerVsPlayer, isAvilableMP
  } = useGameContext()

  const handleClick = (option: "Player vs Player" | "Player vs AI"
    | "Multiplayer") => {

    switch (option) {
      case "Player vs Player":
        setIsPlayerVsPlayer(true);
        setIsMultiJugador(false);
        setShowAlert(false);
        setWaitForUser(false);
        break;
      case "Player vs AI":
        setIsPlayerVsPlayer(false);
        setIsPlayerVSIA(true);
        setIsMultiJugador(false);
        setShowAlert(false);
        setWaitForUser(false)

        break;
      case "Multiplayer":
        makeSetupMultiJugador()
        setIsPlayerVsPlayer(false);
        setIsMultiJugador(true);
        setShowAlert(true);
        setWaitForUser(true);
        break;
    }
  };




  return (
    <section

      className="absolute flex flex-col z-50 w-[250px] h-[250px] bg-slate-200 shadow-inner translate-y-1/2 left-1/2 -translate-x-1/2 rounded-md  pt-4  justify-center items-center ">

      {isMultiJugador ?
        <div>
          <p className=" text-center font-semibold text-xl relative bottom-6 ">wait for other player</p>
          <div className="flex flex-row gap-3 justify-evenly">
            {options.map((option) => (
              <span
                className={`
              animate-pulse transition  
              bg-slate-300 hover:bg-slate-400 text-black font-semibold py-2 px-4 rounded`}
                key={option}
              >

              </span>
            ))}
          </div>
        </div> :
        <div className="flex flex-col gap-3">
          <p className=" text-center font-semibold text-xl relative bottom-6 ">Press any option</p>
          {options.map((option) => {
            const btnIsMM = option === "Multiplayer";

            if (btnIsMM && !isAvilableMP) {

              return (
                <div className="relative group mt-2 ">

                  <a target="_blank" href="https://no-canvas-ajedrez-multijugador.onrender.com" className="bg-red-500 text-white hover:bg-red-400 border-4 border-red-800 font-semibold py-2 px-4 rounded"> For multiplayer</a>
                  <div className="absolute hidden group-hover:block top-20 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black font-semibold w-[200px] py-2 px-4 rounded shadow-2xl">
                    <p>you will be redirected to the multiplayer page  </p>
                  </div>
                </div>
              )
            }
            return (
              <button
                key={option}
                onClick={() => handleClick(option)}
                className="bg-slate-300 hover:bg-slate-400 text-black font-semibold py-2 px-4 rounded">
                {option}
              </button>
            )
          })}
        </div>}
    </section>
  )
};

export default WaitForUserWindow; 