'use client';

import React, { useState } from 'react';
import { UserCheck, Upload, AlertCircle, CheckCircle, Clock, FileText, Camera, Shield, XCircle } from 'lucide-react';

interface VerificationDocument {
  id: string;
  type: 'passport' | 'driver_license' | 'id_card' | 'proof_of_address';
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  uploadedDate: Date;
  reviewedDate: Date | null;
  expiryDate: Date | null;
  rejectionReason?: string;
}

interface KYCLevel {
  level: number;
  name: string;
  withdrawalLimit: number;
  tradingLimit: number;
  requirements: string[];
  completed: boolean;
}

export default function KYCVerification() {
  const [kycStatus, setKycStatus] = useState<'not_started' | 'in_progress' | 'completed' | 'rejected'>('in_progress');
  const [currentLevel, setCurrentLevel] = useState(1);
  
  const [documents, setDocuments] = useState<VerificationDocument[]>([
    {
      id: '1',
      type: 'passport',
      status: 'approved',
      uploadedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
      reviewedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
      expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 5),
    },
    {
      id: '2',
      type: 'proof_of_address',
      status: 'pending',
      uploadedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      reviewedDate: null,
      expiryDate: null,
    },
  ]);

  const [personalInfo, setPersonalInfo] = useState({
    fullName: 'John Doe',
    dateOfBirth: '1990-01-15',
    nationality: 'United States',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
  });

  const kycLevels: KYCLevel[] = [
    {
      level: 1,
      name: 'Basic',
      withdrawalLimit: 1000,
      tradingLimit: 5000,
      requirements: ['Email verification', 'Phone verification', 'Basic information'],
      completed: true,
    },
    {
      level: 2,
      name: 'Intermediate',
      withdrawalLimit: 10000,
      tradingLimit: 50000,
      requirements: ['Government-issued ID', 'Proof of address', 'Selfie verification'],
      completed: false,
    },
    {
      level: 3,
      name: 'Advanced',
      withdrawalLimit: 100000,
      tradingLimit: 500000,
      requirements: ['Enhanced due diligence', 'Source of funds', 'Video verification'],
      completed: false,
    },
    {
      level: 4,
      name: 'Professional',
      withdrawalLimit: Infinity,
      tradingLimit: Infinity,
      requirements: ['Business verification', 'Financial statements', 'Institutional approval'],
      completed: false,
    },
  ];

  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<'passport' | 'driver_license' | 'id_card' | 'proof_of_address'>('passport');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingDoc(docType);
    
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newDoc: VerificationDocument = {
      id: Date.now().toString(),
      type: docType as any,
      status: 'pending',
      uploadedDate: new Date(),
      reviewedDate: null,
      expiryDate: null,
    };

    setDocuments(prev => [...prev, newDoc]);
    setUploadingDoc(null);
    setShowUploadModal(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'expired':
        return <AlertCircle className="w-5 h-5 text-orange-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-400 bg-green-600/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-600/20';
      case 'rejected':
        return 'text-red-400 bg-red-600/20';
      case 'expired':
        return 'text-orange-400 bg-orange-600/20';
      default:
        return 'text-slate-400 bg-slate-600/20';
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'passport':
        return 'Passport';
      case 'driver_license':
        return "Driver's License";
      case 'id_card':
        return 'National ID Card';
      case 'proof_of_address':
        return 'Proof of Address';
      default:
        return type;
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString();
  };

  const formatCurrency = (value: number) => {
    if (value === Infinity) return 'Unlimited';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600/20 rounded-xl">
              <UserCheck className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">KYC Verification</h1>
              <p className="text-slate-400">Complete your identity verification to unlock higher limits</p>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-2">Verification Status</h2>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-lg font-medium ${
                  kycStatus === 'completed' ? 'bg-green-600/20 text-green-400' :
                  kycStatus === 'in_progress' ? 'bg-yellow-600/20 text-yellow-400' :
                  kycStatus === 'rejected' ? 'bg-red-600/20 text-red-400' :
                  'bg-slate-600/20 text-slate-400'
                }`}>
                  {kycStatus === 'completed' ? 'Verified' :
                   kycStatus === 'in_progress' ? 'In Progress' :
                   kycStatus === 'rejected' ? 'Rejected' :
                   'Not Started'}
                </span>
                <span className="text-slate-400">Level {currentLevel} / 4</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400 mb-1">Current Limits</div>
              <div className="text-lg font-semibold">
                Withdraw: {formatCurrency(kycLevels[currentLevel - 1].withdrawalLimit)}
              </div>
              <div className="text-sm text-slate-400">
                Trade: {formatCurrency(kycLevels[currentLevel - 1].tradingLimit)}
              </div>
            </div>
          </div>
        </div>

        {/* KYC Levels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kycLevels.map((level) => (
            <div
              key={level.level}
              className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border transition-all ${
                level.completed
                  ? 'border-green-500/50 bg-green-600/10'
                  : level.level === currentLevel
                  ? 'border-blue-500'
                  : 'border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Level {level.level}</div>
                  <h3 className="text-lg font-bold">{level.name}</h3>
                </div>
                {level.completed && <CheckCircle className="w-6 h-6 text-green-400" />}
              </div>

              <div className="space-y-2 mb-4">
                <div className="text-sm">
                  <div className="text-slate-400">Withdraw Limit</div>
                  <div className="font-semibold">{formatCurrency(level.withdrawalLimit)}</div>
                </div>
                <div className="text-sm">
                  <div className="text-slate-400">Trading Limit</div>
                  <div className="font-semibold">{formatCurrency(level.tradingLimit)}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <div className="text-xs text-slate-400 mb-2">Requirements:</div>
                <ul className="space-y-1">
                  {level.requirements.map((req, idx) => (
                    <li key={idx} className="text-xs flex items-center gap-2">
                      <span className="w-1 h-1 bg-blue-400 rounded-full" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Personal Information */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Personal Information</h2>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              Edit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Full Name</label>
              <input
                type="text"
                value={personalInfo.fullName}
                readOnly
                className="w-full px-4 py-3 bg-slate-700 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Date of Birth</label>
              <input
                type="text"
                value={personalInfo.dateOfBirth}
                readOnly
                className="w-full px-4 py-3 bg-slate-700 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Nationality</label>
              <input
                type="text"
                value={personalInfo.nationality}
                readOnly
                className="w-full px-4 py-3 bg-slate-700 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Country</label>
              <input
                type="text"
                value={personalInfo.country}
                readOnly
                className="w-full px-4 py-3 bg-slate-700 rounded-lg outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-400 mb-2">Address</label>
              <input
                type="text"
                value={`${personalInfo.address}, ${personalInfo.city}, ${personalInfo.state} ${personalInfo.zipCode}`}
                readOnly
                className="w-full px-4 py-3 bg-slate-700 rounded-lg outline-none"
              />
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Verification Documents</h2>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Document
            </button>
          </div>

          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-600 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{getDocumentTypeLabel(doc.type)}</h3>
                        {getStatusIcon(doc.status)}
                      </div>
                      <div className="text-sm text-slate-400">
                        Uploaded: {formatDate(doc.uploadedDate)}
                        {doc.reviewedDate && ` • Reviewed: ${formatDate(doc.reviewedDate)}`}
                        {doc.expiryDate && ` • Expires: ${formatDate(doc.expiryDate)}`}
                      </div>
                      {doc.status === 'rejected' && doc.rejectionReason && (
                        <div className="mt-2 p-2 bg-red-600/10 border border-red-600/20 rounded text-sm text-red-400">
                          {doc.rejectionReason}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium capitalize ${getStatusColor(doc.status)}`}>
                    {doc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
              <h3 className="text-xl font-bold mb-4">Upload Document</h3>
              
              <div className="mb-6">
                <label className="block text-sm text-slate-400 mb-2">Document Type</label>
                <select
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value as any)}
                  className="w-full px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="passport">Passport</option>
                  <option value="driver_license">Driver's License</option>
                  <option value="id_card">National ID Card</option>
                  <option value="proof_of_address">Proof of Address</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-slate-400 mb-2">Upload File</label>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload(e, selectedDocType)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Camera className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                    <div className="text-sm text-slate-400">
                      Click to upload or drag and drop
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      PNG, JPG, PDF up to 10MB
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-300">
                    <div className="font-semibold text-blue-400 mb-1">Document Requirements:</div>
                    <ul className="space-y-1 text-xs">
                      <li>• Document must be in color and clearly visible</li>
                      <li>• All four corners must be visible</li>
                      <li>• Document must be valid and not expired</li>
                      <li>• No filters or edits applied</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={uploadingDoc !== null}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  {uploadingDoc ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Information Notice */}
        <div className="bg-blue-600/10 border border-blue-600/20 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-400 mb-2">Your Privacy Matters</h3>
              <p className="text-sm text-slate-300">
                All personal information and documents are encrypted and stored securely in compliance with GDPR, CCPA, and international data protection regulations. We will never share your data with third parties without your explicit consent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
