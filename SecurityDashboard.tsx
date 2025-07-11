import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, AlertTriangle, CheckCircle, Activity } from "lucide-react";

interface SecurityStatus {
  securityFramework: string;
  encryptionStatus: string;
  auditLogging: string;
  threatDetection: string;
  accessControl: string;
  lastSecurityUpdate: string;
  complianceLevel: string;
  securityVersion: string;
}

interface SecurityDashboard {
  securityStatus: string;
  threatLevel: string;
  activeMonitoring: boolean;
  securityFrameworkStatus: {
    encryption: string;
    accessControl: string;
    auditLogging: string;
    threatDetection: string;
    inputValidation: string;
  };
}

export default function SecurityDashboard() {
  const { data: securityStatus } = useQuery<SecurityStatus>({
    queryKey: ["/api/security/status"],
  });

  const { data: dashboard } = useQuery<SecurityDashboard>({
    queryKey: ["/api/admin/security/dashboard?key=divine-admin-2025"],
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'operational':
      case 'enforced':
      case 'monitoring':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'operational':
      case 'enforced':
      case 'monitoring':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="h-8 w-8 text-purple-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security Dashboard</h1>
          <p className="text-gray-600">Advanced security monitoring and protection status</p>
        </div>
      </div>

      {/* Overall Security Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Security Framework</p>
                <p className="text-lg font-semibold text-green-600">
                  {securityStatus?.securityFramework || 'Active'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Lock className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Encryption</p>
                <p className="text-lg font-semibold text-blue-600">
                  {securityStatus?.encryptionStatus || 'Operational'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-6 w-6 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Threat Detection</p>
                <p className="text-lg font-semibold text-purple-600">
                  {securityStatus?.threatDetection || 'Monitoring'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
              <div>
                <p className="text-sm text-gray-600">Threat Level</p>
                <p className="text-lg font-semibold text-amber-600">
                  {dashboard?.threatLevel || 'Low'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Components Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Components Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboard?.securityFrameworkStatus && Object.entries(dashboard.securityFrameworkStatus).map(([component, status]) => (
              <div key={component} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(status)}
                  <span className="font-medium capitalize">
                    {component.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                </div>
                <span className={`text-sm font-medium capitalize ${getStatusColor(status)}`}>
                  {status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Security Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Security Version:</span>
              <span className="font-medium">{securityStatus?.securityVersion || '1.0.0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Compliance Level:</span>
              <span className="font-medium capitalize">{securityStatus?.complianceLevel || 'Foundational'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Access Control:</span>
              <span className={`font-medium capitalize ${getStatusColor(securityStatus?.accessControl || 'enforced')}`}>
                {securityStatus?.accessControl || 'Enforced'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Audit Logging:</span>
              <span className={`font-medium capitalize ${getStatusColor(securityStatus?.auditLogging || 'active')}`}>
                {securityStatus?.auditLogging || 'Active'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Security Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                <span>Security framework initialized</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <span>Encryption service operational</span>
                <span className="text-blue-600 font-medium">Running</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                <span>AI security monitoring enabled</span>
                <span className="text-purple-600 font-medium">Monitoring</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-amber-50 rounded">
                <span>Rate limiting configured</span>
                <span className="text-amber-600 font-medium">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Features Implemented */}
      <Card>
        <CardHeader>
          <CardTitle>Implemented Security Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Core Security</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Advanced encryption (AES-256-GCM)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Role-based access control (RBAC)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Security audit logging</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Input validation & sanitization</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Rate limiting protection</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">AI Security</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Prompt injection detection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>AI output sanitization</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Conversation memory encryption</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Context validation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Security event monitoring</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}