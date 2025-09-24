import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  getDocs,
  where,
  serverTimestamp 
} from "firebase/firestore";
import { auth, db } from "@/firebase";
import { GoogleAuthProvider } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

// Authentication Service
export class AuthService {
  static async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: "OPERADOR", // Default role
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      }, { merge: true });
      
      return user;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  }

  static async signUpWithEmail(email, password, name) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      // Update user profile with name
      await updateProfile(user, {
        displayName: name
      });
      
      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        photoURL: null,
        role: "OPERADOR", // Default role
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
      
      return user;
    } catch (error) {
      console.error("Error signing up with email:", error);
      throw error;
    }
  }

  static async signInWithEmail(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      // Update last login in Firestore
      await setDoc(doc(db, "users", user.uid), {
        lastLogin: serverTimestamp()
      }, { merge: true });
      
      return user;
    } catch (error) {
      console.error("Error signing in with email:", error);
      throw error;
    }
  }

  static async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }

  static onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }

  static getCurrentUser() {
    return auth.currentUser;
  }
}

// Firestore Service
export class FirestoreService {
  // People Collection
  static async createPerson(personData) {
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
  }

  static async updatePerson(personId, personData) {
    try {
      await updateDoc(doc(db, "people", personId), {
        ...personData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating person:", error);
      throw error;
    }
  }

  static async deletePerson(personId) {
    try {
      await deleteDoc(doc(db, "people", personId));
    } catch (error) {
      console.error("Error deleting person:", error);
      throw error;
    }
  }

  static async getPeople() {
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
  }

  static async getPerson(personId) {
    try {
      const docRef = doc(db, "people", personId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error("Error getting person:", error);
      throw error;
    }
  }

  // Vehicle Exits Collection
  static async createVehicleExit(exitData) {
    try {
      const docRef = await addDoc(collection(db, "vehicleExits"), {
        ...exitData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating vehicle exit:", error);
      throw error;
    }
  }

  static async updateVehicleExit(exitId, exitData) {
    try {
      await updateDoc(doc(db, "vehicleExits", exitId), {
        ...exitData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating vehicle exit:", error);
      throw error;
    }
  }

  static async deleteVehicleExit(exitId) {
    try {
      await deleteDoc(doc(db, "vehicleExits", exitId));
    } catch (error) {
      console.error("Error deleting vehicle exit:", error);
      throw error;
    }
  }

  static async getVehicleExits() {
    try {
      const q = query(collection(db, "vehicleExits"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting vehicle exits:", error);
      throw error;
    }
  }

  static async getVehicleExit(exitId) {
    try {
      const docRef = doc(db, "vehicleExits", exitId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error("Error getting vehicle exit:", error);
      throw error;
    }
  }

  // Vehicles Collection
  static async createVehicle(vehicleData) {
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
  }

  static async updateVehicle(vehicleId, vehicleData) {
    try {
      await updateDoc(doc(db, "vehicles", vehicleId), {
        ...vehicleData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating vehicle:", error);
      throw error;
    }
  }

  static async deleteVehicle(vehicleId) {
    try {
      await deleteDoc(doc(db, "vehicles", vehicleId));
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      throw error;
    }
  }

  // Schedules Collection
  static async createSchedule(scheduleData) {
    try {
      const docRef = await addDoc(collection(db, "schedules"), {
        ...scheduleData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating schedule:", error);
      throw error;
    }
  }

  static async updateSchedule(scheduleId, scheduleData) {
    try {
      await updateDoc(doc(db, "schedules", scheduleId), {
        ...scheduleData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating schedule:", error);
      throw error;
    }
  }

  static async getSchedules() {
    try {
      const q = query(collection(db, "schedules"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting schedules:", error);
      throw error;
    }
  }

  // Documents Collection
  static async createDocument(documentData) {
    try {
      const docRef = await addDoc(collection(db, "documents"), {
        ...documentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating document:", error);
      throw error;
    }
  }

  static async updateDocument(documentId, documentData) {
    try {
      await updateDoc(doc(db, "documents", documentId), {
        ...documentData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating document:", error);
      throw error;
    }
  }

  static async getDocuments() {
    try {
      const q = query(collection(db, "documents"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting documents:", error);
      throw error;
    }
  }
}
