import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import {InventoryPage} from './pages/InventoryPage';
import {RecipePage} from './pages/RecipePage';
import {HomePage} from './pages/HomePage';


function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/recipe" element={<RecipePage />} />
      </Routes>
    </>
  );
}

export default App;