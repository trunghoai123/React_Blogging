import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase-app/firebase-config";

const { useContext, createContext, useState, useEffect } = require("react");

const AuthContext = createContext();

const AuthProvider = (props) => {
  const [user, setUser] = useState();
  const value = { user, setUser };
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getDoc(doc(db, "users", user.uid)).then((snapshot) => {
          setUser({
            ...user,
            ...snapshot.data(),
          });
        });
        // setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);
  return <AuthContext.Provider value={value} {...props}></AuthContext.Provider>;
};

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (typeof context === "undefined") {
    throw new Error("useAuthContext must be used in AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuthContext };
