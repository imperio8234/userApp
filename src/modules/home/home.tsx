import { useState, useEffect, useRef } from 'react';
import { Edit, Users, Mail, Settings, Search, X, Check, Trash2, Plus, MoreVertical, LogOut, Upload, Camera } from 'lucide-react';
import { useUserManagement } from '@/context/userContext';
import { userServiceAuth, type Usuario } from '@/services/authService/userServiceAuth';
import { UserRegistrationForm } from './componentsUser/UserRegistrationForm';
import { showNotification } from '@/hooks/useNotify';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ConfirmationPopover from '@/hooks/confirmationPopover';
import { getPublicUrl, uploadFile } from '@/services/supabase/UploadFile';

export const Home = () => {
    // Simulando el contexto de usuarios con datos de ejemplo
    const { usuarios, user, setUsuarios } = useUserManagement();
    /*const [usuarios] = useState([
        { id: 1, first_name: 'María', last_name: 'González', email: 'maria.gonzalez@email.com', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', status: 'active' },
        { id: 2, first_name: 'Carlos', last_name: 'Rodríguez', email: 'carlos.rodriguez@email.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', status: 'inactive' },
        { id: 3, first_name: 'Ana', last_name: 'Martínez', email: 'ana.martinez@email.com', avatar: '', status: 'active' },
        { id: 4, first_name: 'Luis', last_name: 'López', email: 'luis.lopez@email.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', status: 'active' },
    ]);*/
    const [currentUser, setUserSelected] = useState<Usuario>(user?.first_name ?? usuarios[0]);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState(usuarios);
    const [showUserDetail, setShowUserDetail] = useState(false);


    const [avatar, setAvatar] = useState<any>(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef<any>(null);
    const [errors, setErrors] = useState<any>({});
    const [isSubmitting] = useState(false);

    // paginacion:   
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Calcular los usuarios a mostrar en la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsuarios = usuariosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

    // Calcular el total de páginas
    const totalPages = Math.ceil(usuariosFiltrados.length / itemsPerPage);


    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters] = useState(false);
    const [editingUser, setEditingUser] = useState<number | null>(null);
    const [activeFilter, setActiveFilter] = useState('Todos');
    const [editForm, setEditForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        avatar: ''
    });
    const [showForm, setShowForm] = useState<boolean>(false);

    const handleUserSubmit = (userData: Usuario) => {
        console.log('Nuevo usuario:', userData);
        // Aquí añadirías el usuario a tu estado/base de datos
        const { ...newUser } = userData;
        setUsuarios((prev) => [...prev, newUser]);
        showNotification("success", "usuario guardado")
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




    // Aplicar filtros cuando cambie el término de búsqueda
    useEffect(() => {
        if (!usuarios) return;

        let filtered = usuarios.filter(user =>
            `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Aplicar filtros adicionales
        if (activeFilter === 'Activos') {
            filtered = filtered.filter(user => user.status === 'active');
        } else if (activeFilter === 'Inactivos') {
            filtered = filtered.filter(user => user.status === 'inactive');
        }

        setUsuariosFiltrados(filtered);
        setCurrentPage(1);

    }, [searchTerm, usuarios, activeFilter]);

    // Iniciar edición de usuario
    const handleEditUser = (user: Usuario) => {
        setEditingUser(user.id);
        setEditForm({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            avatar: typeof user.avatar === 'string' ? user.avatar : ''
        });
        
    };

    // Cancelar edición
    const handleCancelEdit = () => {
        setEditingUser(null);
        setEditForm({
            first_name: '',
            last_name: '',
            email: '',
            avatar: ''
        });
    };

    const handleSaveEdit = async () => {
        console.log('Guardando usuario:', { id: editingUser, ...editForm });
        let publicUrl = ""
        if (avatar) {
            const path = `usuarios/${avatar?.name ?? ""}`;
            const result = await uploadFile(path, avatar);
            publicUrl = getPublicUrl(result.path);
        }
        editForm.avatar = publicUrl;

        setUsuarios((prevUsuarios) =>
            prevUsuarios.map((user) =>
                user.id === editingUser ? { ...user, ...editForm } : user
            )
        );

        handleCancelEdit();
        showNotification("success", "usuario actualizado exitosamente")
    };


    const handleDeleteUser = (id: number) => {

        const usuariosRestantes = usuarios.filter((user) => user.id != id);
        setUsuarios(usuariosRestantes);
        showNotification("success", "usuario eliminado")

    }

    // Función para obtener iniciales si no hay avatar
    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    };

    // Función para determinar si el avatar es válido
    const isValidAvatar = (avatar: string | File | null) => {
        return typeof avatar === 'string' && avatar.startsWith('http');
    };

    const handleFilterClick = (filter: string) => {
        setActiveFilter(filter);
    };

    // optener mas detalles del usuario

    const getAllDetail = async (id: number) => {
    try {
        const resDetail = await userServiceAuth.getById(id);
        console.log(resDetail);
        setShowUserDetail(true); // Mostrar detalle
    } catch (error) {
        console.log("error", error);
        showNotification("error", "Algo salió mal!");
    }
};


    const logout = () => {
        localStorage.removeItem("appuser");
        window.location.reload();
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 w-full">
            {/* Header Mejorado */}
            <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm w-full">
                <div className=" mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">D</span>
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                {user?.first_name ?? "Dashboard"}
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <Popover>
                                <PopoverTrigger>
                                    <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                        <Settings className="w-5 h-5 text-gray-600" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className='flex gap'>
                                    <div onClick={() => logout()} className='hover:bg-gray-400 p-2 flex gap-5 rounded cursor-pointer'>
                                        <LogOut /> salir
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8 ">
                {/* Cards de Estadísticas */}


                <div className="grid lg:grid-cols-4 gap-8">

                    {/* Panel de Perfil Mejorado */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            {/* Header del perfil con gradiente */}
                            <div className="h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
                                <div className="absolute -bottom-12 left-6">
                                    <div className="relative">
                                        <img
                                            src={
                                                typeof currentUser.avatar === "string"
                                                    ? currentUser.avatar
                                                    : currentUser.avatar
                                                        ? URL.createObjectURL(currentUser.avatar)
                                                        : undefined
                                            }
                                            alt={currentUser.first_name}
                                            className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover"
                                        />

                                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Información del perfil */}
                            <div className="pt-16 pb-6 px-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900 mb-2">
                                            {currentUser.first_name}
                                        </h2>

                                    </div>
                                    <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors group">
                                        <MoreVertical className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                                    </button>
                                </div>

                                <div className="space-y-3 text-sm text-gray-600 mb-6">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span className="truncate">{currentUser.email}</span>
                                    </div>


                                </div>

                                <div className='grid grid-cols-2 gap-2'>
                                    <button
                                        onClick={() => getAllDetail(currentUser.id)}
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md">
                                        Ver Más
                                    </button>
                                </div>

                                {showUserDetail && (
                                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl text-sm">
                                        <strong>A la espera:</strong> no se han generado datos extra.
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>

                    {/* Panel de Usuarios Registrados Mejorado */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                            <Users className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">
                                                Usuarios Registrados
                                            </h3>
                                            <p className="text-sm text-gray-600">Gestiona todos los usuarios del sistema</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setShowForm(true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                                            <Plus className="w-4 h-4" />
                                            Nuevo Usuario
                                        </button>
                                        {
                                            /*
                                              <button
                                            onClick={() => setShowFilters(!showFilters)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                                        >
                                            <Filter className="w-4 h-4" />
                                            Filtros
                                        </button>
                                            */
                                        }
                                    </div>
                                </div>

                                {/* Barra de búsqueda mejorada */}
                                <div className="relative mb-4">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar usuarios por nombre o email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full text-black pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                                        >
                                            <X className="w-4 h-4 text-gray-400" />
                                        </button>
                                    )}
                                </div>

                                {/* Panel de filtros mejorado */}
                                {showFilters && (
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-medium text-gray-700">Filtros rápidos</span>
                                            <span className="text-xs text-gray-500">{usuariosFiltrados?.length} resultados</span>
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            {['Todos', 'Activos', 'Inactivos', 'Recientes'].map((filter) => (
                                                <button
                                                    key={filter}
                                                    onClick={() => handleFilterClick(filter)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeFilter === filter
                                                        ? 'bg-blue-600 text-white shadow-sm'
                                                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {filter}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Lista de usuarios mejorada */}
                            <div className="p-6">
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {currentUsuarios?.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
                                        >
                                            {editingUser === user.id ? (
                                                // Modo edición mejorado
                                                <div className="flex-1 space-y-6 text-black">
                                                    {/* Sección de Avatar */}
                                                    <div className="flex justify-center">
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
                                                                        {getInitials(user.first_name, user.last_name) || <Camera className="w-8 h-8" />}
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
                                                        </div>
                                                    </div>

                                                    {/* Sección de Campos del Formulario */}
                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                                                    Nombre
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={editForm.first_name}
                                                                    onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                                                    Apellido
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={editForm.last_name}
                                                                    onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700 mb-2">
                                                                Email
                                                            </label>
                                                            <input
                                                                type="email"
                                                                value={editForm.email}
                                                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Sección de Botones de Acción */}
                                                    <div className="flex gap-3 pt-4 justify-end">
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                            Cancelar
                                                        </button>

                                                        <button
                                                            onClick={handleSaveEdit}
                                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                                                            disabled={isSubmitting}
                                                        >
                                                            <Check className="w-4 h-4" />
                                                            Guardar
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                // Modo vista mejorado
                                                <>
                                                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => setUserSelected(user)}>
                                                        <div className="relative">
                                                            {isValidAvatar(user.avatar) ? (
                                                                <img
                                                                    src={
                                                                        typeof user.avatar === "string"
                                                                            ? user.avatar
                                                                            : user.avatar
                                                                                ? URL.createObjectURL(user.avatar)
                                                                                : undefined
                                                                    }
                                                                    alt={`${user.first_name} ${user.last_name}`}
                                                                    className="w-12 h-12 rounded-xl object-cover"
                                                                />

                                                            ) : (
                                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                                                                    {getInitials(user.first_name, user.last_name)}
                                                                </div>
                                                            )}
                                                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">
                                                                {user.first_name} {user.last_name}
                                                            </h4>
                                                            <p className="text-sm text-gray-600">{user.email}</p>
                                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                                {user.status === 'active' ? 'Activo' : 'Inactivo'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 " onClick={(e) => e.stopPropagation()}>
                                                        <button
                                                            onClick={() => handleEditUser(user)}
                                                            className="p-2 hover:bg-blue-100 rounded-xl transition-colors group"
                                                            title="Editar usuario"
                                                        >
                                                            <Edit className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                                                        </button>

                                                        <ConfirmationPopover
                                                            message={'Esta acción no se puede deshacer. ¿Estás seguro de que deseas continuar?'}
                                                            onConfirm={() => handleDeleteUser(user.id)}
                                                            onCancel={() => showNotification("info", "accion cancelada")}
                                                        >
                                                            <button
                                                                className="p-2 hover:bg-red-100 rounded-xl transition-colors group cursor-pointer"
                                                                title="Eliminar usuario"
                                                            >
                                                                <Trash2 className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                                                            </button>
                                                        </ConfirmationPopover>

                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {usuariosFiltrados?.length === 0 && (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Users className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            {searchTerm ? 'No hay resultados' : 'No hay usuarios'}
                                        </h3>
                                        <p className="text-gray-500">
                                            {searchTerm ?
                                                'Intenta con diferentes términos de búsqueda.' :
                                                'Comienza agregando tu primer usuario.'
                                            }
                                        </p>
                                    </div>
                                )}

                                {/* paginacion*/}
                                {usuariosFiltrados.length > 5 && (
                                    <div className="flex justify-center mt-6 gap-2">
                                        <button
                                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className={`px-3 py-2 rounded-lg border ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
                                        >
                                            Anterior
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`px-3 py-2 rounded-lg border ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className={`px-3 py-2 rounded-lg border ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
                                        >
                                            Siguiente
                                        </button>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <UserRegistrationForm
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                onSubmit={handleUserSubmit}
            />
        </div>
    );
};