


import CoverBoard from "./UI/CoverBoard";
import UIMultiJugador from "./components/UIMultiJugador";
import Board from "./components/Board";
// import UCIBoard from "./components/UCIBoard";


function App() {

  return (
    <main className="w-screen h-full sm:py-10 bg-gray-600 flex flex-col sm:justify-center items-center">
      <CoverBoard />
      <UIMultiJugador>
        <Board />
      </UIMultiJugador>
      {/* <UCIBoard  /> */}
    </main>
  );
}

export default App;








