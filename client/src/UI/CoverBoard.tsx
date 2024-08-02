import useGameContext from "../porvider/context";
import ChangePeonWindow from "./nodals/ChangePeonWindow";
import HakeMAteWindos from "./nodals/HakeMAteWindos";
import WaitForUserWindow from "./nodals/WaitForUserWindow";

const CoverBoard = () => {

  const {showAlert,   isPeonInGoal ,waitForUser ,reyIsDeath ,playerSurrender} = useGameContext()


  return (
    <>
      {showAlert && (
        <section
        className=" absolute w-screen h-screen bg-red-400 flex justify-center items-center"
         >
        <div
        
        
        
        className="fixed z-10 w-full h-full flex justify-center items-center  bg-black/40"
       
         >
        </div>
        <div className=" w-[250px] h-[250px] relative z-50 bottom-36">
         {isPeonInGoal && <ChangePeonWindow />}
         {waitForUser && <WaitForUserWindow />}
         {reyIsDeath && <HakeMAteWindos title="Hake Mate" />}
         {playerSurrender && <HakeMAteWindos title="player Surrender" />}
        </div>
        </section>)}
    </>
  );
};

export default CoverBoard;