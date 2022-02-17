export interface Player {
  name: string;
  id: string;
}

export interface Connections {
  [options: string]: {
    players: Player[];
  };
}

export interface JoinData {
  name: string;
  gameID: string;
}

export interface StatusObject {
  msg: string;
  type: "error" | "warning" | "update" | "success";
}
