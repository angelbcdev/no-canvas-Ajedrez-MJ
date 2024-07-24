import { Piece } from "./data";
export const cols = ["a", "b", "c", "d", "e", "f", "g", "h"];


export const movePiecePeon = ({
  piece,
  currentLocation,
  youCanMove,
  enemyPieces,
  currentRowIndex,
}: {
  piece: Piece;
  currentLocation: { row: string; col: number };
  youCanMove: React.Dispatch<React.SetStateAction<string[]>>;
  enemyPieces: Piece[];
  currentRowIndex: number;
}) => {
    const allMoveAvailable = [];
    const validCol =piece.color === 'white' ? [
      currentLocation.col + 1,
      Number(piece.initialPlace[1]) == 2 && currentLocation.col + 2,
    ]:[
      currentLocation.col - 1,
      Number(piece.initialPlace[1]) == 7 && currentLocation.col - 2,
    ]
    const validRow = [cols[currentRowIndex]];

    for (let i = 0; i < validRow.length; i++) {
      for (let j = 0; j < validCol.length ; j++) {
        const createdLocation = validRow[i] + validCol[j]; // validCol.length
        const hasEnemy = enemyPieces
          .map((piece) => piece.initialPlace)
          .includes(createdLocation);
        piece.initialPlace != createdLocation &&
          !hasEnemy &&
          allMoveAvailable.push(createdLocation);

          if (hasEnemy) {
            break; // Termina el bucle si se encuentra una ubicación ocupada
          }
      }}


    const searchEnemyLeft = piece.color === 'black' 
      ? cols[currentRowIndex - 1] + `${currentLocation.col - 1}`
      : cols[currentRowIndex - 1] + `${currentLocation.col + 1}`;

    const searchEnemyRight = piece.color === 'black' 
      ? cols[currentRowIndex + 1] + `${currentLocation.col - 1}`
      : cols[currentRowIndex + 1] + `${currentLocation.col + 1}`;
   
    if (
      enemyPieces.map((piece) => piece.initialPlace).includes(searchEnemyLeft)
    ) {
      allMoveAvailable.push(searchEnemyLeft);
    }
    if (
      enemyPieces.map((piece) => piece.initialPlace).includes(searchEnemyRight)
    ) {
      allMoveAvailable.push(searchEnemyRight);
    }
    youCanMove(allMoveAvailable);
   
    
  
};

export const movePieceCaballo = ({
  currentLocation,
  currentRowIndex,
  youCanMove,
  piece,
}: {
  currentLocation: { row: string; col: number };
  currentRowIndex: number;
  youCanMove: React.Dispatch<React.SetStateAction<string[]>>;
  piece: Piece;
}) => {
  const allMoveAvailable = [];
  //  vertical
  const validVerticalCol = [currentLocation.col - 2, currentLocation.col + 2];
  const validVerticalRow = [
    cols[currentRowIndex - 1],
    cols[currentRowIndex + 1],
  ];
  for (let i = 0; i < validVerticalCol.length; i++) {
    for (let j = 0; j < validVerticalRow.length; j++) {
      const createdLocation = validVerticalRow[j] + validVerticalCol[i];

      piece.initialPlace != createdLocation && allMoveAvailable.push(createdLocation);
    }
  }

  //  horizontal
  const validHorizontalCol = [currentLocation.col - 1, currentLocation.col + 1];
  const validHorizontalRow = [
    cols[currentRowIndex - 2],
    cols[currentRowIndex + 2],
  ];
  for (let i = 0; i < validHorizontalCol.length; i++) {
    for (let j = 0; j < validHorizontalRow.length; j++) {
      const createdLocation = validHorizontalRow[j] + validHorizontalCol[i];

      piece.initialPlace != createdLocation && allMoveAvailable.push(createdLocation);
    }
  }

  youCanMove(allMoveAvailable);
};
export const movePieceKing = ({
  currentLocation,
  currentRowIndex,
  youCanMove,
 
  piece,
}: {
  currentLocation: { row: string; col: number };
  currentRowIndex: number;
  youCanMove:  React.Dispatch<React.SetStateAction<string[]>>;
  
  piece: Piece;
  
})=>{
  const allMoveAvailable = [];
  
  const validCol = [
    currentLocation.col + 1,
    currentLocation.col,
    currentLocation.col - 1,
  ];
  const validRow = [
    cols[currentRowIndex - 1],
    cols[currentRowIndex],
    cols[currentRowIndex + 1],
  ];

  for (let i = 0; i < validCol.length; i++) {
    for (let j = 0; j < validRow.length; j++) {
      const createdLocation = validRow[j] + validCol[i];

      piece.initialPlace != createdLocation &&
      allMoveAvailable.push(createdLocation);
    }
  }

  youCanMove(allMoveAvailable);
}

export const movePieceTorre = ({
  currentLocation,
  currentRowIndex,
  youCanMove,
  ocupedSpot,
}: {
  currentRowIndex: number;
  currentLocation: { row: string; col: number };
  youCanMove: React.Dispatch<React.SetStateAction<string[]>>;
  ocupedSpot: string[];
}) => {
  const allMoveAvailable = [];

  for (let i = currentLocation.col - 1; i > 0; i--) {
    //vertical Up
    const createdLocation = currentLocation.row + i;
    allMoveAvailable.push(createdLocation);

    if (ocupedSpot.includes(createdLocation)) {
      break; // Termina el bucle si se encuentra una ubicación ocupada
    }
  }
  for (let i = currentLocation.col + 1; i < 9; i++) {
    //vertical  down

    const createdLocation = currentLocation.row + i;
    allMoveAvailable.push(createdLocation);

    if (ocupedSpot.includes(createdLocation)) {
      break; // Termina el bucle si se encuentra una ubicación ocupada
    }
  }

  for (let i = currentRowIndex + 1; i < 8; i++) {
    // horizontal right
    const createdLocation = cols[i] + currentLocation.col;
    allMoveAvailable.push(createdLocation);
    if (ocupedSpot.includes(createdLocation)) {
      break; // Termina el bucle si se encuentra una ubicación ocupada
    }
  }

  for (let i = currentRowIndex - 1; i > -1; i--) {
    // horizontal left
    const createdLocation = cols[i] + currentLocation.col;
    allMoveAvailable.push(createdLocation);
    if (ocupedSpot.includes(createdLocation)) {
      break; // Termina el bucle si se encuentra una ubicación ocupada
    }
  }

  youCanMove(allMoveAvailable);
};


export const movePieceAlfil = ({
  currentRowIndex,
  currentLocation,
  piece,
  youCanMove,
  ocupedSpot,
}: {
  currentRowIndex: number;
  currentLocation: { row: string; col: number };
  piece: Piece;
  youCanMove: React.Dispatch<React.SetStateAction<string[]>>;
  ocupedSpot: string[];
}) => {
  const allMoveAvailable = [];
  const validCol = [];

  for (let i = 0; i < 9; i++) {
    validCol.push(i);
  }

  const validRowLeftUp = [];
  const validRowLeftDown = [];

  for (let a = 1; a < 9; a++) {
    validRowLeftUp.push(cols[currentRowIndex - a]);
  }

  for (let a = 0; a < 9; a++) {
    validRowLeftDown.push(cols[currentRowIndex - a - 1]);
  }

  const validRowRightUp = [];
  const validRowRightDown = [];

  for (let a = currentLocation.col; a > 0; a--) {
    cols[currentRowIndex + a] &&
      validRowRightUp.unshift(cols[currentRowIndex + a]);
  }
  for (let a = 9; a > 0; a--) {
    cols[currentRowIndex + a] &&
      validRowRightDown.unshift(cols[currentRowIndex + a]);
  }

  // Left Up
  for (let i = 0; i < validRowLeftUp.length; i++) {
    const createdLocation = validRowLeftUp[i] + (currentLocation.col - (i + 1));
    piece.initialPlace != createdLocation && allMoveAvailable.push(createdLocation);
    if (ocupedSpot.includes(createdLocation)) {
      break; // Termina el bucle si se encuentra una ubicación ocupada
    }
  }

  // Left Down
  for (let i = 0; i < 9; i++) {
    const createdLocation =
      validRowLeftDown[i] + (currentLocation.col + (i + 1));
    piece.initialPlace != createdLocation && allMoveAvailable.push(createdLocation);
    if (ocupedSpot.includes(createdLocation)) {
      break; // Termina el bucle si se encuentra una ubicación ocupada
    }
  }
  // Right Up
  for (let i = 0; i < validRowRightUp.length; i++) {
    const createdLocation =
      validRowRightUp[i] + (currentLocation.col - (i + 1));
    piece.initialPlace != createdLocation && allMoveAvailable.push(createdLocation);

    if (ocupedSpot.includes(createdLocation)) {
      break; // Termina el bucle si se encuentra una ubicación ocupada
    }
  }

  // Right Down
  for (let i = 0; i < validRowRightDown.length; i++) {
    const createdLocation =
      validRowRightDown[i] + (currentLocation.col + (i + 1));
    piece.initialPlace != createdLocation && allMoveAvailable.push(createdLocation);
    if (ocupedSpot.includes(createdLocation)) {
      break; // Termina el bucle si se encuentra una ubicación ocupada
    }
  }

  youCanMove(allMoveAvailable);
};

export const movePieceReina = ({
  currentLocation,
  currentRowIndex,
  youCanMove,
  ocupedSpot,
  piece
}: {
  currentRowIndex: number;
  currentLocation: { row: string; col: number };
  youCanMove: React.Dispatch<React.SetStateAction<string[]>>;
  ocupedSpot: string[];
  piece: Piece
}) => {
  const allMoveAvailable = [];
  for (let i = currentLocation.col - 1; i > 0; i--) {
    //vertical Up
    const createdLocation = currentLocation.row + i;
    allMoveAvailable.push(createdLocation);

    if (ocupedSpot.includes(createdLocation)) {
      break; // Termina el bucle si se encuentra una ubicación ocupada
    }
  }
  for (let i = currentLocation.col + 1; i < 9; i++) {
    //vertical  down

    const createdLocation = currentLocation.row + i;
    allMoveAvailable.push(createdLocation);

    if (ocupedSpot.includes(createdLocation)) {
      break; // Termina el bucle si se encuentra una ubicación ocupada
    }
  }

  for (let i = currentRowIndex + 1; i < 8; i++) {
    // horizontal right
    const createdLocation = cols[i] + currentLocation.col;
    allMoveAvailable.push(createdLocation);
    if (ocupedSpot.includes(createdLocation)) {
      break; // Termina el bucle si se encuentra una ubicación ocupada
    }
  }

  for (let i = currentRowIndex - 1; i > -1; i--) {
    // horizontal left
    const createdLocation = cols[i] + currentLocation.col;
    allMoveAvailable.push(createdLocation);
    if (ocupedSpot.includes(createdLocation)) {
      break; // Termina el bucle si se encuentra una ubicación ocupada
    }
  }

  for (let i = currentLocation.col - 1; i > 0; i--) {
    //vertical Up
    const createdLocation = currentLocation.row + i;
    allMoveAvailable.push(createdLocation);

    if (ocupedSpot.includes(createdLocation)) {
      break; // Termina el bucle si se encuentra una ubicación ocupada
    }
  }
  for (let i = currentLocation.col + 1; i < 9; i++) {
    //vertical  down

    const createdLocation = currentLocation.row + i;
    allMoveAvailable.push(createdLocation);

    if (ocupedSpot.includes(createdLocation)) {
      break; // Termina el bucle si se encuentra una ubicación ocupada
    }
  }

  for (let i = currentRowIndex + 1; i < 8; i++) {
    // horizontal right
    const createdLocation = cols[i] + currentLocation.col;
    allMoveAvailable.push(createdLocation);
    if (ocupedSpot.includes(createdLocation)) {
      break; // Termina el bucle si se encuentra una ubicación ocupada
    }
  }

  for (let i = currentRowIndex - 1; i > -1; i--) {
    // horizontal left
    const createdLocation = cols[i] + currentLocation.col;
    allMoveAvailable.push(createdLocation);
    if (ocupedSpot.includes(createdLocation)) {
      break; // Termina el bucle si se encuentra una ubicación ocupada
    }
  }
  const validRowLeftUp = [];
  const validRowLeftDown = [];

  for (let a = 1; a < 9; a++) {
    validRowLeftUp.push(cols[currentRowIndex - a]);
  }

  for (let a = 0; a < 9; a++) {
    validRowLeftDown.push(cols[currentRowIndex - a - 1]);
  }

  const validRowRightUp = [];
  const validRowRightDown = [];

  for (let a = currentLocation.col; a > 0; a--) {
    cols[currentRowIndex + a] &&
      validRowRightUp.unshift(cols[currentRowIndex + a]);
  }
  for (let a = 9; a > 0; a--) {
    cols[currentRowIndex + a] &&
      validRowRightDown.unshift(cols[currentRowIndex + a]);
  }

  // Left Up
  for (let i = 0; i < validRowLeftUp.length; i++) {
    const createdLocation = validRowLeftUp[i] + (currentLocation.col - (i + 1));
    piece.initialPlace != createdLocation && allMoveAvailable.push(createdLocation);
    if (ocupedSpot.includes(createdLocation)) {
      break; // Termina el bucle si se encuentra una ubicación ocupada
    }
  }

  // Left Down
  for (let i = 0; i < 9; i++) {
    const createdLocation =
      validRowLeftDown[i] + (currentLocation.col + (i + 1));
    piece.initialPlace != createdLocation && allMoveAvailable.push(createdLocation);
    if (ocupedSpot.includes(createdLocation)) {
      break; // Termina el bucle si se encuentra una ubicación ocupada
    }
  }
  // Right Up
  for (let i = 0; i < validRowRightUp.length; i++) {
    const createdLocation =
      validRowRightUp[i] + (currentLocation.col - (i + 1));
    piece.initialPlace != createdLocation && allMoveAvailable.push(createdLocation);

    if (ocupedSpot.includes(createdLocation)) {
      break; // Termina el bucle si se encuentra una ubicación ocupada
    }
  }

  // Right Down
  for (let i = 0; i < validRowRightDown.length; i++) {
    const createdLocation =
      validRowRightDown[i] + (currentLocation.col + (i + 1));
    piece.initialPlace != createdLocation && allMoveAvailable.push(createdLocation);
    if (ocupedSpot.includes(createdLocation)) {
      break; // Termina el bucle si se encuentra una ubicación ocupada
    }
  }

  youCanMove(allMoveAvailable);

  
  
};

