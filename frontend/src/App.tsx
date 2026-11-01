import React from 'react';
import './App.css';
import LoginPage from './Pages/Login/LoginPage';
import SignUp from './Components/Signup/Signup';
import Navbar from './Components/Navbar/Navbar';
import {BrowserRouter as Router, Route, Routes} from  'react-router-dom';
import Dashboard from './Pages/Dashboard/Dashboard';
import ProtectedRoutes from './Utils/ProtectedRoutes';
import CampaignPage from './Pages/Campaign/CampaignPage';
import DiscoverPage from './Pages/Discover/DiscoverPage';
import HomePage from './Pages/Home/HomePage';
import CreateCampaign from './Pages/CreateCampaign/CreateCampaign';
import CreateBlog from './Pages/Blog/CreateBlog';
import { UserProfile } from './Pages/UserProfile/UserProfile';
import BlogDashboard from './Pages/BlogDashboard/BlogDashboard';
import About from './Pages/About/About';
import Rewards from './Pages/Rewards/Rewards';

function App() {
  return (
    <div className='App'>
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<SignUp />} />
          <Route path='/discover' element={<DiscoverPage />} />
          
          {/* Protected Routes - only authenticated users can access */}
          <Route path='/dashboard' element={<ProtectedRoutes />}>
            <Route path='/dashboard' element={<Dashboard />} />
          </Route>
          
          <Route path='/profile' element={<ProtectedRoutes />}>
            <Route path='/profile' element={<UserProfile />} />
          </Route>

          <Route path='/rewards' element={<ProtectedRoutes />}>
            <Route path='/rewards' element={<Rewards />} />
          </Route>

          <Route path='/campaigns/campaign/:campaignId' element={<CampaignPage />} />
          <Route path='/create/:campaignId' element={<CreateCampaign />} />
          <Route path='/create' element={<CreateCampaign />} />
          <Route path='/BlogDashboard/:campaignId' element={<BlogDashboard />} />
          <Route path='/AddBlog/:campaignId' element={<CreateBlog />} />
          <Route path='/about' element={<About />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
