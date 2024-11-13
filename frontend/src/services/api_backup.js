// frontend/src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const fetchItems = async () => {
  const response = await fetch(`${API_BASE_URL}/items`);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

export const createItem = async (value) => {
  const response = await fetch(`${API_BASE_URL}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ value }),
  });
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};
