import { useUserManagement } from '@/context/userContext';
import { showNotification } from '@/hooks/useNotify';
import { userServiceAuth } from '@/services/authService/userServiceAuth';
import { getPublicUrl, uploadFile } from '@/services/supabase/UploadFile';
import { Eye, EyeOff, Mail, Lock, UserPlus, User, Upload, X } from 'lucide-react';
import { useState, useRef } from 'react';

// Interfaces actualizadas según el tipado
interface Usuario {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
}

interface CreateUsuarioDto {
    name: string;
    job: string;
}

interface RegisterDto {
    email: string;
    password?: string;
}

// Tipo específico para el formulario
interface RegisterFormData {
    id: number
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirmPassword: string;
    avatar: any;
}

export const Register = ({ onSwitchToLogin }: { onSwitchToLogin: () => void }) => {

    const { setUsuarios, usuarios } = useUserManagement();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<RegisterFormData>({
        id: 0,
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        avatar: null,
    });

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validar que sea una imagen
            if (!file.type.startsWith('image/')) {
                alert('Por favor selecciona un archivo de imagen válido');
                return;
            }

            // Validar tamaño (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('El archivo no puede ser mayor a 5MB');
                return;
            }

            setFormData({ ...formData, avatar: file });

            // Crear preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeAvatar = () => {
        setFormData({ ...formData, avatar: null });
        setAvatarPreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const registerUser = async () => {
        //const { first_name, last_name, email, password, avatar } = formData;
        // const name = `${first_name} ${last_name}`;

        try {

            //guardar en el context
            // guardar imagen
            let publicUrl = ""
                    if (formData.avatar) {
                        const path = `usuarios/${formData.avatar?.name ?? ""}`;
                        const result = await uploadFile(path, formData.avatar);
                        publicUrl = getPublicUrl(result.path);
                    }


            const { confirmPassword, ...newUser } = formData;

            newUser.avatar = publicUrl;
            newUser.id = Date.now();
            setUsuarios((prev) => [...prev, newUser]);


            // Aquí podrías hacer una segunda llamada para subir el avatar si tu API lo requiere
            showNotification("success", "usuario registrado")
            onSwitchToLogin()
        } catch (error) {
            console.log('error', error);
        }
    };

    const handleSubmit = () => {
        // Validaciones
        if (!formData.first_name.trim()) {
            showNotification("info", 'El nombre es requerido');
            return;
        }

        if (!formData.last_name.trim()) {
            showNotification("info", 'El apellido es requerido');
            return;
        }

        if (!formData.email.trim()) {
            showNotification("info", 'El email es requerido');
            return;
        }

        if (!formData.password) {
            showNotification("info", 'La contraseña es requerida');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            showNotification("info", 'Las contraseñas no coinciden');
            return;
        }

        if (formData.password.length < 6) {
            showNotification("info", 'La contraseña debe tener al menos 6 caracteres');
            return;
        }

        registerUser();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <div className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h1>
                    <p className="text-gray-400">Únete a nuestra comunidad</p>
                </div>

                <div className="space-y-6">
                    {/* Campo Avatar */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Foto de perfil</label>
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-8 h-8 text-gray-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                    id="avatar-upload"
                                />
                                <label
                                    htmlFor="avatar-upload"
                                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Subir foto
                                </label>
                                {formData.avatar && (
                                    <button
                                        onClick={removeAvatar}
                                        className="ml-2 p-2 text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Máximo 5MB. Formatos: JPG, PNG, GIF</p>
                    </div>

                    <div className='grid grid-cols-2 gap-2'>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Nombre</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
                                    placeholder="Nombre"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Apellido</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
                                    placeholder="Apellido"
                                    required
                                />
                            </div>
                        </div>


                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Correo electrónico</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
                                placeholder="tu@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-12 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Confirmar contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full pl-12 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            className="w-4 h-4 text-green-600 bg-gray-800 border-gray-700 rounded focus:ring-green-500 focus:ring-2"
                            required
                        />
                        <span className="ml-2 text-sm text-gray-300">
                            Acepto los{' '}
                            <a href="#" className="text-green-400 hover:text-green-300 transition-colors">
                                términos y condiciones
                            </a>
                        </span>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                        <UserPlus className="w-5 h-5" />
                        <span>Crear Cuenta</span>
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-gray-400">
                        ¿Ya tienes una cuenta?{' '}
                        <button
                            onClick={onSwitchToLogin}
                            className="text-green-400 hover:text-green-300 font-medium transition-colors"
                        >
                            Inicia sesión
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};