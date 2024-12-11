import React from "react";
import MobileAppSimulator from "./components/MobileSimulator";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GroupPage from "./components/GroupPage/Group";
import HomePage from "./components/HomePage/Home";
import SearchPage from "./components/SearchPage/Search";
import ProfilePage from "./components/Profile/Profile";
import Challenges from "./components/Challenge/ChallengeLanding";
import ChallengePage  from "./components/Challenge/DochallengePage";
import ChallengeSummary from "./components/Challenge/SumPage";
function App() {
  
    return (
      
      <div>
        <MobileAppSimulator>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path='/search' element={<SearchPage />}/>
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/home' element={<HomePage/>}/>
            <Route path='/group' element={<GroupPage />} />
            <Route path='/challenge' element={<Challenges />} />
            <Route path='/challenge/:id' element={<ChallengePage />} />
            <Route path= '/summary' element={<ChallengeSummary />} />
          </Routes>
        </MobileAppSimulator>
      </div>
    
  );
  }
export default App;
