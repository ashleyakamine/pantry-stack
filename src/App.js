import React from 'react';
import { Route, Routes } from 'react-router-dom';
import {InventoryPage} from './pages/InventoryPage.js';
import {RecipePage} from './pages/RecipePage.js';

function App() {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<InventoryPage />} />
        <Route exact path="/RecipePage" element={<RecipePage />} />
      </Routes>
    </div>
  );
}

export default App;
