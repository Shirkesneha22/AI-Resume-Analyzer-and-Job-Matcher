import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { WorkbenchPage } from './pages/WorkbenchPage';

export function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WorkbenchPage />} />
          <Route path="/analyzer" element={<WorkbenchPage />} />
          <Route path="*" element={<WorkbenchPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
