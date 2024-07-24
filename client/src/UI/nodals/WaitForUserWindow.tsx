import useGameContext from "../../porvider/context";

const WaitForUserWindow =()=>{
  const { setShowAlert ,setWaitForUser } = useGameContext()

  return(
    <section
    onClick={() => (setShowAlert(false) , setWaitForUser(false))}
    className="absolute z-50 w-[250px] h-[250px] bg-slate-200 shadow-inner translate-y-1/2 left-1/2 -translate-x-1/2 rounded-md  pt-4 flex justify-center items-center ">
      <p className=" text-center font-semibold text-xl relative bottom-6 ">press to Start</p>
    </section>
    )
};

export default WaitForUserWindow; 