import api from './api.js';

export const getTasks = async (params) => {
  const { data } = await api.get('/tasks', { params });
  return data;
};

export const createTask = async (payload) => {
  const { data } = await api.post('/tasks', payload);
  return data;
};

export const updateTask = async (id, payload) => {
  const { data } = await api.put(`/tasks/${id}`, payload);
  return data;
};

export const deleteTask = async (id) => {
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
};

export const toggleTaskStatus = async (id) => {
  const { data } = await api.patch(`/tasks/${id}/status`);
  return data;
};

