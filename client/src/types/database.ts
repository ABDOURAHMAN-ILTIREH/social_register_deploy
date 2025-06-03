// Database Types
export interface Menage {
  id: number;
  date_entretien: string;
  resultat_interview: string;
  langue_interview: string;
  region_provenance: string;
  commune_residence: string;
  sous_prefecture: string;
  quartier: string;
  milieu_residence: string;
  arrondissement:string;
  taille_menage: number;
  telephone_1: string;
  telephone_2?: string;
  enqueteur_id: number;
}

export interface Logement {
  id: number;
  menage_id: number;
  statut_occupation: string;
  type_logement: string;
  materiau_murs: string;
  materiau_toiture: string;
  nature_sol: string;
  source_energie_cuisson: string;
  source_energie_eclairage: string;
  source_eau: string;
  possede_toilletes: boolean;
  nature_usage_de_toilletes?: string;
 
}

export interface Equipement {
  id: number;
  menage_id: number;
  table_count: number;
  matelas: number;
  nattes: number;
  lits: number;
  chaises: number;
  televiseurs: number;
  radios: number;
  ventilateurs: number;
  climatiseur: number;
  telephone_mobile: number;
  refrigerateur: number;
  ordinateur: number;
  machine_a_laver: number;
  bicyclette: number;
  motocyclette: number;
  vehicule: number;
  bovins: number;
  ovins: number;
  camelins: number;
  volailles: number;
}

export interface Personne {
  id: number;
  menage_id: number;
  nom_prenoms: string;
  sexe: string;
  date_naissance: string;
  age: number;
  lien_parental: string;
  etat_matrimonial: string;
  piece_identite: string;
  numero_identite?: string;
  enceinte?: boolean;
  orphelin?: boolean;
  orphelin_du_quelle_parents: string;
  scolarisation: string;
  niveau_instruction: string;
  statut_occupation: string;
  statut_emploi: string;
  activite_principale: string;
  handicape?: boolean;
  membre_oragane_handicape:string,
  numero_carte_handicap?: string;
}

export interface Plainte {
  id: number;
  menage_id: number;
  type_de_plainte : string;
  categorie_plainte: string;
  description_plainte: string;
  createdAt: string;
}

export interface Enqueteur {
  id: number;
  nom: string;
  guichet_social: string;
}

export interface Entretien {
  id: number;
  menage_id: number;
  enqueteur_id: number;
}

export interface Users {
  id:number,
  name:string,
  email:string,
  password:string,
  role:string,
}


