import React, { useState, useEffect } from 'react';
import { User, Bell, ShieldCheck, HelpCircle, Info, LogOut, Camera, ChevronRight, Flame, Target, Heart, Database, Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import { UserProfile } from '../types';
import { api, getApiConfig, saveApiConfig } from '../services/api';

interface ProfileProps {
  userProfile: UserProfile;
  onLogout: () => void;
  onNavigate: (screen: any) => void;
  onUpdateName: (newName: string) => void;
}

export default function Profile({ userProfile, onLogout, onNavigate, onUpdateName }: ProfileProps) {
  const [apiConfig, setApiConfig] = useState(getApiConfig());
  const [pingStatus, setPingStatus] = useState<{ loading: boolean; success?: boolean; message?: string }>({ loading: false });

  const handleEditName = () => {
    const nextName = prompt('Enter your name:', userProfile.name);
    if (nextName && nextName.trim()) {
      onUpdateName(nextName.trim());
    }
  };

  const testConnection = async (url: string) => {
    setPingStatus({ loading: true });
    const res = await api.pingBackend(url);
    setPingStatus({
      loading: false,
      success: res.success,
      message: res.message
    });
  };

  const handleUrlChange = (url: string) => {
    const updated = { ...apiConfig, baseUrl: url };
    setApiConfig(updated);
    saveApiConfig(updated);
  };

  const menuItems = [
    {
      id: 'personal',
      name: 'Personal Information',
      icon: <User className="w-5 h-5 text-gray-500" />,
      action: handleEditName
    },
    {
      id: 'reminders',
      name: 'Reminder Settings',
      icon: <Bell className="w-5 h-5 text-gray-500" />,
      action: () => onNavigate('reminders')
    },
    {
      id: 'privacy',
      name: 'Data & Privacy',
      icon: <ShieldCheck className="w-5 h-5 text-gray-500" />,
      action: () => alert('Your data is kept fully secure locally in this browser sandbox.')
    },
    {
      id: 'help',
      name: 'Help & Support',
      icon: <HelpCircle className="w-5 h-5 text-gray-500" />,
      action: () => alert('Contact our support team anytime at support@lifepulse.fit')
    },
    {
      id: 'about',
      name: 'About LifePulse',
      icon: <Info className="w-5 h-5 text-gray-500" />,
      action: () => alert('LifePulse v1.2.0 - Designed with React and Tailwind CSS.')
    }
  ];

  return (
    <div id="profile-screen" className="flex flex-col min-h-screen bg-slate-50/50 px-5 pt-8 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 font-sans">Profile</h2>
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Active</span>
      </div>

      {/* User Info Card (Screen 12) */}
      <div className="flex flex-col items-center text-center mb-6">
        {/* Avatar with Camera badge */}
        <div className="relative mb-3 group cursor-pointer" onClick={handleEditName}>
          <img
            src={userProfile.avatarUrl}
            alt={userProfile.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md shadow-slate-200 group-hover:scale-105 transition-transform"
          />
          <div className="absolute bottom-0 right-0 p-2 bg-emerald-600 text-white rounded-full border-2 border-white shadow-md cursor-pointer hover:bg-emerald-700 transition-colors">
            <Camera className="w-4 h-4" />
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 font-sans">{userProfile.name}</h3>
        <p className="text-gray-400 text-xs font-medium">{userProfile.email}</p>
      </div>

      {/* Mini Stats row (Streak / Habits / Avg Score) */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {/* Streak */}
        <div className="bg-white border border-gray-100 p-3 rounded-2.5xl shadow-sm text-center flex flex-col items-center">
          <Flame className="w-5 h-5 text-amber-500 fill-amber-50 mb-1" />
          <span className="text-base font-extrabold text-gray-800 tracking-tight">{userProfile.streak}</span>
          <span className="text-[9px] text-gray-400 font-bold uppercase">Days Streak</span>
        </div>

        {/* Habits */}
        <div className="bg-white border border-gray-100 p-3 rounded-2.5xl shadow-sm text-center flex flex-col items-center">
          <Target className="w-5 h-5 text-emerald-600 mb-1" />
          <span className="text-base font-extrabold text-gray-800 tracking-tight">{userProfile.habitsCount}</span>
          <span className="text-[9px] text-gray-400 font-bold uppercase">Habits</span>
        </div>

        {/* Avg Score */}
        <div className="bg-white border border-gray-100 p-3 rounded-2.5xl shadow-sm text-center flex flex-col items-center cursor-pointer" onClick={() => onNavigate('score')}>
          <Heart className="w-5 h-5 text-rose-500 fill-rose-50 mb-1" />
          <span className="text-base font-extrabold text-gray-800 tracking-tight">{userProfile.avgScore}</span>
          <span className="text-[9px] text-gray-400 font-bold uppercase">Avg Score</span>
        </div>
      </div>

      {/* Navigation menu list */}
      <div className="bg-white border border-gray-100 rounded-3xl p-3 shadow-sm mb-6 space-y-1">
        {menuItems.map((item) => (
          <button
            id={`profile-menu-item-${item.id}`}
            key={item.id}
            onClick={item.action}
            className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer text-left"
          >
            <div className="flex items-center space-x-3.5">
              <div className="p-2 bg-slate-50 rounded-xl">
                {item.icon}
              </div>
              <span className="text-xs font-bold text-gray-700">{item.name}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
        ))}
      </div>

      {/* Backend Connection Settings - Crucial for Harish's FastAPI backend and future scalability */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm mb-6 space-y-4">
        <div className="flex items-center space-x-2.5">
          <Database className="w-5 h-5 text-emerald-600" />
          <h4 className="text-sm font-bold text-gray-800">Backend Server Settings</h4>
        </div>
        
        <p className="text-[11px] text-gray-400 leading-relaxed">
          Configure connection details to your Python FastAPI + PostgreSQL backend. Your tracking data syncs automatically.
        </p>

        {/* Connection detail inputs */}
        <div className="space-y-3 pt-1">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">FastAPI URL</label>
            <input
              type="text"
              value={apiConfig.baseUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-gray-100 rounded-xl text-xs font-mono text-gray-700 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
              placeholder="http://localhost:8000"
            />
          </div>

          {/* Ping connection status */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => testConnection(apiConfig.baseUrl)}
              disabled={pingStatus.loading}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-xl text-[11px] font-bold transition-all disabled:opacity-50 cursor-pointer"
            >
              {pingStatus.loading ? 'Testing...' : 'Test Connection'}
            </button>
            
            <div className="flex items-center space-x-1.5 text-right max-w-[60%]">
              {pingStatus.loading ? (
                <span className="flex items-center text-[11px] text-gray-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1.5"></span>
                  Reaching server...
                </span>
              ) : pingStatus.success === true ? (
                <span className="flex items-center text-[11px] text-emerald-600 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-500 shrink-0" />
                  Connected
                </span>
              ) : pingStatus.success === false ? (
                <span className="flex items-center text-[11px] text-rose-500 font-medium leading-tight">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-500 shrink-0" />
                  Offline
                </span>
              ) : (
                <span className="text-[11px] text-gray-400">Not tested yet</span>
              )}
            </div>
          </div>

          {pingStatus.message && (
            <p className={`text-[10px] p-2 rounded-xl border leading-relaxed ${
              pingStatus.success ? 'bg-emerald-50/50 border-emerald-100/50 text-emerald-700' : 'bg-rose-50/50 border-rose-100/50 text-rose-700'
            }`}>
              {pingStatus.message}
            </p>
          )}
        </div>
      </div>

      {/* Log Out button */}
      <button
        id="btn-profile-logout"
        onClick={onLogout}
        className="w-full py-4 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-2.5xl flex items-center justify-center space-x-2 transition-all active:scale-98 cursor-pointer text-xs uppercase tracking-wider"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out</span>
      </button>
    </div>
  );
}
