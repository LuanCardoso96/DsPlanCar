import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/firebase";

export const uploadPdf = async (file, { folder = "documents", prefix = "" } = {}) => {
  if (!file || file.type !== "application/pdf") {
    throw new Error("Envie um arquivo PDF válido.");
  }
  const filename = `${prefix}${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
  const path = `${folder}/${filename}`;
  const storageRef = ref(storage, path);
  const snap = await uploadBytes(storageRef, file, { contentType: file.type });
  const url = await getDownloadURL(snap.ref);
  return { path, url };
};

export const deleteFile = async (path) => {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
};
