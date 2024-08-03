import { generateRandomString } from "../../porvider/const";
import useGameContext from "../../porvider/context";
type TOpation = "torre" | "caballo" | "alfil" | "reina"
const peonCanChangeTo: TOpation[] = ["torre", "caballo", "alfil", "reina"]

const ChangePeonWindow = () => {
  const { changePeonInGoal } = useGameContext()

  return (
    <section className="absolute z-50 w-[250px] h-[250px] bg-slate-200 shadow-inner translate-y-1/2 left-1/2 -translate-x-1/2 rounded-md  pt-4 ">
      <p className=" text-center font-semibold text-xl ">Elige una Pieza</p>
      <ul className=" ">
        {peonCanChangeTo.map((change) => (
          <li
            key={generateRandomString(2)}
            onClick={() =>
              changePeonInGoal(change)
            }
            className="flex justify-center items-center cursor-pointer my-4  bg-white w-32 mx-auto rounded-full border   border-emerald-500 px-2.5 py-0.5 text-emerald-700 active:bg-emerald-400 active:text-teal-50 hover:bg-emerald-300 shadow-md"
          >
            {change}
          </li>
        ))}
      </ul>
    </section>
  );
};



export default ChangePeonWindow; 