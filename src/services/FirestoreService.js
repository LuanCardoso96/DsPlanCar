import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp, Timestamp
} from "firebase/firestore";
import { db } from "@/firebase";

// Utils
export const nowTs = () => serverTimestamp();
export const toTs = (date) => (date instanceof Timestamp ? date : Timestamp.fromDate(new Date(date)));

// ---------- USERS ----------
export const createUser = async (userData) => {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      ...userData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// ---------- PEOPLE (já existente) ----------
export const getPeople = async () => {
  try {
    const q = query(collection(db, "people"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting people:", error);
    throw error;
  }
};

export const createPerson = async (personData) => {
  try {
    const docRef = await addDoc(collection(db, "people"), {
      ...personData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating person:", error);
    throw error;
  }
};

export const updatePerson = async (personId, personData) => {
  try {
    await updateDoc(doc(db, "people", personId), {
      ...personData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating person:", error);
    throw error;
  }
};

export const deletePerson = async (personId) => {
  try {
    await deleteDoc(doc(db, "people", personId));
  } catch (error) {
    console.error("Error deleting person:", error);
    throw error;
  }
};

// ---------- VEHICLES (já existente) ----------
export const getVehicles = async () => {
  try {
    const q = query(collection(db, "vehicles"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting vehicles:", error);
    throw error;
  }
};

export const createVehicle = async (vehicleData) => {
  try {
    const docRef = await addDoc(collection(db, "vehicles"), {
      ...vehicleData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating vehicle:", error);
    throw error;
  }
};

export const updateVehicle = async (vehicleId, vehicleData) => {
  try {
    await updateDoc(doc(db, "vehicles", vehicleId), {
      ...vehicleData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    throw error;
  }
};

export const deleteVehicle = async (vehicleId) => {
  try {
    await deleteDoc(doc(db, "vehicles", vehicleId));
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    throw error;
  }
};

// ---------- SAÍDAS ----------
export const listSaidas = async (opts = {}) => {
  try {
    const { status, vehicleId, driverId, from, to, max = 50 } = opts;
    const col = collection(db, "saidas");
    const wh = [];
    if (status) wh.push(where("status", "==", status));
    if (vehicleId) wh.push(where("vehicleId", "==", vehicleId));
    if (driverId) wh.push(where("driverId", "==", driverId));
    
    // Query simplificada sem orderBy para evitar erro de índice
    let q = query(col, ...wh, limit(max));
    const snap = await getDocs(q);
    const results = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    // Ordenação manual no frontend
    return results.sort((a, b) => {
      const aTime = a.startedAt?.seconds || 0;
      const bTime = b.startedAt?.seconds || 0;
      return bTime - aTime; // DESC
    });
  } catch (error) {
    if (error.message.includes("The query requires an index")) {
      console.warn("Query requires Firestore index. Deploy indexes with: npm run deploy:indexes");
    }
    console.error("Error listing saidas:", error);
    throw error;
  }
};

export const createSaida = async (data) => {
  try {
    const payload = {
      ...data,
      startedAt: toTs(data.startedAt),
      endedAt: data.endedAt ? toTs(data.endedAt) : null,
      status: data.status || "em_andamento",
      createdAt: nowTs(),
      updatedAt: nowTs(),
    };
    const ref = await addDoc(collection(db, "saidas"), payload);
    return ref.id;
  } catch (error) {
    console.error("Error creating saida:", error);
    throw error;
  }
};

export const updateSaida = async (id, data) => {
  try {
    const ref = doc(db, "saidas", id);
    await updateDoc(ref, { ...data, updatedAt: nowTs() });
  } catch (error) {
    console.error("Error updating saida:", error);
    throw error;
  }
};

export const closeSaida = async (id, { odometerEnd, endedAt, notes }) => {
  try {
    const ref = doc(db, "saidas", id);
    await updateDoc(ref, {
      odometerEnd: odometerEnd ?? null,
      endedAt: toTs(endedAt || new Date()),
      status: "concluida",
      notes: notes ?? null,
      updatedAt: nowTs(),
    });
  } catch (error) {
    console.error("Error closing saida:", error);
    throw error;
  }
};

export const cancelSaida = async (id, notes) => {
  try {
    const ref = doc(db, "saidas", id);
    await updateDoc(ref, { status: "cancelada", notes: notes ?? null, updatedAt: nowTs() });
  } catch (error) {
    console.error("Error canceling saida:", error);
    throw error;
  }
};

export const deleteSaida = async (id) => {
  try {
    await deleteDoc(doc(db, "saidas", id));
  } catch (error) {
    console.error("Error deleting saida:", error);
    throw error;
  }
};

// ---------- AGENDAMENTOS ----------
export const listAgendamentos = async (opts = {}) => {
  try {
    const { status, vehicleId, from, to, max = 50 } = opts;
    const col = collection(db, "agendamentos");
    const wh = [];
    if (status) wh.push(where("status", "==", status));
    if (vehicleId) wh.push(where("vehicleId", "==", vehicleId));
    
    // Query simplificada sem orderBy para evitar erro de índice
    let q = query(col, ...wh, limit(max));
    const snap = await getDocs(q);
    const results = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    // Ordenação manual no frontend
    return results.sort((a, b) => {
      const aTime = a.startAt?.seconds || 0;
      const bTime = b.startAt?.seconds || 0;
      return aTime - bTime; // ASC
    });
  } catch (error) {
    if (error.message.includes("The query requires an index")) {
      console.warn("Query requires Firestore index. Deploy indexes with: npm run deploy:indexes");
    }
    console.error("Error listing agendamentos:", error);
    throw error;
  }
};

export const createAgendamento = async (data) => {
  try {
    const payload = {
      ...data,
      startAt: toTs(data.startAt),
      endAt: toTs(data.endAt),
      status: data.status || "pendente",
      createdAt: nowTs(),
      updatedAt: nowTs(),
    };
    const ref = await addDoc(collection(db, "agendamentos"), payload);
    return ref.id;
  } catch (error) {
    console.error("Error creating agendamento:", error);
    throw error;
  }
};

export const updateAgendamento = async (id, data) => {
  try {
    await updateDoc(doc(db, "agendamentos", id), { ...data, updatedAt: nowTs() });
  } catch (error) {
    console.error("Error updating agendamento:", error);
    throw error;
  }
};

export const aprovarAgendamento = async (id) => {
  try {
    await updateDoc(doc(db, "agendamentos", id), { status: "aprovado", updatedAt: nowTs() });
  } catch (error) {
    console.error("Error approving agendamento:", error);
    throw error;
  }
};

export const rejeitarAgendamento = async (id) => {
  try {
    await updateDoc(doc(db, "agendamentos", id), { status: "rejeitado", updatedAt: nowTs() });
  } catch (error) {
    console.error("Error rejecting agendamento:", error);
    throw error;
  }
};

export const cancelarAgendamento = async (id) => {
  try {
    await updateDoc(doc(db, "agendamentos", id), { status: "cancelado", updatedAt: nowTs() });
  } catch (error) {
    console.error("Error canceling agendamento:", error);
    throw error;
  }
};

export const deleteAgendamento = async (id) => {
  try {
    await deleteDoc(doc(db, "agendamentos", id));
  } catch (error) {
    console.error("Error deleting agendamento:", error);
    throw error;
  }
};

// ---------- DOCUMENTOS ----------
export const listDocumentos = async (opts = {}) => {
  try {
    const { vehicleId, personId, type, max = 50 } = opts;
    const col = collection(db, "documentos");
    const wh = [];
    if (vehicleId) wh.push(where("vehicleId", "==", vehicleId));
    if (personId) wh.push(where("personId", "==", personId));
    if (type) wh.push(where("type", "==", type));
    const q = query(col, ...wh, orderBy("uploadedAt", "desc"), limit(max));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error listing documentos:", error);
    throw error;
  }
};

export const createDocumento = async (data) => {
  try {
    // data deve vir com { title, type, vehicleId?, personId?, filePath, fileUrl, expiresAt? }
    const payload = {
      ...data,
      expiresAt: data.expiresAt ? toTs(data.expiresAt) : null,
      uploadedAt: nowTs(),
    };
    const ref = await addDoc(collection(db, "documentos"), payload);
    return ref.id;
  } catch (error) {
    console.error("Error creating documento:", error);
    throw error;
  }
};

export const updateDocumento = async (id, data) => {
  try {
    await updateDoc(doc(db, "documentos", id), { ...data, updatedAt: nowTs() });
  } catch (error) {
    console.error("Error updating documento:", error);
    throw error;
  }
};

export const deleteDocumento = async (id) => {
  try {
    await deleteDoc(doc(db, "documentos", id));
  } catch (error) {
    console.error("Error deleting documento:", error);
    throw error;
  }
};

// ---------- RELATÓRIOS (para Dashboard e página Relatórios) ----------
export const getRelatoriosResumo = async () => {
  try {
    // Buscar todos os dados sem filtros complexos
    const [vehicles, allSaidas, allAgendamentos] = await Promise.all([
      getVehicles(),
      listSaidas({ max: 100 }), // Sem filtro de status
      listAgendamentos({ max: 100 }), // Sem filtro de status
    ]);

    // Filtrar no frontend
    const saidasEmAndamento = allSaidas.filter(s => s.status === "em_andamento");
    const agPendentes = allAgendamentos.filter(a => a.status === "pendente");
    const proximosAgendamentos = allAgendamentos.filter(a => a.status === "aprovado").slice(0, 5);
    const ultimasSaidas = allSaidas.slice(0, 5);

    return {
      totalVeiculos: vehicles.length,
      saidasEmAndamento: saidasEmAndamento.length,
      agPendentes: agPendentes.length,
      proximosAgendamentos,
      ultimasSaidas,
    };
  } catch (error) {
    if (error.message.includes("The query requires an index")) {
      console.warn("Query requires Firestore index. Deploy indexes with: npm run deploy:indexes");
    }
    console.error("Error getting relatorios resumo:", error);
    throw error;
  }
};
