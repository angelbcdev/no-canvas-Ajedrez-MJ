import useGameContext from "../../porvider/context";


const HakeMAteWindos =({title}:{title:string})=>{
    const { result  } = useGameContext()

  return(
    <section
    onClick={() => window.location.reload()}
    className="absolute z-50 w-[250px] h-[250px] bg-slate-200 shadow-inner translate-y-1/2 left-1/2 -translate-x-1/2 rounded-md flex-col gap-7  pt-4 flex justify-center items-center font-montserrat ">
      <p className=" text-center font-semibold text-lg relative bottom-6 ">{title}</p>
      <p className=" text-center font-semibold text-3xl relative bottom-6 "> {result}</p>
    </section>
    )
};

export default HakeMAteWindos; 