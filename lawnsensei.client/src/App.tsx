// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/features/Dashboard';
import OnboardingStep1 from './components/onboarding/OnboardingStep1';
import OnboardingStep2 from './components/onboarding/OnboardingStep2';
import OnboardingSummary from './components/onboarding/OnboardingSummary';
import PrivateRoute from './components/common/PrivateRoute';
import Logout from './components/auth/Logout';
import LawnCarePlanGenerator from './components/features/LawnCarePlanGenerator';

const App: React.FC = () => {
    return (
        <Router>
            <div>
                <h1>Welcome to LawnSensei</h1>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/onboarding/step1" element={<OnboardingStep1 />} />
                    <Route path="/onboarding/step2" element={<OnboardingStep2 />} />
                    <Route path="/onboarding/summary" element={<OnboardingSummary lawnSize="" address="" grassType="" climateZone="" />} />
                    <Route path="/lawn-care-plan" element={<LawnCarePlanGenerator lawnSize="" grassType="" climateZone="" />} />
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App
