// frontend/src/components/ItemList.js
import React, { useState, useEffect } from 'react';
import { fetchItems } from '../services/api';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await fetchItems();
      setItems(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading items:', error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li 
          key={item.id}
          className="p-2 bg-gray-100 rounded"
        >
          {item.value}
        </li>
      ))}
    </ul>
  );
};

export default ItemList;
