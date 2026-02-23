import api from './api'

export const login = async (email, password) => {
  const response = await api.post('auth/login', { email, password })
  return response.data
}

export const register = async (userData) => {
  const response = await api.post('auth/register', userData)
  return response.data
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('name')
}

export const getCurrentUser = () => {
  return {
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role'),
    name: localStorage.getItem('name'),
  }
}
