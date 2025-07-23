import { useEffect, useState } from "react";
import { Login } from "./modules/auth/login";
import { Register } from "./modules/auth/register";
import { userServiceAuth, type Usuario } from "./services/authService/userServiceAuth";
import { useUserManagement } from "./context/userContext";
import { Toaster } from "sonner";
import { Home } from "./modules/home/home";

function App() {
  const [currentView, setCurrentView] = useState('login'); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {login, setUsuarios} = useUserManagement();

  
const getUsersApi = async () => {
  try {
    const res = await userServiceAuth.getAll(1);
    const localUsuariosRaw = localStorage.getItem("usuariosapp");
    let localUsuarios: Usuario[] = [];

    if (localUsuariosRaw) {
      localUsuarios = JSON.parse(localUsuariosRaw);
    }

    
    const combinados = [...res];
    localUsuarios.forEach((localUser) => {
      if (!res.some((apiUser) => apiUser.id === localUser.id)) {
        combinados.push(localUser);
      }
    });

    setUsuarios(combinados);
    console.log("Usuarios combinados:", combinados);
  } catch (error) {
    console.log("error", error);
  }
};

    useEffect(() => {
   const usuarioLogeado =  localStorage.getItem("appuser");
   if (!usuarioLogeado) {
      setIsAuthenticated(false);
    setCurrentView('login');
    return;
   }
   const user = JSON.parse(usuarioLogeado)
   login(user)
   setIsAuthenticated(true);
    setCurrentView('app');

  },[])

  // Simular autenticación exitosa
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setCurrentView('app');
  };

  useEffect(() => {
   getUsersApi();
  }, [])

  if (isAuthenticated && currentView === 'app') {
    return (
      <div className="w-screen h-screen bg-black text-white flex items-center justify-center">
        <Home />
        <Toaster richColors position="bottom-right" />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-black text-white">
      {currentView === 'login' && (
        <Login onSwitchToRegister={() => setCurrentView('register')} handleAuthSuccess={handleAuthSuccess} />
      )}
      {currentView === 'register' && (
        <Register onSwitchToLogin={() => setCurrentView('login')} />
      )}
       <Toaster richColors position="bottom-right" />
    </div>
  );
}

export default App;
