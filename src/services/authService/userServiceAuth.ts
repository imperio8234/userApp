import { backApi } from "../BaseUrl";

export interface Usuario {
    confirmPassword?: any;
    status?: string;
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: File | null | string;
    password?: string
}

export interface CreateUsuarioDto {
    name: string;
    job: string;
}

export interface RegisterDto {
    email: string;
    password?: string;
}

export const userServiceAuth = {
    /**
     * Obtener lista de usuarios paginada
     */
    async getAll(page = 1): Promise<Usuario[]> {
        try {
            const res = await backApi.get(`/api/users?page=${page}`);
            return res.data.data; // porque viene en "data"
        } catch (error: any) {
            throw new Error(error?.response?.data?.error || "Error al obtener usuarios");
        }
    },

    /**
     * Obtener usuario por ID
     */
    async getById(id: number): Promise<Usuario> {
        try {
            const res = await backApi.get(`/api/users/${id}`);
            return res.data.data;
        } catch (error: any) {
            throw new Error(error?.response?.data?.error || "Usuario no encontrado");
        }
    },

    /**
     * Crear usuario
     */
    async create(data: CreateUsuarioDto): Promise<any> {
        try {
            const res = await backApi.post(`/api/users`, data);
            return res.data;
        } catch (error: any) {
            throw new Error(error?.response?.data?.error || "Error al crear usuario");
        }
    },

    /**
     * Actualizar usuario (PUT)
     */
    async update(id: number, data: CreateUsuarioDto): Promise<any> {
        try {
            const res = await backApi.put(`/api/users/${id}`, data);
            return res.data;
        } catch (error: any) {
            throw new Error(error?.response?.data?.error || "Error al actualizar usuario");
        }
    },

    /**
     * Actualizar usuario (PATCH)
     */
    async patch(id: number, data: Partial<CreateUsuarioDto>): Promise<any> {
        try {
            const res = await backApi.patch(`/api/users/${id}`, data);
            return res.data;
        } catch (error: any) {
            throw new Error(error?.response?.data?.error || "Error al actualizar parcialmente");
        }
    },

    /**
     * Eliminar usuario
     */
    async delete(id: number): Promise<void> {
        try {
            await backApi.delete(`/users/${id}`);
        } catch (error: any) {
            throw new Error(error?.response?.data?.error || "Error al eliminar usuario");
        }
    },

    /**
     * Registro exitoso
     */
    async register(data: RegisterDto): Promise<any> {
        try {
            const res = await backApi.post(`/register`, data);
            return res.data;
        } catch (error: any) {
            throw new Error(error?.response?.data?.error || "Error en el registro");
        }
    },

    /**
     * Login
     */
    async login(data: RegisterDto): Promise<any> {
        try {
            const res = await backApi.post(`/api/login`, data);
            return res.data;
        } catch (error: any) {
            throw new Error(error?.response?.data?.error || "Error al iniciar sesión");
        }
    },

    /**
     * Simular respuesta con retardo
     */
    async getDelayedResponse(): Promise<Usuario[]> {
        try {
            const res = await backApi.get(`/users?delay=3`);
            return res.data.data;
        } catch (error: any) {
            throw new Error(error?.response?.data?.error || "Error en respuesta con retardo");
        }
    },
};
