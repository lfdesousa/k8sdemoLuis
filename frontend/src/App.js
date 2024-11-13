// src/App.js
import React from 'react';
import ItemList from './components/ItemList';
import ItemForm from './components/ItemForm';

const App = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">JOM Demo Application</h1>
      <ItemForm />
      <ItemList />
    </div>
  );
};

export default App;

