
import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { Project, Transaction, Client } from '../types';
import Card from './ui/Card';
import { ICONS } from '../constants';

interface DashboardProps {
  projects: Project[];
  transactions: Transaction[];
  clients: Client[];
}

const Dashboard: React.FC<DashboardProps> = ({ projects, transactions, clients }) => {
    const TAX_RATE = 0.25; // 25% provisional tax estimate

    const stats = useMemo(() => {
        const totalRevenue = transactions
        .filter((t) => t.type === 'revenue')
        .reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
        const netProfit = totalRevenue - totalExpenses;
        const activeProjects = projects.filter((p) => p.status === 'Ongoing').length;
        const taxEstimate = totalRevenue * TAX_RATE;
        return { totalRevenue, totalExpenses, netProfit, activeProjects, totalClients: clients.length, taxEstimate };
    }, [projects, transactions, clients]);

  const chartData = useMemo(() => {
    const monthlyData: { [key: string]: { month: string; revenue: number; expenses: number } } = {};
    
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!monthlyData[month]) {
        monthlyData[month] = { month, revenue: 0, expenses: 0 };
      }
      if (t.type === 'revenue') {
        monthlyData[month].revenue += t.amount;
      } else {
        monthlyData[month].expenses += t.amount;
      }
    });

    const sortedData = Object.values(monthlyData).sort((a,b) => {
        const dateA = new Date(`01 ${a.month.replace("'", " ")}`);
        const dateB = new Date(`01 ${b.month.replace("'", " ")}`);
        return dateA.getTime() - dateB.getTime();
    });

    return sortedData;
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount);
  };

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Biz Assistant</h1>
            <h2 className="text-4xl font-bold text-white tracking-tight">Dashboard</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={ICONS.REVENUE} color="text-white" />
            <Card title="Total Expenses" value={formatCurrency(stats.totalExpenses)} icon={ICONS.EXPENSE} color="text-gray-400" />
            <Card title="Net Profit" value={formatCurrency(stats.netProfit)} icon={ICONS.PROFIT} color="text-white"/>
            <Card title="Active Projects" value={stats.activeProjects.toString()} icon={ICONS.PROJECTS_ACTIVE} />
            <Card title="Total Clients" value={stats.totalClients.toString()} icon={ICONS.USERS} />
            <Card title="Tax Estimate" value={formatCurrency(stats.taxEstimate)} icon={ICONS.EXPENSE} color="text-gray-400" details={`Estimated amount to set aside (${(TAX_RATE * 100)}%)`} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Financial Overview</h3>
          <div className="bg-surface p-4 rounded-xl shadow-lg h-96">
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="month" stroke="#A0AEC0" axisLine={false} tickLine={false} />
                        <YAxis stroke="#A0AEC0" axisLine={false} tickLine={false} tickFormatter={(value) => `R${value/1000}k`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0D0D0D', border: '1px solid #2D3748', borderRadius: '0.5rem' }}
                            labelStyle={{ color: '#E2E8F0' }}
                            formatter={(value: number) => formatCurrency(value)}
                            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                        />
                        <Legend wrapperStyle={{ color: '#E2E8F0' }} />
                        <Bar dataKey="revenue" fill="#FFFFFF" name="Revenue" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expenses" fill="#525252" name="Expenses" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                    No transaction data available to display chart.
                </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default Dashboard;
