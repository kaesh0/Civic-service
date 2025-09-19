import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  function saveUser(next) {
    setUser(next);
    localStorage.setItem("user", JSON.stringify(next));
  }

  const value = useMemo(() => ({
    user,
    login(email, password) {
      const db = JSON.parse(localStorage.getItem("users") || "[]");
      const found = db.find((u) => u.email === email && u.password === password);
      if (!found) throw new Error("Invalid credentials");
      saveUser(found);
    },
    signup(name, email, password) {
      const db = JSON.parse(localStorage.getItem("users") || "[]");
      if (db.some((u) => u.email === email)) throw new Error("Email already exists");
      const newUser = { id: crypto.randomUUID(), name, email, password, points: 0, badges: [] };
      const nextDb = [newUser, ...db];
      localStorage.setItem("users", JSON.stringify(nextDb));
      saveUser(newUser);
    },
    logout() {
      setUser(null);
      localStorage.removeItem("user");
    },
    updateUser(partial) {
      if (!user) return;
      const updated = { ...user, ...partial };
      saveUser(updated);
      const db = JSON.parse(localStorage.getItem("users") || "[]").map((u) =>
        u.id === updated.id ? updated : u
      );
      localStorage.setItem("users", JSON.stringify(db));
    }
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}