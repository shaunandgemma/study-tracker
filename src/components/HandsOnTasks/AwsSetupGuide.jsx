import React, { useState } from 'react';
import { useTask } from '../../context/TaskContext';
import { generateCloudFormationTemplate, DEFAULT_BACKEND_ACCOUNT_ID } from '../../data/cloudFormationTemplate';
import {
  validateRoleArnFormat,
  validateAccountIdFormat,
  generateExternalId
} from '../../services/awsConnectionService';
import {
  ArrowLeft,
  ShieldCheck,
  KeyRound,
  Copy,
  Check,
  AlertTriangle,
  Zap,
  Info,
  Server,
  Trash2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Lock,
  LogIn
} from 'lucide-react';

export const AwsSetupGuide = () => {
  const {
    awsConnection,
    connectionStatus,
    testConnectionResult,
    closeAwsSetup,
    testAwsConnection,
    saveAwsConnection,
    disconnectAwsConnection,
    regenerateAwsExternalId,
    currentUser,
    openAuthModal
  } = useTask();

  // Form states synchronized with persisted awsConnection
  const [accountId, setAccountId] = useState('');
  const [roleArn, setRoleArn] = useState('');
  const [externalId, setExternalId] = useState('');

  // Sync local form state with stored connection record
  React.useEffect(() => {
    if (awsConnection) {
      setAccountId(awsConnection.awsAccountId || '');
      setRoleArn(awsConnection.roleArn || '');
      setExternalId(awsConnection.externalId || '');
    } else {
      setAccountId('');
      setRoleArn('');
      setExternalId('');
    }
  }, [awsConnection]);

  // UI interaction states
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [copiedExtId, setCopiedExtId] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // Derive format validity
  const isAccountIdValid = validateAccountIdFormat(accountId);
  const isRoleArnValid = validateRoleArnFormat(roleArn);

  // Generate CFN template text with current externalId and backend account 406760143388
  const cfnTemplateText = generateCloudFormationTemplate(externalId, DEFAULT_BACKEND_ACCOUNT_ID);

  const handleRegenerateExternalId = async () => {
    if (!currentUser) {
      openAuthModal('aws-setup');
      return;
    }

    const confirmed = window.confirm(
      "Warning: Regenerating your External ID will break your existing AWS IAM Role trust policy.\n\n" +
      "You must update your CloudFormation stack parameters in the AWS Console with the new External ID before testing your connection again.\n\n" +
      "Your AWS connection will be marked as disconnected until re-tested.\n\n" +
      "Do you want to proceed?"
    );

    if (!confirmed) return;

    setIsTesting(true);
    const res = await regenerateAwsExternalId({ accountId, roleArn });
    setIsTesting(false);

    if (res.success && res.data?.externalId) {
      setExternalId(res.data.externalId);
    } else if (!res.success) {
      alert(res.error || 'Failed to regenerate External ID.');
    }
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(cfnTemplateText);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2500);
  };

  const handleCopyExtId = () => {
    navigator.clipboard.writeText(externalId);
    setCopiedExtId(true);
    setTimeout(() => setCopiedExtId(false), 2000);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    await testAwsConnection({ accountId, roleArn, externalId });
    setIsTesting(false);
  };

  const handleSaveConnection = async () => {
    setIsTesting(true);
    const res = await saveAwsConnection({ accountId, roleArn, externalId });
    setIsTesting(false);
    if (!res.success) {
      alert(res.error || 'Failed to save connection.');
    }
  };

  const handleDisconnect = () => {
    if (window.confirm('Are you sure you want to disconnect your AWS account configuration? This will remove your connection record from Study Tracker.')) {
      disconnectAwsConnection();
      setAccountId('');
      setRoleArn('');
      setExternalId(generateExternalId());
    }
  };

  // Status badge styling helper
  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs font-bold shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Connected (Backend Verified)</span>
          </div>
        );
      case 'simulation':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/80 border border-amber-700 text-amber-300 text-xs font-bold shadow-sm">
            <Info className="w-4 h-4 text-amber-400" />
            <span>Simulation Mode (Development)</span>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-950/80 border border-rose-700 text-rose-300 text-xs font-bold shadow-sm">
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>Connection Failed</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400 text-xs font-bold shadow-sm">
            <Lock className="w-4 h-4" />
            <span>Not Connected</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={closeAwsSetup}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Labs</span>
        </button>

        {getStatusBadge()}
      </div>

      {/* Hero Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/60 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Secure AWS Integration
            </span>
            <span className="text-xs text-slate-400 font-semibold">Hands-On Labs Verification</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Connect AWS Account — Guided Setup
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            Connect your AWS account via a restricted IAM Role to enable automated read-only verification of your hands-on labs. Follow the step-by-step guide below to launch our pre-configured CloudFormation template.
          </p>
        </div>
      </div>

      {/* Security Warnings & Guarantees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero Permanent Credentials</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            AWS access keys and secret access keys are <strong>never requested from users</strong>. All temporary access is requested securely via AWS STS AssumeRole through Supabase Edge Functions.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold">
            <Lock className="w-4 h-4" />
            <span>Secure Supabase Record Storage</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            AWS credentials are <strong>never stored in the browser</strong>. Your Account ID, Role ARN, External ID, and connection status are stored securely against your authenticated Supabase account protected by Row Level Security.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
            <Zap className="w-4 h-4" />
            <span>Strict Read-Only Role</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The IAM Role grants strictly <strong>read-only inspection permissions</strong> (e.g. <code className="bg-slate-950 px-1 py-0.5 rounded text-emerald-300">s3:ListBucket</code>, <code className="bg-slate-950 px-1 py-0.5 rounded text-emerald-300">ec2:DescribeInstances</code>). The role cannot create, update, or delete any resources in your account.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
            <Info className="w-4 h-4" />
            <span>Your AWS Account & Charges</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Lab resources remain inside your own AWS account. AWS usage charges remain your responsibility, so make sure to complete cleanup steps after each lab task.
          </p>
        </div>
      </div>

      {/* Interactive AWS Connection Form Card */}
      <div className="rounded-3xl bg-slate-900/90 border border-indigo-900/50 p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-indigo-400" />
              AWS Connection Details
            </h2>
            <p className="text-xs text-slate-400">Enter your 12-digit AWS Account ID and created IAM Role ARN to test or save your live connection.</p>
          </div>
          {getStatusBadge()}
        </div>

        {!currentUser && (
          <div className="p-4 rounded-2xl bg-indigo-950/70 border border-indigo-800/80 text-xs flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2 text-indigo-200 font-semibold">
              <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Sign in to Study Tracker before connecting an AWS account.</span>
            </div>
            <button
              type="button"
              onClick={() => openAuthModal('aws-setup')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In to Connect AWS</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AWS Account ID Field */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              AWS Account ID <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              placeholder="123456789012"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
            />
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">12-digit AWS Account ID</span>
              {accountId.length > 0 && (
                isAccountIdValid ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Valid 12 digits
                  </span>
                ) : (
                  <span className="text-rose-400 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Must be 12 digits
                  </span>
                )
              )}
            </div>
          </div>

          {/* External ID Field (UUID) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>External ID (Session UUID)</span>
              <button
                type="button"
                onClick={handleRegenerateExternalId}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-normal flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> Regenerate
              </button>
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={externalId}
                className="w-full px-4 py-2.5 pr-20 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-indigo-300 font-mono focus:outline-none cursor-default"
              />
              <button
                type="button"
                onClick={handleCopyExtId}
                className="absolute right-2 top-1.2 font-semibold text-xs px-2.5 py-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-200 border border-indigo-800/60 transition-all flex items-center gap-1"
              >
                {copiedExtId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedExtId ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Passes to CloudFormation to protect your role trust policy against confused deputy attacks.
            </p>
          </div>

          {/* IAM Role ARN Field */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              IAM Role ARN <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={roleArn}
              onChange={(e) => setRoleArn(e.target.value)}
              placeholder="arn:aws:iam::123456789012:role/StudyTrackerHandsOnRole"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
            />
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Format: arn:aws:iam::ACCOUNT_ID:role/ROLE_NAME</span>
              {roleArn.length > 0 && (
                isRoleArnValid ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Valid IAM Role ARN
                  </span>
                ) : (
                  <span className="text-rose-400 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Invalid ARN format
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Test Result Notice */}
        {testConnectionResult && (
          <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
            testConnectionResult.status === 'connected'
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
              : testConnectionResult.status === 'simulation'
                ? 'bg-amber-950/60 border-amber-800 text-amber-200'
                : 'bg-rose-950/60 border-rose-800 text-rose-200'
          }`}>
            <div className="font-bold flex items-center justify-between gap-2 text-sm">
              <div className="flex items-center gap-2">
                {testConnectionResult.status === 'connected' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {testConnectionResult.status === 'simulation' && <Info className="w-4 h-4 text-amber-400" />}
                {(testConnectionResult.status === 'failed' || testConnectionResult.status === 'auth_required') && <XCircle className="w-4 h-4 text-rose-400" />}
                <span>
                  {testConnectionResult.status === 'connected' && 'STS Backend Connection Verified'}
                  {testConnectionResult.status === 'simulation' && 'Simulation Mode Active'}
                  {testConnectionResult.status === 'auth_required' && 'Authentication Required'}
                  {testConnectionResult.status === 'failed' && 'Validation Error'}
                </span>
              </div>

              {(testConnectionResult.status === 'auth_required' || (testConnectionResult.error && testConnectionResult.error.includes('Sign in'))) && (
                <button
                  type="button"
                  onClick={() => openAuthModal('aws-setup')}
                  className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center gap-1 shadow"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
            <p>{testConnectionResult.message || testConnectionResult.error}</p>
          </div>
        )}

        {/* Form Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={isTesting || !isAccountIdValid || !isRoleArnValid}
              onClick={handleTestConnection}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Server className="w-4 h-4 text-indigo-400" />}
              <span>Test Connection</span>
            </button>

            <button
              type="button"
              disabled={isTesting || !isAccountIdValid || !isRoleArnValid}
              onClick={handleSaveConnection}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Connection</span>
            </button>
          </div>

          {awsConnection && (
            <button
              type="button"
              onClick={handleDisconnect}
              className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 text-xs font-semibold border border-slate-800 hover:border-rose-800 transition-all flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Disconnect AWS Account</span>
            </button>
          )}
        </div>
      </div>

      {/* 10-Step Guided Setup Section */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">
            10-Step Setup Guide & CloudFormation Deployment
          </h2>
          <p className="text-xs text-slate-400">
            Follow these step-by-step instructions to create your restricted IAM Role in AWS and link it to Study Tracker.
          </p>
        </div>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-indigo-950 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-800/60">1</span>
              <h3 className="text-sm font-bold text-slate-200">Sign in to Study Tracker</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-10">
              Ensure you are signed in to Study Tracker. Your AWS Account ID, Role ARN, External ID, and connection status are saved securely against your authenticated Supabase user record.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-indigo-950 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-800/60">2</span>
              <h3 className="text-sm font-bold text-slate-200">Generate or Confirm Unique External ID</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-10">
              Confirm your unique session External ID (UUID) in the form above. This External ID is configured in your role's trust policy to prevent confused deputy attacks.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-indigo-950 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-800/60">3</span>
              <h3 className="text-sm font-bold text-slate-200">Copy Supplied CloudFormation Template</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-10">
              Copy the CloudFormation YAML template below. The template automatically pre-configures the trusted backend account (<code className="bg-slate-950 px-1 py-0.5 rounded text-indigo-300">406760143388</code>) and your External ID.
            </p>

            {/* Template Box */}
            <div className="pl-10 space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">StudyTrackerHandsOnRole.yaml</span>
                <button
                  type="button"
                  onClick={handleCopyTemplate}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTemplate ? 'Template Copied!' : 'Copy CloudFormation Template'}</span>
                </button>
              </div>

              <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-[11px] text-indigo-200 overflow-x-auto max-h-56">
                <pre>{cfnTemplateText}</pre>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-indigo-950 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-800/60">4</span>
              <h3 className="text-sm font-bold text-slate-200">Deploy Stack in Your AWS Account</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-10">
              Open the AWS CloudFormation Console in your AWS account, choose <strong>Create Stack (with new resources)</strong>, select <strong>Upload a template file</strong>, paste or upload the YAML file, and submit the stack creation.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-indigo-950 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-800/60">5</span>
              <h3 className="text-sm font-bold text-slate-200">Wait for CREATE_COMPLETE</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-10">
              Wait approximately 30-60 seconds until the stack status in the CloudFormation Console reaches <code className="text-emerald-400 bg-slate-950 px-1 py-0.5 rounded font-bold">CREATE_COMPLETE</code>.
            </p>
          </div>

          {/* Step 6 */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-indigo-950 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-800/60">6</span>
              <h3 className="text-sm font-bold text-slate-200">Copy the RoleArn Output</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-10">
              Open the stack's <strong>Outputs</strong> tab in the AWS Console and copy the <code className="bg-slate-950 px-1 py-0.5 rounded text-indigo-300">RoleArn</code> value (e.g. <code className="bg-slate-950 px-1 py-0.5 rounded text-indigo-300">arn:aws:iam::123456789012:role/StudyTrackerHandsOnRole</code>).
            </p>
          </div>

          {/* Step 7 */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-indigo-950 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-800/60">7</span>
              <h3 className="text-sm font-bold text-slate-200">Enter AWS Account ID and Role ARN</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-10">
              Enter your 12-digit AWS Account ID and paste your copied <code className="bg-slate-950 px-1 py-0.5 rounded text-indigo-300">RoleArn</code> into the connection details form above.
            </p>
          </div>

          {/* Step 8 */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-indigo-950 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-800/60">8</span>
              <h3 className="text-sm font-bold text-slate-200">Click Test Connection</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-10">
              Click <strong>Test Connection</strong>. The app invokes the backend Supabase Edge Function to perform live STS AssumeRole and GetCallerIdentity verification against your AWS account.
            </p>
          </div>

          {/* Step 9 */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-indigo-950 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-800/60">9</span>
              <h3 className="text-sm font-bold text-slate-200">Save Connection After Successful Test</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-10">
              Once the test completes successfully, click <strong>Save Connection</strong>. Your connection metadata will be saved to your authenticated Supabase record.
            </p>
          </div>

          {/* Step 10 */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-indigo-950 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-800/60">10</span>
              <h3 className="text-sm font-bold text-slate-200">Disconnecting & Stack Deletion</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-10">
              You can disconnect at any time by clicking <strong>Disconnect AWS Account</strong>. To permanently remove the IAM role from your AWS account, simply delete the CloudFormation stack in your AWS Console.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
