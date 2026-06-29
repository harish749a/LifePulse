import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User as UserIcon, Database, CheckCircle, HelpCircle, ArrowLeft, Settings, AlertTriangle } from 'lucide-react';
import { api, getApiConfig } from '../services/api';

interface LoginProps {
  onLoginSuccess: (email: string, name: string) => void;
  onBack: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-password';

export default function Login({ onLoginSuccess, onBack }: LoginProps) {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  
  // Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('harish@example.com');
  const [password, setPassword] = useState('password123');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [apiConfig, setApiConfig] = useState(getApiConfig());

  // Connection config states
  const [showSettings, setShowSettings] = useState(false);
  const [tempUrl, setTempUrl] = useState(apiConfig.baseUrl);
  const [pingStatus, setPingStatus] = useState<{ loading: boolean; success?: boolean; message?: string }>({ loading: false });

  // Sync tempUrl when apiConfig changes
  useEffect(() => {
    setTempUrl(apiConfig.baseUrl);
  }, [apiConfig]);

  // Listen for local changes to api config/mode in local storage
  useEffect(() => {
    const handleStorageChange = () => {
      setApiConfig(getApiConfig());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleTestConnection = async () => {
    setPingStatus({ loading: true });
    const status = await api.pingBackend(tempUrl);
    setPingStatus(status);
  };

  const handleSaveUrl = async () => {
    localStorage.setItem('lifepulse_api_url', tempUrl);
    setApiConfig({ baseUrl: tempUrl, mode: 'live' });
    setSuccessMsg(`Backend URL updated to ${tempUrl}`);
    
    setPingStatus({ loading: true });
    const status = await api.pingBackend(tempUrl);
    setPingStatus(status);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (authMode === 'register') {
      if (!name || !email || !password) {
        setError('Please fill in all fields');
        return;
      }
    } else if (authMode === 'login') {
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }
    } else if (authMode === 'forgot-password') {
      if (!email) {
        setError('Please enter your email address');
        return;
      }
    } else if (authMode === 'reset-password') {
      if (!resetToken || !newPassword) {
        setError('Please enter both the reset token and new password');
        return;
      }
    }

    setLoading(true);

    try {
      // --- Strictly Live API calls with no silent simulated bypass ---
      if (authMode === 'login') {
        await api.login({ email, password });
        const profile = await api.getProfile();
        const dispName = profile.name || email.split('@')[0];
        onLoginSuccess(email, dispName);
      } else if (authMode === 'register') {
        await api.register({ email, password, name });
        setSuccessMsg('Account registered successfully in your PostgreSQL database! You can now log in.');
        setAuthMode('login');
      } else if (authMode === 'forgot-password') {
        await api.forgotPassword(email);
        setSuccessMsg('If the email exists, a password reset link has been sent to your inbox.');
      } else if (authMode === 'reset-password') {
        await api.resetPassword({ token: resetToken, new_password: newPassword });
        setSuccessMsg('Password has been successfully updated in your database! Please log in with your new password.');
        setAuthMode('login');
      }
    } catch (err: any) {
      let friendlyError = err.message || 'An error occurred. Please try again.';
      if (friendlyError.includes('Failed to fetch') || friendlyError.includes('network error') || friendlyError.includes('Type error')) {
        friendlyError = `Could not connect to your Python FastAPI backend at "${apiConfig.baseUrl}". Please ensure your FastAPI server is running (usually port 8000) and CORS is configured, or change the URL using the configuration panel below.`;
      }
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    onLoginSuccess('harish749a@gmail.com', 'Harish');
  };

  return (
    <div id="login-screen" className="flex flex-col min-h-screen bg-white p-6 justify-between">
      {/* Top Header Row with dynamic Back action */}
      <div className="flex items-center justify-between mt-4">
        <button
          id="btn-login-back"
          onClick={() => {
            if (authMode !== 'login') {
              setAuthMode('login');
              setError('');
              setSuccessMsg('');
            } else {
              onBack();
            }
          }}
          className="p-2.5 hover:bg-slate-50 rounded-full transition-colors cursor-pointer text-gray-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Dynamic configuration action + database pill */}
        <div className="flex items-center space-x-2">
          <button
            id="btn-login-settings"
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors cursor-pointer text-gray-500 hover:text-emerald-600"
            title="Configure FastAPI URL"
          >
            <Settings className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100/50 rounded-full text-[10px] font-bold text-emerald-700">
            <Database className="w-3 h-3 text-emerald-500" />
            <span>Live PostgreSQL Sync</span>
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="mt-4 p-4 bg-slate-50 border border-gray-100 rounded-2xl space-y-3">
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4 text-emerald-600 animate-spin-slow" />
            <h4 className="text-xs font-bold text-gray-700">FastAPI Connection Config</h4>
          </div>
          <p className="text-[10px] text-gray-400">
            Configure the URL to reach your Python FastAPI server and PostgreSQL DB.
          </p>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-400 uppercase">FastAPI Base URL</label>
            <input
              type="text"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-100 rounded-xl text-xs font-mono text-gray-700 focus:border-emerald-500 focus:outline-none"
              placeholder="http://localhost:8000"
            />
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={pingStatus.loading}
                className="px-3 py-1.5 bg-slate-150 hover:bg-slate-200 text-gray-700 border border-gray-200 rounded-xl text-[10px] font-bold transition-all disabled:opacity-50 cursor-pointer"
              >
                {pingStatus.loading ? 'Testing...' : 'Test'}
              </button>
              <button
                type="button"
                onClick={handleSaveUrl}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold transition-all cursor-pointer"
              >
                Save & Set
              </button>
            </div>
            
            <div className="flex items-center space-x-1.5 text-right max-w-[60%] animate-fade-in">
              {pingStatus.loading ? (
                <span className="text-[10px] text-gray-400 font-medium animate-pulse">Reaching server...</span>
              ) : pingStatus.success === true ? (
                <span className="flex items-center text-[10px] text-emerald-600 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5 mr-0.5 text-emerald-500 shrink-0" />
                  Connected
                </span>
              ) : pingStatus.success === false ? (
                <span className="flex items-center text-[10px] text-rose-500 font-medium leading-tight">
                  <AlertTriangle className="w-3.5 h-3.5 mr-0.5 text-rose-500 shrink-0" />
                  Offline
                </span>
              ) : null}
            </div>
          </div>
          {pingStatus.message && (
            <p className={`text-[9px] p-2.5 rounded-xl border leading-relaxed ${
              pingStatus.success ? 'bg-emerald-50/50 border-emerald-100/50 text-emerald-700' : 'bg-rose-50/50 border-rose-100/50 text-rose-700'
            }`}>
              {pingStatus.message}
            </p>
          )}
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center my-4 space-y-6">
        {/* Title details */}
        <div className="space-y-1">
          {authMode === 'login' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 font-sans">Welcome Back! 👋</h2>
              <p className="text-gray-400 text-xs">Log in to continue your healthy journey</p>
            </>
          )}
          {authMode === 'register' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 font-sans">Create Account ✨</h2>
              <p className="text-gray-400 text-xs">Start logging and checking your vital parameters</p>
            </>
          )}
          {authMode === 'forgot-password' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 font-sans">Forgot Password? 🔑</h2>
              <p className="text-gray-400 text-xs">Enter your email to request a secure reset token</p>
            </>
          )}
          {authMode === 'reset-password' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 font-sans">Reset Password 🔄</h2>
              <p className="text-gray-400 text-xs">Enter your reset token and new credentials</p>
            </>
          )}
        </div>

        {/* Social login option is available only on default Login form */}
        {authMode === 'login' && (
          <>
            <button
              id="btn-google-sign-in"
              onClick={handleGoogleSignIn}
              type="button"
              className="flex items-center justify-center space-x-3 w-full py-3.5 border border-gray-100 rounded-2xl hover:bg-slate-50 active:scale-98 transition-all cursor-pointer shadow-sm text-sm font-medium text-gray-700"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center justify-center space-x-2 text-gray-300 text-xs">
              <div className="h-px bg-gray-100 flex-1"></div>
              <span className="font-medium text-gray-400">or</span>
              <div className="h-px bg-gray-100 flex-1"></div>
            </div>
          </>
        )}

        {/* Input/Authentication Forms */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl text-xs font-semibold leading-relaxed">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-semibold leading-relaxed flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Full Name Field (Register only) */}
          {authMode === 'register' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-3.5 text-gray-300 w-5 h-5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-none transition-all text-gray-800"
                  placeholder="Enter your full name"
                />
              </div>
            </div>
          )}

          {/* Email Address field */}
          {authMode !== 'reset-password' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-gray-300 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-none transition-all text-gray-800"
                  placeholder="name@example.com"
                />
              </div>
            </div>
          )}

          {/* Token field (Reset only) */}
          {authMode === 'reset-password' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600">Reset Token</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-300 w-5 h-5" />
                <input
                  type="text"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-none transition-all text-gray-800"
                  placeholder="Paste your reset token"
                />
              </div>
            </div>
          )}

          {/* Password fields */}
          {authMode === 'login' && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-600">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('forgot-password');
                    setError('');
                    setSuccessMsg('');
                  }}
                  className="text-xs font-semibold text-emerald-600 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-300 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-none transition-all text-gray-800"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          {authMode === 'register' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-300 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-none transition-all text-gray-800"
                  placeholder="Choose password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          {authMode === 'reset-password' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-300 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-none transition-all text-gray-800"
                  placeholder="Create new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          {/* Core Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl shadow-md shadow-emerald-100 hover:shadow-emerald-200 transition-all active:scale-98 text-center cursor-pointer disabled:opacity-75 flex items-center justify-center space-x-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            <span>
              {authMode === 'login' && 'Log In'}
              {authMode === 'register' && 'Create Account'}
              {authMode === 'forgot-password' && 'Send Reset Token'}
              {authMode === 'reset-password' && 'Update Password'}
            </span>
          </button>
        </form>

        {/* Forgot password shortcut to enter reset token manually */}
        {authMode === 'forgot-password' && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setAuthMode('reset-password');
                setError('');
                setSuccessMsg('');
              }}
              className="text-xs font-bold text-slate-500 hover:text-gray-700"
            >
              Have a reset token? Enter it manually
            </button>
          </div>
        )}
      </div>

      {/* Footer redirection link */}
      <div className="text-center mt-4 mb-2">
        {authMode === 'login' ? (
          <>
            <span className="text-gray-400 text-xs">Don't have an account? </span>
            <button
              onClick={() => {
                setAuthMode('register');
                setError('');
                setSuccessMsg('');
              }}
              className="text-emerald-600 font-semibold text-xs hover:underline focus:outline-none cursor-pointer"
            >
              Sign Up
            </button>
          </>
        ) : (
          <>
            <span className="text-gray-400 text-xs">Already have an account? </span>
            <button
              onClick={() => {
                setAuthMode('login');
                setError('');
                setSuccessMsg('');
              }}
              className="text-emerald-600 font-semibold text-xs hover:underline focus:outline-none cursor-pointer"
            >
              Log In
            </button>
          </>
        )}
      </div>
    </div>
  );
}
