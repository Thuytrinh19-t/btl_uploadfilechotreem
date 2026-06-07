import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8001",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("username");
      window.dispatchEvent(new Event("auth:logout"));
    }
    return Promise.reject(error);
  }
);

export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/auth/register", data);
export const logout = () => api.post("/auth/logout");

export const getDocuments = (folderId = null) =>
  api.get("/documents", { params: { folder_id: folderId } });
export const getDocument = (id) => api.get(`/documents/${id}`);
export const uploadDocument = (formData) =>
  api.post("/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateDocument = (id, data) => api.put(`/documents/${id}`, data);
export const deleteDocument = (id) => api.delete(`/documents/${id}`);

export const getFolders = (parentId = null) =>
  api.get("/folders", { params: { parent_id: parentId } });
export const getFolder = (id) => api.get(`/folders/${id}`);
export const createFolder = (data) => api.post("/folders", data);
export const updateFolder = (id, data) => api.put(`/folders/${id}`, data);
export const deleteFolder = (id) => api.delete(`/folders/${id}`);

export const importFromDrive = (data, folderId = null) =>
  api.post("/documents/drive/import", data, { params: { folder_id: folderId } });
export const importFolderFromDrive = (data, folderId = null) =>
  api.post("/documents/drive/import-folder", data, { params: { target_folder_id: folderId } });

export default api;
