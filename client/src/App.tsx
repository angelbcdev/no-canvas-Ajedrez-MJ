


import CoverBoard from "./UI/CoverBoard";
import UIMultiJugador from "./components/UIMultiJugador";
import Board from "./components/Board";

function App() {
  return (
    <main className="w-screen h-screen bg-gray-600 flex flex-col sm:justify-center items-center">
      <CoverBoard />
      <UIMultiJugador>
        <Board />
      </UIMultiJugador>
    </main>
  );
}

export default App;








