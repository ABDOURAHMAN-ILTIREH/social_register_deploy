import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { api } from '../utils/api';
import type { Menage, Logement, Equipement, Personne, Plainte, Enqueteur, Entretien,Users} from '../types/database';
import { useAuth } from './AuthContext';


interface DataContextType {
  menages: Menage[];
  logements: Logement[];
  equipements: Equipement[];
  personnes: Personne[];
  plaintes: Plainte[];
  enqueteurs: Enqueteur[];
  entretiens: Entretien[];
  users: Users[];
  addMenage: (menage: Omit<Menage, 'id'>) => Promise<Menage>;
  getLogementByMenageId: (menageId: string) => Promise<Logement | undefined>;
  updateLogement: (logement: Logement) => Promise<void>;
  addLogement: (logement: Omit<Logement, 'id'>) => Promise<Logement>;
  getEquipementByMenageId: (id: string) => Promise<Equipement | undefined>;
  addEquipement: (equipement: Omit<Equipement, 'id'>) => Promise<Equipement>;
  updateMenage: (menage: Menage) => Promise<void>;
  deleteMenage: (id: number) => Promise<void>;
  updateEquipement: (equipement: Equipement) => Promise<void>;
  addPersonne: (personne: Omit<Personne, 'id'>) => Promise<Personne>;
  addEntreteint: (entretien: Omit<Entretien, 'id'>) => Promise<Entretien>;
  updatePersonne: (personne: Personne) => Promise<void>;
  deletePersonne: (id: number) => Promise<void>;
  getPlainteByMenageId: (menageId: string) => Promise<Plainte | undefined>;
  addPlainte: (plainte: Omit<Plainte, 'id'>) => Promise<Plainte>;
  updatePlainte: (plainte: Plainte) => Promise<void>;
  deletePlainte: (id: number) => Promise<void>;
  getHousehold: (id: string) => Promise<Menage | undefined>;
  addEnqueteur: (enqueteur: Omit<Enqueteur, 'id'>) => Promise<Enqueteur>;
  updateEnqueteur: (enqueteur:Enqueteur) => Promise<void>;
  deleteEnqueteur: (id:number) => Promise<void>;
  updateUsers:  (user:Users) => Promise<void>;

  deleteUsers :(id:number) => Promise<void>;
//   getHouseholdMembers: (id: string) => Promise<Personne[]>;
  getPerson: (id: string) => Promise<Personne | undefined>;
  fetchInitialData: () => Promise<void>;
  getHouseholdMembers: (id: string) => Promise<{
    [x: string]: any; menage: Menage; members: Personne[] 
}>;
  
  loading: boolean;
  error: string | null;
}


const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const { isAuthenticated, loading: authLoading } = useAuth(); 
  const [menages, setMenages] = useState<Menage[]>([]);
  const [logements, setLogements] = useState<Logement[]>([]);
  const [equipements, setEquipements] = useState<Equipement[]>([]);

  const [personnes, setPersonnes] = useState<Personne[]>([]);
  const [plaintes, setPlaintes] = useState<Plainte[]>([]);
  const [enqueteurs, setEnqueteurs] = useState<Enqueteur[]>([]);
  const [entretiens, setEntretiens] = useState<Entretien[]>([]);
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 



  // Stable version of fetchAuditLogs
  

  // Stable version of fetchInitialData
 const fetchInitialData = useCallback(async () => {
  setLoading(true);
  try {
    const [
      menagesRes, 
      logementsRes, 
      equipementsRes, 
      personnesRes, 
      plaintesRes, 
      enqueteursRes, 
      entretiensRes,
      usersRes
    ] = await Promise.all([
      api.get<Menage[]>('/menages'),
      api.get<Logement[]>('/logements'),
      api.get<Equipement[]>('/equipements'),
      api.get<Personne[]>('/personnes'),
      api.get<Plainte[]>('/plaintes'),
      api.get<Enqueteur[]>('/enqueteurs'),
      api.get<Entretien[]>('/entretiens'),
      api.get<Users[]>('/users'),
    ]);

    setMenages(menagesRes);
    setLogements(logementsRes);
    setEquipements(equipementsRes);
    setPersonnes(personnesRes);
    setPlaintes(plaintesRes);
    setEnqueteurs(enqueteursRes);
    setEntretiens(entretiensRes);
    setUsers(usersRes);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to fetch initial data');
    console.error('Error fetching initial data:', err);
  } finally {
    setLoading(false);
  }
}, []);



  // Menage operations
  const addMenage = async (menage: Omit<Menage, 'id'>): Promise<Menage> => {
    setLoading(true);
    try {
      const newMenage = await api.post<Menage>('/menages', menage);
      setMenages(prev => [...prev, newMenage]);
      return newMenage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add household');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMenage = async (menage: Menage): Promise<void> => {
    setLoading(true);
    try {
      await api.put(`/menages/${menage.id}`, menage);
      setMenages(prev => prev.map(m => m.id === menage.id ? menage : m));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update household');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const deleteMenage = async (id: number): Promise<void> => {
    setLoading(true);
    try {
      await api.delete(`/menages/${id}`);
      setMenages(prev => prev.filter(m => m.id !== id));
      // Cascade deletion is handled by the backend
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete household');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  //Enqueteur operatons
  const updateEnqueteur = async (enqueteur: Enqueteur): Promise<void> => {
    setLoading(true);
    try {
      await api.put(`/enqueteurs/${enqueteur.id}`, enqueteur);
      setEnqueteurs(prev => prev.map(m => m.id === enqueteur.id ? enqueteur : m));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update household');
      throw err;
    } finally {
      setLoading(false);
    }
  };

   const deleteEnqueteur = async (id: number): Promise<void> => {
    setLoading(true);
    try {
      await api.delete(`/enqueteurs/${id}`);
      setEnqueteurs(prev => prev.filter(m => m.id !== id));
      // Cascade deletion is handled by the backend
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete household');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Logement operations
  const getLogementByMenageId = async (menageId: string): Promise<Logement | undefined> => {
  setLoading(true);
  try {
    // Try to find in local state first
    const existing = logements.find(l => l.menage_id === parseInt(menageId));
    if (existing) return existing;

    // If not found locally, fetch from API
    const response = await api.get<Logement>(`/logements/${menageId}/logement`);
    return response;
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to fetch housing data');
    return undefined;
  } finally {
    setLoading(false);
  }
};

const updateLogement = async (logement: Logement): Promise<void> => {
  setLoading(true);
  try {
    // Update in backend
    await api.put(`/logements/${logement.id}`, logement);
    
    // Update local state
    setLogements(prev => 
      prev.map(l => l.id === logement.id ? logement : l)
    );
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to update housing');
    throw err;
  } finally {
    setLoading(false);
  }
};
  const addLogement = async (logement: Omit<Logement, 'id'>): Promise<Logement> => {
    setLoading(true);
    try {
      const newLogement = await api.post<Logement>('/logements', logement);
      setLogements(prev => [...prev, newLogement]);
      return newLogement;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add housing');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Equipement operations

  const getEquipementByMenageId = async (menageId: string): Promise<Equipement | undefined> => {
    setLoading(true);
  try {
    const existing = await equipements.find(l => l.menage_id === parseInt(menageId))
    if(existing) return existing;

    return await api.get<Equipement>(`/equipements/${menageId}/equipement`);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to fetch equipment');
    throw err;
  }
};
  const addEquipement = async (equipement: Omit<Equipement, 'id'>): Promise<Equipement> => {
    setLoading(true);
    try {
      const newEquipement = await api.post<Equipement>('/equipements', equipement);
      setEquipements(prev => [...prev, newEquipement]);
      return newEquipement;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add equipment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEquipement = async (equipement: Equipement): Promise<void> => {
  setLoading(true);
  try {
    await api.put(`/equipements/${equipement.id}`, equipement);
    setEquipements(prev => prev.map(e => e.id === equipement.id ? equipement : e));
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to update equipment');
    throw err;
  } finally {
    setLoading(false);
  }
};



  // Personne operations
  const addPersonne = async (personne: Omit<Personne, 'id'>): Promise<Personne> => {
    setLoading(true);
    try {
      
      const newPersonne = await api.post<Personne>('/personnes', personne);
      setPersonnes(prev => [...prev, newPersonne]);
      return newPersonne;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add person');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePersonne = async (personne: Personne): Promise<void> => {
    setLoading(true);
    try {
      await api.put(`/personnes/${personne.id}`, personne);
      setPersonnes(prev => prev.map(p => p.id === personne.id ? personne : p));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update person');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePersonne = async (id: number): Promise<void> => {
    setLoading(true);
    try {
      await api.delete(`/personnes/${id}`);
      setPersonnes(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete person');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Plainte operations

  const getPlainteByMenageId = async (menageId: string): Promise<Plainte | undefined> => {
  // Input validation
  if (!menageId || isNaN(parseInt(menageId))) {
    setError('Invalid household ID');
    return undefined;
  }

  setLoading(true);
  try {
    // First check local state
    const localComplaint = plaintes.find(p => p.menage_id === parseInt(menageId));
    if (localComplaint) return localComplaint;

    // Fetch from API if not found locally
    const response = await api.get<Plainte>(`/plaintes/${menageId}/plainte`);
    
    // Update local state if not present
    if (!plaintes.some(p => p.id === response.id)) {
      setPlaintes(prev => [...prev, response]);
    }

    return response;
  } catch (err) {
    const message = err instanceof Error ? 
      `Failed to fetch complaint: ${err.message}` : 
      'Failed to fetch complaint data';
    setError(message);
    console.error('Error fetching complaint:', err);
    return undefined;
  } finally {
    setLoading(false);
  }
};
  const addPlainte = async (plainte: Omit<Plainte, 'id'>): Promise<Plainte> => {
    setLoading(true);
    try {
      const newPlainte = await api.post<Plainte>('/plaintes', plainte);
      setPlaintes(prev => [...prev, newPlainte]);
      return newPlainte;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add complaint');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePlainte = async (plainte: Plainte): Promise<void> => {
    setLoading(true);
    try {
      await api.put(`/plaintes/${plainte.id}`, plainte);
      setPlaintes(prev => prev.map(p => p.id === plainte.id ? plainte : p));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update complaint');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePlainte = async (id: number): Promise<void> => {
    setLoading(true);
    try {
      await api.delete(`/plaintes/${id}`);
      setPlaintes(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete complaint');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const addEnqueteur = async (enqueteur: Omit<Enqueteur, 'id'>): Promise<Enqueteur> => {
    setLoading(true);
    try {
      const newEnqueteur = await api.post<Enqueteur>('/enqueteurs', enqueteur);
      setEnqueteurs(prev => [...prev, newEnqueteur]);
      return newEnqueteur;
    } finally {
      setLoading(false);
    }
  };
   const addEntreteint = async (entretien: Omit<Entretien, 'id'>): Promise<Entretien> => {
    setLoading(true);
    try {
      const newEntretien = await api.post<Entretien>('/entretiens', entretien);
      setEntretiens(prev => [...prev, newEntretien]);
      return newEntretien;

    } finally {
      setLoading(false);
    }
  };

    const updateUsers = async (user: Users): Promise<void> => {
    setLoading(true);
    try {
      await api.put(`/users/${user.id}`, user);
      setUsers(prev => prev.map(p => p.id === user.id ? user : p));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update complaint');
      throw err;
    } finally {
      setLoading(false);
    }
  };
 

  const deleteUsers = async (id: number): Promise<void> => {
    setLoading(true);
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete complaint');
      throw err;
    } finally {
      setLoading(false);
    }
  };


  // Helper methods
  const getHousehold = async (id: string ): Promise<Menage | undefined> => {
    try {
      return await api.get<Menage>(`/menages/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch household');
      throw err
    }
  };

  const getPerson = async (id: string): Promise<Personne | undefined> => {
    try {
      return await api.get<Personne>(`/personnes/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch person');
      throw err
    }
  };

  const getHouseholdMembers = async (id: string): Promise<{ menage: Menage; members: Personne[] }> => {
    try {
      
    //   Option 2: Si vous devez faire deux appels séparés
      const menage = await api.get<Menage>(`/menages/${id}`);
      const members = await api.get<Personne[]>(`/menages/${id}/members`);
      const menageWithMembers = { menage, members };
      return menageWithMembers;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch household with members');
      throw err
    } 
  };

  
const value = useMemo(() => ({
        menages,
        logements,
        equipements,
        personnes,
        plaintes,
        enqueteurs,
        entretiens,
        users,
        addMenage,
        addLogement,
        getLogementByMenageId,
        updateLogement,
        getEquipementByMenageId,
        updateEquipement,
        addEquipement,
        updateMenage,
        deleteMenage,
        addPersonne,
        updatePersonne,
        deletePersonne,
        getPlainteByMenageId,
        addPlainte,
        updatePlainte,
        deletePlainte,
        getHousehold,
        getHouseholdMembers,
        getPerson,
        addEnqueteur, 
        addEntreteint,
        updateEnqueteur,
        deleteEnqueteur,
        updateUsers,
        deleteUsers,
        loading,
        error,
        fetchInitialData
      }), [

    menages, logements, equipements, personnes, plaintes,
    enqueteurs, entretiens,users,
    loading, error, fetchInitialData,   addMenage,
        addLogement,
        getLogementByMenageId,
        updateLogement,
        getEquipementByMenageId,
        updateEquipement,
        addEquipement,
        updateMenage,
        deleteMenage,
        addPersonne,
        updatePersonne,
        deletePersonne,
        getPlainteByMenageId,
        addPlainte,
        updatePlainte,
        deletePlainte,
        getHousehold,
        getHouseholdMembers,
        getPerson,
        addEnqueteur, 
        addEntreteint,
        updateEnqueteur,
        deleteEnqueteur,
        updateUsers,
        deleteUsers,
  ]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchInitialData();
    }
  }, [authLoading, isAuthenticated]);

  
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};