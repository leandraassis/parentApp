import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCtgEPxfKY4K561Tugte5jDJJqbkYPyr6A",
  authDomain: "at-native.firebaseapp.com",
  projectId: "at-native",
  storageBucket: "at-native.appspot.com",
  messagingSenderId: "271952493111",
  appId: "1:271952493111:web:e42792063279177d6fddb2"
};

  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export default app;
  export const db = getFirestore(app);
  


