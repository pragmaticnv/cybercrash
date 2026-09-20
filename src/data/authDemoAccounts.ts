import { AuthUser } from '../types/auth';

export interface DemoAccountEntry {
  user: AuthUser;
  passwords: string[];
  aliases: string[];
  description: string;
}

export const DEMO_ACCOUNTS: DemoAccountEntry[] = [
  {
    user: {
      id: 'USR_LEA_04',
      username: 'lea_officer',
      name: 'Sub-Insp. Amit Salve',
      role: 'LEA',
      roleTitle: 'Law Enforcement Investigator',
      agency: 'Mumbai Police Cyber Crime Cell',
      badgeNumber: 'LEA-MH-4402',
      clearanceLevel: 'CASE INVESTIGATION · TIER 2',
      token: 'mock-jwt-lea-tok-4402',
      authorizedDashboard: '/lea'
    },
    passwords: ['password123', 'lea123', 'demo', 'admin'],
    aliases: ['lea_officer', 'lea_demo', 'lea', 'officer'],
    description: 'LEA Investigator: Access to Case Command, Incident Dossiers & React Flow'
  },
  {
    user: {
      id: 'USR_BANK_05',
      username: 'bank_officer',
      name: 'Varun Grover',
      role: 'BANK',
      roleTitle: 'Senior Bank Fraud Analyst',
      agency: 'HDFC Fraud Monitoring Unit (Bank05)',
      badgeNumber: 'BNK-HDFC-912',
      clearanceLevel: 'TRANSACTION INTELLIGENCE · TIER 2',
      token: 'mock-jwt-bank-tok-912',
      authorizedDashboard: '/bank'
    },
    passwords: ['password123', 'bank123', 'demo', 'admin'],
    aliases: ['bank_officer', 'bank_demo', 'bank_security', 'bank'],
    description: 'Bank Fraud Desk: Access to Alert Feeds, Suspicious Transfers & Mule Liens'
  },
  {
    user: {
      id: 'USR_I4C_01',
      username: 'i4c_analyst',
      name: 'Dr. Sunita Deshmukh',
      role: 'I4C',
      roleTitle: 'National Intelligence Director',
      agency: 'Indian Cyber Crime Coordination Centre (I4C)',
      badgeNumber: 'I4C-NAT-1008',
      clearanceLevel: 'NATIONAL THREAT SURVEILLANCE · TIER 1',
      token: 'mock-jwt-i4c-tok-1008',
      authorizedDashboard: '/i4c'
    },
    passwords: ['password123', 'i4c123', 'demo', 'admin'],
    aliases: ['i4c_analyst', 'i4c_demo', 'i4c_national', 'i4c'],
    description: 'I4C National Command: Access to Theater Map, Hotspots & Interstate Flows'
  },
  {
    user: {
      id: 'USR_ADM_ROOT',
      username: 'admin_sec',
      name: 'Rajesh Varma',
      role: 'ADMIN',
      roleTitle: 'Principal Platform Administrator',
      agency: 'CYBERCRASH Core Operations',
      badgeNumber: 'ADM-ROOT-001',
      clearanceLevel: 'FULL PLATFORM ADMINISTRATION · ROOT',
      token: 'mock-jwt-adm-tok-001',
      authorizedDashboard: '/admin'
    },
    passwords: ['password123', 'admin123', 'demo', 'admin'],
    aliases: ['admin_sec', 'admin_demo', 'admin', 'root'],
    description: 'System Administrator: Access to Model Health, Access Matrix & Audit Logs'
  }
];

export function findDemoAccount(username: string): DemoAccountEntry | undefined {
  const clean = username.trim().toLowerCase();
  return DEMO_ACCOUNTS.find(
    (acc) =>
      acc.user.username.toLowerCase() === clean ||
      acc.aliases.some((alias) => alias.toLowerCase() === clean)
  );
}
