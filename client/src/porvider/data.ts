
// export const cols = ["a", "b", "c", "d", "e", "f", "g", "h"];
export type PieceName = "peon" | "caballo" | "alfil" | "rey" | "reina" | "torre";
export interface HistoryMove {
  owner:'blancas' | 'negras'
  piece:string
  newLocation:string
 
}

export interface Piece {
  idPiece: string;
  ficha: string;
  initialPlace: string;
  isSelected?: boolean;
  isEnemy?: boolean;
   color:'white' | 'black'
}

export const fichasWhite: Piece[] =

 [
  { ficha: "peon", initialPlace: "a2", idPiece: "RO5FCzYW" ,color:"white"},
  { ficha: "peon", initialPlace: "b2", idPiece: "DmDg6pMZ",color:"white" },
  { ficha: "peon", initialPlace: "c2", idPiece: "pqMYbTSA",color:"white" },
  { ficha: "peon", initialPlace: "d2", idPiece: "7wVMVv39",color:"white" },
  { ficha: "peon", initialPlace: "e2", idPiece: "4eNv0f26",color:"white" },
  { ficha: "peon", initialPlace: "f2", idPiece: "e7jH56Nh",color:"white" },
  { ficha: "peon", initialPlace: "g2", idPiece: "oxlOxvTP",color:"white" },
  { ficha: "peon", initialPlace: "h2", idPiece: "pLdhQtvS",color:"white" },
  { ficha: "torre", initialPlace: "a1", idPiece: "RAJ0BQpl",color:"white" },
  { ficha: "torre", initialPlace: "h1", idPiece: "0bIZjz5j",color:"white" },
  { ficha: "caballo", initialPlace: "b1", idPiece: "U4rClwpb",color:"white" },
  { ficha: "caballo", initialPlace: "g1", idPiece: "yWFSNvVk",color:"white" },
  { ficha: "alfil", initialPlace: "c1", idPiece: "tG6d59Ny",color:"white" },
  { ficha: "alfil", initialPlace: "f1", idPiece: "K9J9V7Sa" ,color:"white"},
  { ficha: "rey", initialPlace: "e1", idPiece: "3ezzL8Ku",color:"white" },
  { ficha: "reina", initialPlace: "d1", idPiece: "aBVWNuyl",color:"white" },
];


export const fichasBlack: Piece[] =
[
  { ficha: "peon", initialPlace: "a7", idPiece: "7frqtHGA",color:"black" },
  { ficha: "peon", initialPlace: "b7", idPiece: "4XXkdK6y",color:"black" },
  { ficha: "peon", initialPlace: "c7", idPiece: "DUPCkshs",color:"black" },
  { ficha: "peon", initialPlace: "d7", idPiece: "8hxS60KK",color:"black" },
  { ficha: "peon", initialPlace: "e7", idPiece: "0hL8OfYW",color:"black" },
  // { ficha: "peon", initialPlace: "f7", idPiece: "fwnA9gIK",color:"black" },
  { ficha: "peon", initialPlace: "g7", idPiece: "g27NM3Lz",color:"black" },
  { ficha: "peon", initialPlace: "h7", idPiece: "YiEn5Z1f",color:"black" },
  { ficha: "torre", initialPlace: "a8", idPiece: "yUG5v23e",color:"black" },
  { ficha: "torre", initialPlace: "h8", idPiece: "6PbZEUoC",color:"black" },
  { ficha: "caballo", initialPlace: "b8", idPiece: "FZ2SoHN9",color:"black" },
  { ficha: "caballo", initialPlace: "g8", idPiece: "rkfMoeap",color:"black" },
  { ficha: "alfil", initialPlace: "c8", idPiece: "sWJWqoJT",color:"black" },
  { ficha: "alfil", initialPlace: "f8", idPiece: "RaeHTDaR",color:"black" },
  { ficha: "rey", initialPlace: "e8", idPiece: "Y1ewJ8J6",color:"black"},
  { ficha: "reina", initialPlace: "d8", idPiece: "cw63CfYg" ,color:"black"},
];

export const peonCanChangeTo: string[] = ["torre", "caballo", "alfil",  "reina"]





// [
//   { ficha: "peon", initialPlace: "a2", idPiece: "RO5FCzYW" },
//   { ficha: "peon", initialPlace: "b2", idPiece: "DmDg6pMZ" },
//   { ficha: "peon", initialPlace: "c2", idPiece: "pqMYbTSA" },
//   { ficha: "peon", initialPlace: "d2", idPiece: "7wVMVv39" },
//   { ficha: "peon", initialPlace: "e2", idPiece: "4eNv0f26" },
//   { ficha: "peon", initialPlace: "f2", idPiece: "e7jH56Nh" },
//   { ficha: "peon", initialPlace: "g2", idPiece: "oxlOxvTP" },
//   { ficha: "peon", initialPlace: "h2", idPiece: "pLdhQtvS" },
//   { ficha: "torre", initialPlace: "a1", idPiece: "RAJ0BQpl" },
//   { ficha: "torre", initialPlace: "h1", idPiece: "0bIZjz5j" },
//   { ficha: "caballo", initialPlace: "b1", idPiece: "U4rClwpb" },
//   { ficha: "caballo", initialPlace: "g1", idPiece: "yWFSNvVk" },
//   { ficha: "alfil", initialPlace: "c1", idPiece: "tG6d59Ny" },
//   { ficha: "alfil", initialPlace: "f1", idPiece: "K9J9V7Sa" },
//   { ficha: "rey", initialPlace: "d1", idPiece: "3ezzL8Ku" },
//   { ficha: "reina", initialPlace: "e1", idPiece: "aBVWNuyl" },
// ];



