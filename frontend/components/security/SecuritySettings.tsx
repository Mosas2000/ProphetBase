'use client';

import React, { useState } from 'react';
import { Settings, Shield, Bell, Lock, Key, Eye, Mail, Smartphone, AlertTriangle } from 'lucide-react';

interface SecurityPreference {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'authentication' | 'notifications' | 'privacy' | 'account';
}

interface NotificationSetting {
  id: string;
  type: string;
  email: boolean;
  sms: boolean;
  push: boolean;
}

interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  expiryDays: number;
}

export default function SecuritySettings() {
  const [securityPreferences, setSecurityPreferences] = useState<SecurityPreference[]>([
    {
      id: '1',
      name: 'Two-Factor Authentication',
      description: 'Require 2FA for all logins',
      enabled: true,
      category: 'authentication',
    },
    {
      id: '2',
      name: 'Biometric Login',
      description: 'Use fingerprint or face recognition',
      enabled: true,
      category: 'authentication',
    },
    {
      id: '3',
      name: 'Email Verification',
      description: 'Verify email for sensitive actions',
      enabled: true,
      category: 'authentication',
    },
    {
      id: '4',
      name: 'IP Whitelist',
      description: 'Restrict access to whitelisted IPs',
      enabled: false,
      category: 'authentication',
    },
    {
      id: '5',
      name: 'Session Timeout',
      description: 'Auto logout after inactivity',
      enabled: true,
      category: 'authentication',
    },
    {
      id: '6',
      name: 'Login Notifications',
      description: 'Alert on new login attempts',
      enabled: true,
      category: 'notifications',
    },
    {
      id: '7',
      name: 'Transaction Notifications',
      description: 'Alert on all transactions',
      enabled: true,
      category: 'notifications',
    },
    {
      id: '8',
      name: 'Security Alerts',
      description: 'Notify about security events',
      enabled: true,
      category: 'notifications',
    },
    {
      id: '9',
      name: 'Hide Balance',
      description: 'Hide balance by default',
      enabled: false,
      category: 'privacy',
    },
    {
      id: '10',
      name: 'Anonymous Mode',
      description: 'Hide profile from public view',
      enabled: false,
      category: 'privacy',
    },
  ]);

  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    { id: '1', type: 'Login Attempts', email: true, sms: true, push: true },
    { id: '2', type: 'Large Transactions', email: true, sms: true, push: true },
    { id: '3', type: 'Withdrawal Requests', email: true, sms: false, push: true },
    { id: '4', type: 'Security Alerts', email: true, sms: true, push: true },
    { id: '5', type: 'KYC Updates', email: true, sms: false, push: false },
    { id: '6', type: 'Market Activities', email: false, sms: false, push: true },
  ]);

  const [passwordPolicy, setPasswordPolicy] = useState<PasswordPolicy>({
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expiryDays: 90,
  });

  const [sessionTimeout, setSessionTimeout] = useState(30); // minutes
  const [maxSessions, setMaxSessions] = useState(5);
  const [recoveryEmail, setRecoveryEmail] = useState('john.doe@example.com');
  const [recoveryPhone, setRecoveryPhone] = useState('+1 (555) 123-4567');

  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'password' | 'recovery'>('general');

  const togglePreference = (id: string) => {
    setSecurityPreferences(prev =>
      prev.map(pref => (pref.id === id ? { ...pref, enabled: !pref.enabled } : pref))
    );
  };

  const toggleNotification = (id: string, channel: 'email' | 'sms' | 'push') => {
    setNotificationSettings(prev =>
      prev.map(setting =>
        setting.id === id ? { ...setting, [channel]: !setting[channel] } : setting
      )
    );
  };

  const getPreferencesByCategory = (category: string) => {
    return securityPreferences.filter(pref => pref.category === category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600/20 rounded-xl">
              <Settings className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Security Settings</h1>
              <p className="text-slate-400">Manage your security preferences and account protection</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {[
            { id: 'general', label: 'General', icon: Shield },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'password', label: 'Password Policy', icon: Lock },
            { id: 'recovery', label: 'Recovery', icon: Key },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-8">
            {/* Authentication */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-bold">Authentication</h2>
              </div>

              <div className="space-y-4">
                {getPreferencesByCategory('authentication').map((pref) => (
                  <div key={pref.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{pref.name}</h3>
                      <p className="text-sm text-slate-400">{pref.description}</p>
                    </div>
                    <button
                      onClick={() => togglePreference(pref.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        pref.enabled
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-slate-600 hover:bg-slate-500'
                      }`}
                    >
                      {pref.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Session Management */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold mb-6">Session Management</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    Auto logout after this period of inactivity
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Maximum Active Sessions
                  </label>
                  <input
                    type="number"
                    value={maxSessions}
                    onChange={(e) => setMaxSessions(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    Maximum number of concurrent sessions allowed
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-2 mb-6">
                <Eye className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-bold">Privacy</h2>
              </div>

              <div className="space-y-4">
                {getPreferencesByCategory('privacy').map((pref) => (
                  <div key={pref.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{pref.name}</h3>
                      <p className="text-sm text-slate-400">{pref.description}</p>
                    </div>
                    <button
                      onClick={() => togglePreference(pref.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        pref.enabled
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-slate-600 hover:bg-slate-500'
                      }`}
                    >
                      {pref.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-6">
              <Bell className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold">Notification Preferences</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Event Type</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-slate-400">
                      <Mail className="w-4 h-4 mx-auto" />
                      <span className="block mt-1">Email</span>
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-slate-400">
                      <Smartphone className="w-4 h-4 mx-auto" />
                      <span className="block mt-1">SMS</span>
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-slate-400">
                      <Bell className="w-4 h-4 mx-auto" />
                      <span className="block mt-1">Push</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {notificationSettings.map((setting) => (
                    <tr key={setting.id} className="border-b border-slate-700/50">
                      <td className="py-4 px-4 font-medium">{setting.type}</td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => toggleNotification(setting.id, 'email')}
                          className={`w-10 h-10 rounded-lg transition-colors ${
                            setting.email
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-slate-700 hover:bg-slate-600'
                          }`}
                        >
                          {setting.email ? '✓' : ''}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => toggleNotification(setting.id, 'sms')}
                          className={`w-10 h-10 rounded-lg transition-colors ${
                            setting.sms
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-slate-700 hover:bg-slate-600'
                          }`}
                        >
                          {setting.sms ? '✓' : ''}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => toggleNotification(setting.id, 'push')}
                          className={`w-10 h-10 rounded-lg transition-colors ${
                            setting.push
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-slate-700 hover:bg-slate-600'
                          }`}
                        >
                          {setting.push ? '✓' : ''}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-300">
                  <p className="font-semibold text-blue-400 mb-1">Security Recommendations</p>
                  <p>We recommend enabling all notification channels for critical security events like login attempts and large transactions.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Password Policy */}
        {activeTab === 'password' && (
          <div className="space-y-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-bold">Password Requirements</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Minimum Password Length
                  </label>
                  <input
                    type="number"
                    value={passwordPolicy.minLength}
                    onChange={(e) =>
                      setPasswordPolicy(prev => ({ ...prev, minLength: Number(e.target.value) }))
                    }
                    min="8"
                    max="32"
                    className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'requireUppercase', label: 'Require Uppercase Letters' },
                    { key: 'requireLowercase', label: 'Require Lowercase Letters' },
                    { key: 'requireNumbers', label: 'Require Numbers' },
                    { key: 'requireSpecialChars', label: 'Require Special Characters' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <span>{item.label}</span>
                      <button
                        onClick={() =>
                          setPasswordPolicy(prev => ({
                            ...prev,
                            [item.key]: !prev[item.key as keyof PasswordPolicy],
                          }))
                        }
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          passwordPolicy[item.key as keyof PasswordPolicy]
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-slate-600 hover:bg-slate-500'
                        }`}
                      >
                        {passwordPolicy[item.key as keyof PasswordPolicy] ? 'Required' : 'Optional'}
                      </button>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Password Expiry (days)
                  </label>
                  <input
                    type="number"
                    value={passwordPolicy.expiryDays}
                    onChange={(e) =>
                      setPasswordPolicy(prev => ({ ...prev, expiryDays: Number(e.target.value) }))
                    }
                    min="0"
                    max="365"
                    className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    Set to 0 to disable password expiry
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold mb-4">Change Password</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recovery Options */}
        {activeTab === 'recovery' && (
          <div className="space-y-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-2 mb-6">
                <Key className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-bold">Account Recovery</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Recovery Email</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      className="flex-1 px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
                      Verify
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Recovery Phone</label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={recoveryPhone}
                      onChange={(e) => setRecoveryPhone(e.target.value)}
                      className="flex-1 px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold mb-4">Backup Codes</h2>
              <p className="text-slate-400 mb-6">
                Generate backup codes to access your account if you lose your 2FA device. Store these codes in a safe place.
              </p>
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
                Generate Backup Codes
              </button>
            </div>

            <div className="bg-red-600/10 border border-red-600/20 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-red-400 mb-2">Danger Zone</h3>
                  <p className="text-sm text-slate-300 mb-4">
                    These actions are irreversible. Please proceed with caution.
                  </p>
                  <button className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
