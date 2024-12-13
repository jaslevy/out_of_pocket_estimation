import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Form from './components/Form';
import Results from './components/Results';
import LandingPage from './components/LandingPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/form" element={<Form />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
};

export default App;