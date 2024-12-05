import React from "react";
import MobileAppSimulator from "./components/MobileSimulator";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GroupPage from "./components/GroupPage/Group";
import HomePage from "./components/HomePage/Home";
import SearchPage from "./components/SearchPage/Search";
import ProfilePage from "./components/Profile/Profile";
function App() {
  
    return (
      
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        {/* Passa le rotte come children */}
        <MobileAppSimulator>
          <Routes>
            {/* HomePage route */}
            <Route index element={<HomePage />} />
            {/* GroupPage route with dynamic group name */}
            <Route path='/search' element={<SearchPage />}/>
            <Route path='/group' element={<GroupPage />} />
          </Routes>
        </MobileAppSimulator>
      </div>
    
  );
  }
export default App;
