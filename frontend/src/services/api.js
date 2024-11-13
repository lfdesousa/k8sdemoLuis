// frontend/src/services/api.js
const API_BASE_URL = '/api';  // Change this to use relative URL

export const fetchItems = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/items`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

export const createItem = async (value) => {
  try {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};
