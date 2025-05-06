import { PGlite } from "@electric-sql/pglite";
import { Patient, QueryHistory } from "../types";

// Create a singleton instance of PGlite
let pglite: any = null;

export async function initPglite() {
  if (!pglite) {
    pglite = new PGlite("idb://my-pgdata"); // Use persistent IndexedDB
    await pglite.ready; // Ensure DB is ready before use
    await createSchema();
    console.log("PGlite initialized successfully");
  }
  return pglite;
}

async function createSchema() {
  try {
    // Create patients table
    await pglite.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        date_of_birth TEXT NOT NULL,
        gender TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        medical_history TEXT,
        allergies TEXT,
        emergency_contact TEXT,
        insurance_provider TEXT,
        insurance_number TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create query_history table
    await pglite.query(`
      CREATE TABLE IF NOT EXISTS query_history (
        id SERIAL PRIMARY KEY,
        query TEXT NOT NULL,
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Database schema created successfully");
  } catch (error) {
    console.error("Error creating schema:", error);
    throw error;
  }
}

export async function addPatient(
  patient: Omit<Patient, "id" | "createdAt" | "updatedAt">
): Promise<Patient> {
  try {
    const currentDate = new Date().toISOString();
    const { rows } = await pglite.query(
      `INSERT INTO patients (
        first_name, last_name, date_of_birth, gender, email, phone, address, 
        medical_history, allergies, emergency_contact, insurance_provider, insurance_number,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        patient.firstName,
        patient.lastName,
        patient.dateOfBirth,
        patient.gender,
        patient.email,
        patient.phone,
        patient.address,
        patient.medicalHistory || "",
        patient.allergies || "",
        patient.emergencyContact || "",
        patient.insuranceProvider || "",
        patient.insuranceNumber || "",
        currentDate,
        currentDate,
      ]
    );

    // Send event to notify other tabs
    broadcastDatabaseChange("patient_added");

    // Convert from snake_case to camelCase
    return mapPatientFromDb(rows[0]);
  } catch (error) {
    console.error("Error adding patient:", error);
    throw error;
  }
}

export async function getPatients(): Promise<Patient[]> {
  try {
    const { rows } = await pglite.query(
      "SELECT * FROM patients ORDER BY created_at DESC"
    );
    return rows.map(mapPatientFromDb);
  } catch (error) {
    console.error("Error getting patients:", error);
    throw error;
  }
}

export async function getPatientById(id: number): Promise<Patient | null> {
  try {
    const { rows } = await pglite.query(
      "SELECT * FROM patients WHERE id = $1",
      [id]
    );
    if (rows.length === 0) {
      return null;
    }
    return mapPatientFromDb(rows[0]);
  } catch (error) {
    console.error(`Error getting patient with id ${id}:`, error);
    throw error;
  }
}

export async function executeCustomQuery(query: string): Promise<any> {
  try {
    // Add to query history
    await pglite.query("INSERT INTO query_history (query) VALUES ($1)", [
      query,
    ]);

    // Execute the query
    const result = await pglite.query(query);

    // Send event to notify other tabs
    broadcastDatabaseChange("query_executed");

    return result;
  } catch (error) {
    console.error("Error executing custom query:", error);
    throw error;
  }
}

export async function getQueryHistory(): Promise<QueryHistory[]> {
  try {
    const { rows } = await pglite.query(
      "SELECT * FROM query_history ORDER BY timestamp DESC LIMIT 10"
    );
    return rows.map((row: any) => ({
      id: row.id,
      query: row.query,
      timestamp: row.timestamp,
    }));
  } catch (error) {
    console.error("Error getting query history:", error);
    throw error;
  }
}

// Helper function to convert snake_case column names to camelCase
function mapPatientFromDb(dbPatient: any): Patient {
  return {
    id: dbPatient.id,
    firstName: dbPatient.first_name,
    lastName: dbPatient.last_name,
    dateOfBirth: dbPatient.date_of_birth,
    gender: dbPatient.gender,
    email: dbPatient.email,
    phone: dbPatient.phone,
    address: dbPatient.address,
    medicalHistory: dbPatient.medical_history,
    allergies: dbPatient.allergies,
    emergencyContact: dbPatient.emergency_contact,
    insuranceProvider: dbPatient.insurance_provider,
    insuranceNumber: dbPatient.insurance_number,
    createdAt: dbPatient.created_at,
    updatedAt: dbPatient.updated_at,
  };
}

// Broadcast channel for cross-tab communication
let channel: BroadcastChannel | null = null;

export function setupBroadcastChannel(): BroadcastChannel {
  if (!channel) {
    channel = new BroadcastChannel("pglite-changes");
  }
  return channel;
}

export function broadcastDatabaseChange(type: string): void {
  const bc = setupBroadcastChannel();
  bc.postMessage({ type, timestamp: new Date().toISOString() });
}

export function closeBroadcastChannel(): void {
  if (channel) {
    channel.close();
    channel = null;
  }
}
