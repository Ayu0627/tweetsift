import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './component/loginPage';
import Dashboard from './component/dashboard';

import './app.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={
                        !isAuthenticated ? <LoginPage onLogin={() => setIsAuthenticated(true)} /> : <Navigate to="/dashboard" />
                    } />
                    <Route path="/dashboard" element={
                        isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
                    } />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;