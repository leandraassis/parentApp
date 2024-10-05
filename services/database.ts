import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "./auth";
import { Fralda } from "../interfaces/Fralda";

export async function inserirFralda(newFralda: Fralda): Promise<string> {
    const docRef = await addDoc(collection(db, "fraldas"), newFralda);
    return docRef.id;
}

export async function listarFraldas(): Promise<Fralda[]> {
    const querySnapshot = await getDocs(collection(db, "fraldas"));
    return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Fralda));
}

export async function atualizarFralda(fralda: Fralda): Promise<void> {
    if (!fralda.id) {
        throw new Error("Fralda precisa ter um ID para ser atualizado");
    }
    await setDoc(doc(db, "fraldas", fralda.id), fralda);
}

export async function deletarFralda(id: string): Promise<void> {
    await deleteDoc(doc(db, "fraldas", id));
}
