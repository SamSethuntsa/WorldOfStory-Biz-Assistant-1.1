
import type { ReactElement } from 'react';

export enum View {
  Dashboard = 'DASHBOARD',
  Clients = 'CLIENTS',
  Projects = 'PROJECTS',
  Transactions = 'TRANSACTIONS',
  Assistant = 'ASSISTANT',
  Tax = 'TAX',
  Reviews = 'REVIEWS',
  Community = 'COMMUNITY',
  Settings = 'SETTINGS',
}

export interface BusinessProfile {
  name: string;
  logo?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export type ProjectStatus = 'Ongoing' | 'Completed' | 'Paused';

export interface Project {
  id: string;
  name: string;
  clientId: string;
  status: ProjectStatus;
  rate: number;
  rateType: 'hourly' | 'fixed';
  description?: string;
}

export type TransactionType = 'revenue' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  projectId?: string; // for revenue
  categoryId?: string; // for expenses
}

export interface ExpenseCategory {
  id: string;
  name: string;
  // FIX: Use ReactElement instead of JSX.Element to fix missing JSX namespace error.
  icon: ReactElement;
}

export interface QuoteResponse {
  projectName: string;
  projectBrief: string;
  scopeOfWork: string[];
  deliverables: string[];
  estimatedTimeline: string;
  pricing: {
      breakdown: { item: string; cost: number }[];
      total: number;
  };
  notes: string;
}

export interface AppData {
    profile: BusinessProfile;
    clients: Client[];
    projects: Project[];
    transactions: Transaction[];
    exportDate: string;
}

export interface ReviewPlatform {
    id: string;
    name: string;
    url: string;
    isActive: boolean;
}

export interface CommunityPost {
    id: string;
    author: string;
    role: string;
    content: string;
    timestamp: string;
    isUser: boolean;
}
