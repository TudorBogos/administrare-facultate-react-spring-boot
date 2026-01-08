export type Facultate = {
  id: number;
  nume: string;
};

export type ProgramStudiu = {
  id: number;
  facultateId: number;
  nume: string;
  locuriBuget: number;
  locuriTaxa: number;
};

export type ProgramStudiuView = ProgramStudiu & {
  facultateNume: string;
};

export type Candidat = {
  id: number;
  nume: string;
  prenume: string;
  email: string;
  parolaHash?: string | null;
};

export type Dosar = {
  id: number;
  candidatId: number;
  status: string;
  medie: number | null;
  createdAt: string;
};

export type DosarView = Dosar & {
  candidatNume: string;
  candidatPrenume: string;
};

export type Optiune = {
  id: number;
  dosarId: number;
  programId: number;
  prioritate: number;
};

export type Admin = {
  id: number;
  email: string;
  createdAt: string;
};

export type ProcesareAdmitereResult = {
  dosareProcesate: number;
  dosareAdmise: number;
  dosareNealocate: number;
};

export type RezultatAdmitere = {
  dosarId: number;
  candidatId: number;
  candidatNume: string;
  candidatPrenume: string;
  medie: number | null;
  createdAt: string;
  prioritate: number | null;
  status: string;
  programId: number | null;
  programNume: string | null;
  facultateNume: string | null;
};

export type RaportInscrieriProgram = {
  programId: number;
  programNume: string;
  facultateNume: string;
  inscrisi: number;
};

export type RaportFacultate = {
  facultateNume: string;
  admisi: number;
  respinsi: number;
};
