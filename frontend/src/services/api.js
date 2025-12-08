const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const api = {
  getCows: async () => {
    const response = await fetch(`${API_BASE}/cows`);
    return response.json();
  },
  
  getCow: async (id) => {
    const response = await fetch(`${API_BASE}/cows/${id}`);
    return response.json();
  },
  
  addCow: async (cowData) => {
    const response = await fetch(`${API_BASE}/cows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cowData)
    });
    return response.json();
  },
  
  updateCow: async (id, cowData) => {
    const response = await fetch(`${API_BASE}/cows/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cowData)
    });
    return response.json();
  },

  deleteCow: async (id) => {
    const response = await fetch(`${API_BASE}/cows/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },
  
  getDashboardStats: async () => {
    const response = await fetch(`${API_BASE}/dashboard/stats`);
    return response.json();
  },
  
  getYield: async (id) => {
    const response = await fetch(`${API_BASE}/yield/${id}`);
    return response.json();
  },
  
  addYield: async (id, yieldData) => {
    const response = await fetch(`${API_BASE}/yield/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(yieldData)
    });
    return response.json();
  },
  
  getFeed: async (id) => {
    const response = await fetch(`${API_BASE}/feed/${id}`);
    return response.json();
  },
  
  getHealth: async (id) => {
    const response = await fetch(`${API_BASE}/health/${id}`);
    return response.json();
  },

  getFarmSettings: async () => {
    const response = await fetch(`${API_BASE}/farm/settings`);
    return response.json();
  },

  updateFarmSettings: async (settings) => {
    const response = await fetch(`${API_BASE}/farm/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return response.json();
  },

  updateCowLocation: async (id, lat, lng) => {
    const response = await fetch(`${API_BASE}/cows/${id}/location`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lng })
    });
    return response.json();
  }
};
