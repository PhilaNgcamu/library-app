import { db } from "./config";
import { collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

export const createUserProfile = async (userId, userData) => {
  try {
    await setDoc(doc(db, "users", userId), {
      ...userData,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};
