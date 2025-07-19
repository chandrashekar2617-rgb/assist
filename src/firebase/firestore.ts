import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import app from "./config";
import { VehicleServiceRecord } from "../types";

const db = getFirestore(app);

// Call this function to add a record to the ASSIST collection
export async function addAssistRecord(data: VehicleServiceRecord) {
  try {
    const docRef = await addDoc(collection(db, "ASSIST"), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

// Get all ASSIST records
export async function getAssistRecords(): Promise<VehicleServiceRecord[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "ASSIST"));
    const records: VehicleServiceRecord[] = [];
    querySnapshot.forEach((doc) => {
      records.push({ id: doc.id, ...doc.data() } as VehicleServiceRecord);
    });
    return records;
  } catch (e) {
    console.error("Error getting documents: ", e);
    throw e;
  }
}

// Update an ASSIST record
export async function updateAssistRecord(id: string, data: Partial<VehicleServiceRecord>) {
  try {
    const docRef = doc(db, "ASSIST", id);
    await updateDoc(docRef, data);
    console.log("Document updated with ID: ", id);
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
}

// Delete an ASSIST record
export async function deleteAssistRecord(id: string) {
  try {
    await deleteDoc(doc(db, "ASSIST", id));
    console.log("Document deleted with ID: ", id);
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
}