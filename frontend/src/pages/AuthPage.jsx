import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../forms/LoginForm';
import SignupForm from '../forms/SignupForm';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (user) => {
    login(user);
    navigate('/');
  };

  const handleSignup = (user) => {
    login(user);
    navigate('/');
  };

  const showSignup = () => {
    setIsLogin(false);
  };

  const showLogin = () => {
    setIsLogin(true);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {isLogin ? (
          <LoginForm 
            onLogin={handleLogin} 
            onShowSignup={showSignup} 
          />
        ) : (
          <SignupForm 
            onSignup={handleSignup} 
            onShowLogin={showLogin} 
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
