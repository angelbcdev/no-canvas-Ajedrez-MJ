


import CoverBoard from "./UI/CoverBoard";
import UIMultiJugador from "./components/UIMultiJugador";
import Board from "./components/Board";
// import UCIBoard from "./components/UCIBoard";


function App() {

  return (
    <main className="min-w-[435px] min-h-[900px] h-full sm:py-10 bg-gray-600 flex flex-col sm:justify-center items-center">
      <CoverBoard />
      <UIMultiJugador>
        <Board />
      </UIMultiJugador>
      {/* <UCIBoard  />  */}
    </main>
  );
}

export default App;








