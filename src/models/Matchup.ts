export interface Section {
  title: string;
  body: string;
}

export interface Matchup {
  _id: string;
  character: string;
  sections: Array<Section>;
}
