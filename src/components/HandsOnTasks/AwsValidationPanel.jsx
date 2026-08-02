import React, { useEffect, useState } from 'react';
import { useTask } from '../../context/TaskContext';
import {
  getRequiredPermissionsForTask,
  validateTaskResource,
  validateResourceInputFormat
} from '../../services/awsConnectionService';
import { getValidationContractsForTask } from '../../data/taskValidationRegistry';
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Info,
  Lock,
  Database
} from 'lucide-react';

export const AwsValidationUnavailable = ({ task }) => (
  <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl backdrop-blur-xl">
    <div className="flex items-start gap-3">
      <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-slate-200">AWS Resource Verification</h3>
        <p className="text-xs text-slate-400">Live validation is not yet available for this lab.</p>
        {task?.service && <p className="text-[11px] text-slate-500">{task.service}</p>}
      </div>
    </div>
  </div>
);

export const AwsValidationPanel = ({ task }) => {
  const { awsConnection, connectionStatus, openAwsSetup } = useTask();

  const [resourceInput, setResourceInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  const contracts = getValidationContractsForTask(task);

  // TaskGuide can remain mounted while activeTask changes. Never retain a
  // previous lab's resource identifier or validation output.
  useEffect(() => {
    setResourceInput('');
    setValidationResult(null);
    setIsValidating(false);
  }, [task?.id]);

  if (!task) return null;
  if (contracts.length === 0) return <AwsValidationUnavailable task={task} />;

  const reqPermissions = getRequiredPermissionsForTask(task);
  const primaryContract = contracts[0];

  const isConnected = awsConnection && awsConnection.status === 'connected' && awsConnection.backendVerified;
  const isSimulation = !awsConnection || awsConnection.status === 'simulation' || !awsConnection.backendVerified;

  // Determine resource input label and placeholder based on contract descriptor
  const getResourceInputConfig = () => {
    const key = primaryContract.resourceInput || 'resourceId';
    switch (key) {
      case 'bucketName':
        return {
          label: 'Target S3 Bucket Name',
          placeholder: 'e.g. my-study-bucket-123',
          required: true,
          hint: 'Enter the exact name of the S3 bucket created in this lab step.'
        };
      case 'instanceId':
        return {
          label: 'EC2 Instance ID',
          placeholder: 'e.g. i-0123456789abcdef0',
          required: true,
          hint: 'Enter the EC2 Instance ID created or launched in this lab.'
        };
      case 'vpcId':
        return {
          label: 'Amazon VPC ID',
          placeholder: 'e.g. vpc-0123456789abcdef0',
          required: true,
          hint: 'Enter the VPC ID created or inspected in this lab step.'
        };
      case 'groupId':
        return {
          label: 'Security Group ID',
          placeholder: 'e.g. sg-0123456789abcdef0',
          required: true,
          hint: 'Enter the Security Group ID created for this lab step.'
        };
      case 'dbInstanceIdentifier':
        return {
          label: 'RDS DB Instance Identifier',
          placeholder: 'e.g. my-rds-database',
          required: true,
          hint: 'Enter the DB Instance Identifier created in Amazon RDS.'
        };
      case 'tableName':
        return {
          label: 'DynamoDB Table Name',
          placeholder: 'e.g. MyDynamoTable',
          required: true,
          hint: 'Enter the exact DynamoDB Table Name created for this task.'
        };
      case 'roleName':
        return {
          label: 'IAM Role Name',
          placeholder: 'e.g. StudyTrackerHandsOnRole',
          required: true,
          hint: 'Enter the IAM Role name created or assigned in this lab.'
        };
      case 'alarmName':
        return {
          label: 'CloudWatch Alarm Name',
          placeholder: 'e.g. HighCpuAlarm',
          required: true,
          hint: 'Enter the CloudWatch Alarm name configured for this task.'
        };
      default:
        return {
          label: 'Target Resource Identifier',
          placeholder: 'Enter resource name or ID',
          required: false,
          hint: 'Enter the resource identifier created in AWS for validation.'
        };
    }
  };

  const inputConfig = getResourceInputConfig();
  const isInputValid = validateResourceInputFormat(primaryContract.type, resourceInput);
  const isInputRequiredAndMissing = inputConfig.required && !resourceInput.trim();

  const canValidate = isConnected && !isInputRequiredAndMissing && isInputValid;

  const handleRunValidation = async () => {
    if (isInputRequiredAndMissing) {
      alert(`Please enter the ${inputConfig.label} before validating.`);
      return;
    }
    setIsValidating(true);
    const res = await validateTaskResource(task, awsConnection, resourceInput.trim());
    setValidationResult(res);
    setIsValidating(false);
  };

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-950 text-indigo-300 text-[11px] font-bold border border-indigo-800/60 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              AWS Resource Verification
            </span>
            <span className="text-xs text-slate-400 font-semibold">{task.service}</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100">Read-Only Lab Step Validation</h3>
        </div>

        {awsConnection ? (
          <div className="flex items-center gap-2">
            {isConnected ? (
              <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Connected (Live STS)
              </span>
            ) : isSimulation ? (
              <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                Simulation Mode
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-bold flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                Disconnected
              </span>
            )}
            <button
              onClick={openAwsSetup}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2"
            >
              Settings
            </button>
          </div>
        ) : (
          <button
            onClick={openAwsSetup}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Connect AWS Account</span>
          </button>
        )}
      </div>

      {/* Disconnected / Simulation Warning Banners */}
      {!awsConnection && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200 leading-relaxed flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Connect your AWS account to run live automated validation for this lab task.</span>
          </div>
          <button
            type="button"
            onClick={openAwsSetup}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shrink-0 transition-all"
          >
            Setup Connection
          </button>
        </div>
      )}

      {/* Dynamic Resource Identifier Input Field */}
      <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
        <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-400" />
          <span>{inputConfig.label}</span>
          {inputConfig.required && <span className="text-rose-400">*</span>}
        </label>
        <input
          type="text"
          value={resourceInput}
          onChange={(e) => setResourceInput(e.target.value)}
          placeholder={inputConfig.placeholder}
          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
        />
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>{inputConfig.hint}</span>
          {resourceInput.trim().length > 0 && (
            isInputValid ? (
              <span className="text-emerald-400 font-semibold">Valid format</span>
            ) : (
              <span className="text-rose-400 font-semibold">Invalid format</span>
            )
          )}
        </div>
      </div>

      {/* Required AWS Read-Only Permissions Badges */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
          Required AWS Read-Only Permissions
        </label>
        <div className="flex flex-wrap gap-2">
          {reqPermissions.map((perm) => (
            <span
              key={perm}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-indigo-300"
            >
              {perm}
            </span>
          ))}
        </div>
      </div>

      {/* Validation Trigger Button & Validation Warnings */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={isValidating || (!canValidate && !isSimulation)}
            onClick={handleRunValidation}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isValidating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-indigo-200" />}
            <span>{isValidating ? 'Validating Resources...' : 'Validate This Step'}</span>
          </button>
        </div>

        {isInputRequiredAndMissing && isConnected && (
          <p className="text-xs text-rose-400 font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Enter the {inputConfig.label} above before validating this step.</span>
          </p>
        )}
      </div>

      {/* Validation Results Output List */}
      {validationResult && (
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Validation Output & Checks
            </h4>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
              validationResult.isSimulation
                ? 'bg-amber-950 text-amber-300 border-amber-800'
                : (validationResult.status === 'live_passed' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-rose-950 text-rose-300 border-rose-800')
            }`}>
              {validationResult.isSimulation ? 'Simulation Checked' : (validationResult.status === 'live_passed' ? 'Live AWS Verified ✓' : 'Live AWS Failed')}
            </span>
          </div>

          <p className="text-xs text-slate-300">{validationResult.message}</p>

          <div className="space-y-2">
            {validationResult.results.map((res) => (
              <div
                key={res.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3 text-xs"
              >
                {res.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="font-semibold text-slate-200">{res.text}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{res.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
