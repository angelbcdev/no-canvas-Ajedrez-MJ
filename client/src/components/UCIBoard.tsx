import useGameContext from "../porvider/context";


const UCIBoard =()=>{

  const { statusBoard } = useGameContext();

  return(
    <div className="bg-gray-50 my-auto border-black border-2 overflow-hidden rounded-lg">
      
    {statusBoard.map((line, index) => {
      const DataSquare = [];

      if (index != 10) {
        for (let i = 0; i < line.length; i++) {
          line[i] !== "" && DataSquare.push(line[i]);
        }
      }
      return (
        <div className={` flex`} key={index + Math.random() }>
          {DataSquare.map((square , index) => {
            return (
              <div key={square + index}>
                {(square === "p" ||
                  square === "n" ||
                  square === "b" ||
                  square === "q" ||
                  square === "k" ||
                  square === "r" ||
                  square === "P" ||
                  square === "N" ||
                  square === "B" ||
                  square === "Q" ||
                  square === "K" ||
                  square === "R" ||
                  square === ".") && (
                  <p
                    className={`w-4 h-5 border border-black  flex  justify-center items-center`}
                   
                  >
                    {square}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      );
    })}
  </div>
    )
};

export default UCIBoard; 