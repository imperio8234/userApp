import type { Usuario } from "@/services/authService/userServiceAuth";
import { createContext, useContext, useEffect, useState } from "react";


interface UserContextType {
  // Sesión actual
  user: any | null;
  login: (user: any) => void;
  logout: () => void;

  // Lista total de usuarios (API + manuales)
  usuarios: Usuario[];
  setUsuarios: React.Dispatch<React.SetStateAction<Usuario[]>>;

  // Resultados filtrados
  usuariosFiltrados: Usuario[];
  setUsuariosFiltrados: React.Dispatch<React.SetStateAction<Usuario[]>>;

  // Usuario en edición
  usuarioEnEdicion: Usuario | null;
  setUsuarioEnEdicion: React.Dispatch<React.SetStateAction<Usuario | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);
  const [usuarioEnEdicion, setUsuarioEnEdicion] = useState<Usuario | null>(null);

  const login = (user: any) => setUser(user);
  const logout = () => {
    setUser(null);
    localStorage.removeItem("appuser")
  };


// Cargar desde localStorage al iniciar
useEffect(() => {
  const usuarioLocal = localStorage.getItem("usuariosapp");
  if (usuarioLocal) {
    try {
      const parsed = JSON.parse(usuarioLocal);
      if (Array.isArray(parsed)) {
        setUsuarios(parsed);
        console.log("Usuarios cargados desde localStorage:", parsed);
      }
    } catch (err) {
      console.error("Error al parsear usuarios del localStorage", err);
    }
  }
}, []);

// Guardar cambios en localStorage
useEffect(() => {
  if (usuarios.length > 0) {
    localStorage.setItem("usuariosapp", JSON.stringify(usuarios));
    console.log("Usuarios guardados:", usuarios);
  }
}, [usuarios]);

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        usuarios,
        setUsuarios,
        usuariosFiltrados,
        setUsuariosFiltrados,
        usuarioEnEdicion,
        setUsuarioEnEdicion,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserManagement = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUserManagement must be used within a UserProvider");
  return context;
};
