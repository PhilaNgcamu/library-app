import { db } from "./config";
import {
  ref,
  set,
  get,
  push,
  update,
  remove,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";

// Books
export const addBook = async (bookData) => {
  try {
    const newBookRef = push(ref(db, "books"));
    await set(newBookRef, {
      ...bookData,
      id: newBookRef.key,
      createdAt: new Date().toISOString(),
    });
    return newBookRef.key;
  } catch (error) {
    console.error("Error adding book:", error);
    throw error;
  }
};

export const getBooks = async () => {
  try {
    const booksRef = ref(db, "books");
    const snapshot = await get(booksRef);
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    }
    return [];
  } catch (error) {
    console.error("Error getting books:", error);
    throw error;
  }
};

// Users
export const createUserProfile = async (userId, userData) => {
  try {
    await set(ref(db, `users/${userId}`), {
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
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

// Holds
export const placeHold = async (bookId, userId) => {
  try {
    // Check if user already has a hold
    const holdsRef = ref(db, "holds");
    const userHoldsQuery = query(
      holdsRef,
      orderByChild("userId"),
      equalTo(userId)
    );

    const snapshot = await get(userHoldsQuery);
    if (snapshot.exists()) {
      const holds = Object.values(snapshot.val());
      const existingHold = holds.find(
        (hold) => hold.bookId === bookId && hold.status === "pending"
      );
      if (existingHold) {
        throw new Error("You already have a hold on this book");
      }
    }

    // Create new hold
    const newHoldRef = push(ref(db, "holds"));
    await set(newHoldRef, {
      id: newHoldRef.key,
      bookId,
      userId,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    return newHoldRef.key;
  } catch (error) {
    console.error("Error placing hold:", error);
    throw error;
  }
};

export const getHoldsForUser = async (userId) => {
  try {
    const holdsRef = ref(db, "holds");
    const userHoldsQuery = query(
      holdsRef,
      orderByChild("userId"),
      equalTo(userId)
    );

    const snapshot = await get(userHoldsQuery);
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    }
    return [];
  } catch (error) {
    console.error("Error getting holds:", error);
    throw error;
  }
};
