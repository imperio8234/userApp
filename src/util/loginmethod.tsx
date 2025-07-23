import { useState } from 'react';
import { useUserManagement } from '@/context/userContext';
import type { Usuario } from '@/services/authService/userServiceAuth';

export const useLogin = () => {
  const { usuarios, login } = useUserManagement(); // asegúrate de tener este método
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const LoginMethod = async (email: string, pass: string) => {
    setLoading(true);
    setError(null);

    try {
      const user = usuarios.find(
        (u: Usuario) => u.email === email && u.password === pass
      );

      if (!user) {
        throw new Error('Usuario o contraseña incorrectos');
      }
      login(user); 
      localStorage.setItem("appuser", JSON.stringify(user))
      return user;
    } catch (err: any) {
      setError(err.message || 'Error durante el login');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { LoginMethod, loading, error };
};
