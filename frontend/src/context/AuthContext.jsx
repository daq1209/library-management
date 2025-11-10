import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const AuthContext = createContext();
const googleProvider = new GoogleAuthProvider();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Đăng ký người dùng
  const registerUser = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  // Đăng nhập email & password
  const loginUser = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // Đăng nhập bằng Google
  const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

  // Đăng xuất
  const logout = () => signOut(auth);

  // Theo dõi trạng thái người dùng
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    registerUser,
    loginUser,
    signInWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
