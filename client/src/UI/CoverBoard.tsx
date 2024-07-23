import useGameContext from "../porvider/context";
import ChangePeonWindow from "./nodals/ChangePeonWindow";
import WaitForUserWindow from "./nodals/WaitForUserWindow";

const CoverBoard = () => {

  const {showAlert, setShowAlert , isPeonInGoal ,waitForUser} = useGameContext()


  return (
    <>
      {showAlert && (
        <section
        className=" absolute w-screen h-screen bg-red-400 flex justify-center items-center"
         >
        <div
        
        
        onClick={() => setShowAlert(false)}
        className="fixed z-10 w-full h-full flex justify-center items-center  bg-black/40"
       
         >
        </div>
        <div className=" w-[250px] h-[250px] relative z-50 bottom-36">
         {isPeonInGoal && <ChangePeonWindow />}
         {waitForUser && <WaitForUserWindow />}
        </div>
        </section>)}
    </>
  );
};

export default CoverBoard;