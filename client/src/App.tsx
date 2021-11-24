import React from 'react';
import WelcomePage from './pages';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import RoomPage from './pages/room';
function App() {
  
  return(
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<WelcomePage />} />
    <Route path="/:roomId" element={<RoomPage />} />


  </Routes>
  </BrowserRouter>)
}

export default App;
