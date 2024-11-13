// frontend/src/components/ItemForm.js
import React, { useState } from 'react';
import { createItem } from '../services/api';

const ItemForm = () => {
  const [value, setValue] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createItem(value);
      setValue('');
      // Trigger refresh of item list
      // You might want to use a state management solution or callback for this
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter new item"
        className="p-2 border rounded mr-2"
      />
      <button 
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Item
      </button>
    </form>
  );
};

export default ItemForm;
