export interface ArtifactListItem {
  id: string;
  name: string;
  description: string;
  image_url: string;
  type: string;
  riot_id?: string;
}

export interface RuneListItem {
  id: string;
  name: string;
  description: string;
  image_url: string;
  type: string;
}

export interface ChampionArtifact {
  id: string;
  name: string;
  image_url: string;
  type: string;
  relation_type: string;
}

export interface ChampionRune {
  id: string;
  name: string;
  image_url: string;
  type: string;
  relation_type: string;
}
