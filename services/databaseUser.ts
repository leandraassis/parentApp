import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "./auth";
import { UserInterface as User } from "../interfaces/User";

export async function inserirUser(newUser: User): Promise<string> {
    const docRef = await addDoc(collection(db, "users"), newUser);
    return docRef.id;
}

export async function listarUsers(): Promise<User[]> {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map((doc) => ({ ...doc.data(), uid: doc.id } as User));
}

export async function atualizarUser(user: User): Promise<void> {
    if (!user.uid) {
        throw new Error("User precisa ter um ID para ser atualizado");
    }
    await setDoc(doc(db, "users", user.uid), user);
}

export async function obterUser(uid: string) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
}

export async function deletarUser(uid: string): Promise<void> {
    await deleteDoc(doc(db, "users", uid));
}