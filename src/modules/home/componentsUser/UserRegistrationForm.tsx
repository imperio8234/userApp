import { useState, useRef } from 'react';
import { User, Mail, Lock, Upload, X, Check, Eye, EyeOff, Camera, AlertCircle } from 'lucide-react';
import type { Usuario } from '@/services/authService/userServiceAuth';
import { getPublicUrl, uploadFile } from '@/services/supabase/UploadFile';

export const UserRegistrationForm = ({ isOpen, onClose, onSubmit }: { isOpen: boolean, onClose: () => void, onSubmit: (value: Usuario) => void }) => {
    const [formData, setFormData] = useState<Usuario>({
        id: 0,
        first_name: '',
        last_name: '',
        email: '',
        status: 'active',
        avatar: "",
        password: "",
        confirmPassword: ""
    });

    const [avatar, setAvatar] = useState<any>(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<any>(null);

    // Manejar cambios en los inputs
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpiar error específico cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors((prev: any) => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Manejar selección de avatar
    const handleAvatarChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                setErrors((prev: any) => ({
                    ...prev,
                    avatar: 'Por favor selecciona un archivo de imagen válido'
                }));
                return;
            }

            // Validar tamaño (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors((prev: any) => ({
                    ...prev,
                    avatar: 'La imagen debe ser menor a 5MB'
                }));
                return;
            }

            setAvatar(file);

            // Crear preview
            const reader = new FileReader();
            reader.onload = (e: any) => {
                setAvatarPreview(e.target.result);
            };
            reader.readAsDataURL(file);

            // Limpiar error de avatar
            if (errors.avatar) {
                setErrors((prev: any) => ({
                    ...prev,
                    avatar: ''
                }));
            }
        }
    };

    // Remover avatar
    const removeAvatar = () => {
        setAvatar(null);
        setAvatarPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Validar formulario
    const validateForm = () => {
        const newErrors: any = {

        };

        // Validar nombre
        if (!formData.first_name.trim()) {
            newErrors.first_name = 'El nombre es requerido';
        } else if (formData.first_name.trim().length < 2) {
            newErrors.first_name = 'El nombre debe tener al menos 2 caracteres';
        }

        // Validar apellido
        if (!formData.last_name.trim()) {
            newErrors.last_name = 'El apellido es requerido';
        } else if (formData.last_name.trim().length < 2) {
            newErrors.last_name = 'El apellido debe tener al menos 2 caracteres';
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Por favor ingresa un email válido';
        }

        // Validar contraseña
        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        // Validar confirmación de contraseña
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirma tu contraseña';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar envío del formulario
    const handleSubmit = async () => {

        if (!validateForm()) return;

        setIsSubmitting(true);

        // SAVE URL  AVATAR
        let publicUrl = ""
        if (avatar) {
            const path = `usuarios/${avatar?.name ?? ""}`;
            const result = await uploadFile(path, avatar);
            publicUrl = getPublicUrl(result.path);
        }

        try {
            // Simular envío (aquí harías la llamada a tu API)
            const userData = {
                ...formData,
                avatar: publicUrl?? null,
                id: Date.now() // ID temporal para simulación
            };
            console.log("user data", userData)

            // Simular delay de API
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (onSubmit) {
                onSubmit(userData);
            }

            // Resetear formulario
            setFormData({
                id: 0,
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                confirmPassword: '',
                status: 'active',
                avatar: ""

            });
            setAvatar(null);
            setAvatarPreview(null);
            setErrors({});

            if (onClose) {
                onClose();
            }
        } catch (error) {
            setErrors({ submit: 'Error al crear el usuario. Inténtalo de nuevo.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Obtener iniciales para avatar por defecto
    const getInitials = () => {
        const firstName = formData.first_name.trim();
        const lastName = formData.last_name.trim();
        return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-black">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Nuevo Usuario</h2>
                            <p className="text-sm text-gray-600">Completa la información para crear un usuario</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        disabled={isSubmitting}
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Formulario */}
                <div className="p-6 space-y-6">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt="Avatar preview"
                                    className="w-24 h-24 rounded-2xl object-cover border-4 border-gray-200"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xl border-4 border-gray-200">
                                    {getInitials() || <Camera className="w-8 h-8" />}
                                </div>
                            )}

                            {avatarPreview && (
                                <button
                                    type="button"
                                    onClick={removeAvatar}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
                                disabled={isSubmitting}
                            >
                                <Upload className="w-4 h-4" />
                                {avatarPreview ? 'Cambiar imagen' : 'Subir imagen'}
                            </button>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG hasta 5MB</p>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />

                        {errors.avatar && (
                            <div className="flex items-center gap-2 text-red-600 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {errors.avatar}
                            </div>
                        )}
                    </div>

                    {/* Información Personal */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre *
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.first_name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    placeholder="Ingresa el nombre"
                                    disabled={isSubmitting}
                                />
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                            {errors.first_name && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.first_name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Apellido *
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.last_name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    placeholder="Ingresa el apellido"
                                    disabled={isSubmitting}
                                />
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                            {errors.last_name && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.last_name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="usuario@ejemplo.com"
                                disabled={isSubmitting}
                            />
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Contraseñas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña *
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    placeholder="Mínimo 6 caracteres"
                                    disabled={isSubmitting}
                                />
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md transition-colors"
                                    disabled={isSubmitting}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4 text-gray-400" />
                                    ) : (
                                        <Eye className="w-4 h-4 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirmar Contraseña *
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    placeholder="Repite la contraseña"
                                    disabled={isSubmitting}
                                />
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md transition-colors"
                                    disabled={isSubmitting}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-4 h-4 text-gray-400" />
                                    ) : (
                                        <Eye className="w-4 h-4 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Rol y Estado */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Estado
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                disabled={isSubmitting}
                            >
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                                <option value="pending">Pendiente</option>
                            </select>
                        </div>
                    </div>

                    {/* Error general */}
                    {errors.submit && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2 text-red-600">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-sm">{errors.submit}</span>
                            </div>
                        </div>
                    )}

                    {/* Botones */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Creando...
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4" />
                                    Crear Usuario
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};