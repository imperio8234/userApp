import { supabase } from "./supabaseClient";

// Nombre del bucket
const BUCKET_NAME = 'evidencias';

// Resultado estándar
interface UploadResult {
  path: string;
  fullPath: string;
}

// 📤 Subir archivo al bucket
export const uploadFile = async (
  path: string,
  file: File
): Promise<UploadResult> => {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;
  return data as UploadResult;
};

// 📥 Obtener URL pública
export const getPublicUrl = (path: string): string => {
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
  return data.publicUrl;
};

// 🔐 Obtener URL firmada (expira)
export const getSignedUrl = async (
  path: string,
  expiresInSeconds = 3600
): Promise<string> => {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(path, expiresInSeconds);

  if (error) throw error;
  return data.signedUrl;
};

// ❌ Eliminar archivo
export const deleteFile = async (path: string): Promise<void> => {
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);
  if (error) throw error;
};
