import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import {
  initPglite,
  getPatients,
  addPatient,
  getPatientById,
  executeCustomQuery,
  getQueryHistory,
  setupBroadcastChannel,
  closeBroadcastChannel,
} from "../services/database";
import { Patient, PatientFormData, QueryHistory } from "../types";

interface DatabaseContextType {
  initialized: boolean;
  patients: Patient[];
  queryHistory: QueryHistory[];
  loading: boolean;
  error: string | null;
  initializeDatabase: () => Promise<void>;
  refreshPatients: () => Promise<void>;
  registerPatient: (patient: PatientFormData) => Promise<Patient>;
  getPatient: (id: number) => Promise<Patient | null>;
  executeQuery: (query: string) => Promise<any>;
  getHistory: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined
);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [queryHistory, setQueryHistory] = useState<QueryHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeDatabase = useCallback(async () => {
    try {
      setLoading(true);
      await initPglite();
      await refreshPatients();
      await getHistory();
      setInitialized(true);
    } catch (err) {
      setError("Failed to initialize database");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshPatients = useCallback(async () => {
    try {
      setLoading(true);
      const allPatients = await getPatients();
      setPatients(allPatients);
    } catch (err) {
      setError("Failed to fetch patients");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const registerPatient = useCallback(async (patientData: PatientFormData) => {
    try {
      setLoading(true);
      const newPatient = await addPatient(patientData);
      setPatients((prev) => [newPatient, ...prev]);
      return newPatient;
    } catch (err) {
      setError("Failed to register patient");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPatient = useCallback(async (id: number) => {
    try {
      setLoading(true);
      return await getPatientById(id);
    } catch (err) {
      setError(`Failed to get patient with ID ${id}`);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const executeQuery = useCallback(async (query: string) => {
    try {
      setLoading(true);
      const result = await executeCustomQuery(query);
      await getHistory();
      return result;
    } catch (err) {
      setError("Failed to execute query");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getHistory = useCallback(async () => {
    try {
      const history = await getQueryHistory();
      setQueryHistory(history);
    } catch (err) {
      console.error("Failed to fetch query history:", err);
    }
  }, []);

  // Set up broadcast channel for cross-tab communication
  useEffect(() => {
    if (initialized) {
      const channel = setupBroadcastChannel();

      const handleMessage = async (event: MessageEvent) => {
        if (event.data && event.data.type) {
          // Refresh data based on the event type
          if (event.data.type === "patient_added") {
            await refreshPatients();
          } else if (event.data.type === "query_executed") {
            await getHistory();
          }
        }
      };

      channel.addEventListener("message", handleMessage);

      return () => {
        channel.removeEventListener("message", handleMessage);
        closeBroadcastChannel();
      };
    }
  }, [initialized, refreshPatients, getHistory]);

  const value = {
    initialized,
    patients,
    queryHistory,
    loading,
    error,
    initializeDatabase,
    refreshPatients,
    registerPatient,
    getPatient,
    executeQuery,
    getHistory,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
}
