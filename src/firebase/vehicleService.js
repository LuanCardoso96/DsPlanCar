import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";

// Buscar todos os veículos
export const getVehicles = async () => {
  try {
    const q = query(collection(db, "vehicles"), orderBy("createdAt", "desc"));
    const vehiclesSnapshot = await getDocs(q);
    return vehiclesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting vehicles:", error);
    throw error;
  }
};

// Adicionar veículo
export const addVehicle = async (vehicleData) => {
  try {
    const vehiclesCol = collection(db, "vehicles");
    const docRef = await addDoc(vehiclesCol, {
      ...vehicleData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding vehicle:", error);
    throw error;
  }
};

// Editar veículo
export const updateVehicle = async (id, updatedData) => {
  try {
    const vehicleDoc = doc(db, "vehicles", id);
    await updateDoc(vehicleDoc, {
      ...updatedData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    throw error;
  }
};

// Deletar veículo
export const deleteVehicle = async (id) => {
  try {
    const vehicleDoc = doc(db, "vehicles", id);
    await deleteDoc(vehicleDoc);
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    throw error;
  }
};
