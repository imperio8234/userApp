import { useUserManagement } from '@/context/userContext';
import { showNotification } from '@/hooks/useNotify';
import { userServiceAuth } from '@/services/authService/userServiceAuth';
import { useLogin } from '@/util/loginmethod';
import { LogIn, Eye, EyeOff, Mail, Lock, UserCheck, User } from 'lucide-react';

import { useState } from "react";

export const Login = ({
    onSwitchToRegister,
    handleAuthSuccess
}: {
    onSwitchToRegister: () => void,
    handleAuthSuccess: () => void;
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [usuarioRegistrado, setUsuarioRegistrado] = useState(false)

    const { LoginMethod, loading, error } = useLogin();
    const { usuarios } = useUserManagement();

    // Login con usuario predeterminado del servicio
    const handleServiceLogin = async() => {
        try {
            const res = await userServiceAuth.login({email: "eve.holt@reqres.in", password: "cityslicka"})
            console.log("respuesta login", res)
            handleAuthSuccess()
            showNotification("success", "Sesión iniciada con usuario predeterminado")
        } catch (error) {
            console.log("error", error)
            showNotification("error", "Error al iniciar sesión con usuario predeterminado")
        }
    };

    // Login con credenciales del formulario
    const handleFormLogin = async() => {
        if (!formData.email || !formData.password) {
            showNotification("error", "Por favor completa todos los campos")
            return
        }

        console.log('Login attempt:', formData);
        try {
            LoginMethod(formData.email, formData.password)
            handleAuthSuccess()
            if (error) {
                showNotification("error", error)
            } else {
                showNotification("success", "Sesión iniciada")
            }
        } catch (err) {
            showNotification("error", "Error al iniciar sesión")
        }
        console.log("usuarios", usuarios)
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <div className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Bienvenido</h1>
                    <p className="text-gray-400">Inicia sesión en tu cuenta</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Correo electrónico
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="tu@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Contraseña
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-12 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-700 rounded focus:ring-blue-500" />
                            <span className="ml-2 text-sm text-gray-300">Recordarme</span>
                        </label>
                        <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>

                    {/* Botón para login con usuario predeterminado */}
                    <button
                        onClick={handleServiceLogin}
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
                    >
                        <UserCheck className="w-5 h-5" />
                        <span>{loading ? 'Iniciando...' : 'Iniciar con Usuario Registrado'}</span>
                    </button>

                    {/* Botón para login con formulario */}
                    <button
                        onClick={handleFormLogin}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
                    >
                        <User className="w-5 h-5" />
                        <span>{loading ? 'Iniciando...' : 'Iniciar con Mis Credenciales'}</span>
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-gray-400">
                        ¿No tienes una cuenta?{' '}
                        <button
                            onClick={onSwitchToRegister}
                            className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                            Regístrate aquí
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};