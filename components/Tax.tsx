
import React, { useMemo } from 'react';
import { Transaction } from '../types';
import Card from './ui/Card';
import { ICONS } from '../constants';

interface TaxProps {
    transactions: Transaction[];
}

// 2025 Tax Tables for Individuals (South Africa)
const TAX_BRACKETS_2025 = [
    { threshold: 237100, rate: 0.18, base: 0 },
    { threshold: 370500, rate: 0.26, base: 42678, prevThreshold: 237100 },
    { threshold: 512800, rate: 0.31, base: 77362, prevThreshold: 370500 },
    { threshold: 673000, rate: 0.36, base: 121475, prevThreshold: 512800 },
    { threshold: 857900, rate: 0.39, base: 179147, prevThreshold: 673000 },
    { threshold: 1817000, rate: 0.41, base: 251258, prevThreshold: 857900 },
    { threshold: Infinity, rate: 0.45, base: 644489, prevThreshold: 1817000 },
];

const PRIMARY_REBATE_2025 = 17235;
const TAX_THRESHOLD_UNDER_65 = 95750;
const VAT_THRESHOLD = 1000000;

const Tax: React.FC<TaxProps> = ({ transactions }) => {

    const stats = useMemo(() => {
        const totalRevenue = transactions
            .filter((t) => t.type === 'revenue')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpenses = transactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const taxableIncome = Math.max(0, totalRevenue - totalExpenses);

        // Calculate Income Tax based on progressive tables
        let grossTax = 0;
        let bracketApplied = null;

        for (const bracket of TAX_BRACKETS_2025) {
            if (taxableIncome <= bracket.threshold) {
                // This is the bracket
                const amountAbove = taxableIncome - (bracket.prevThreshold || 0);
                grossTax = bracket.base + (amountAbove * bracket.rate);
                bracketApplied = bracket;
                break;
            } else if (bracket.threshold === Infinity) {
                 // Top bracket
                 const amountAbove = taxableIncome - bracket.prevThreshold!;
                 grossTax = bracket.base + (amountAbove * bracket.rate);
                 bracketApplied = bracket;
            }
        }

        const netTax = Math.max(0, grossTax - PRIMARY_REBATE_2025);
        const effectiveRate = taxableIncome > 0 ? (netTax / taxableIncome) * 100 : 0;
        const vatPercentage = Math.min(100, (totalRevenue / VAT_THRESHOLD) * 100);

        return {
            totalRevenue,
            totalExpenses,
            taxableIncome,
            netTax,
            effectiveRate,
            vatPercentage,
            bracketApplied
        };
    }, [transactions]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <h2 className="text-4xl font-bold text-white tracking-tight">Tax Estimator <span className="text-gray-400 text-xl font-normal align-middle ml-2">(SA 2025 Tax Year)</span></h2>
                <div className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 text-sm max-w-md mt-4 md:mt-0">
                    <strong>Disclaimer:</strong> This is a rough estimation for sole proprietors based on the 2025 tax tables. Consult a registered tax practitioner for accurate filings.
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Gross Income" value={formatCurrency(stats.totalRevenue)} icon={ICONS.REVENUE} color="text-white" />
                <Card title="Allowable Deductions" value={formatCurrency(stats.totalExpenses)} icon={ICONS.EXPENSE} color="text-gray-400" />
                <Card title="Taxable Income" value={formatCurrency(stats.taxableIncome)} icon={ICONS.PROFIT} color="text-white" />
                <Card title="Estimated Tax Payable" value={formatCurrency(stats.netTax)} icon={ICONS.EXPENSE} color="text-gray-400" details={`Effective Rate: ${stats.effectiveRate.toFixed(1)}%`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Provisional Tax Section */}
                <div className="lg:col-span-2 bg-surface p-6 rounded-xl shadow-lg border border-gray-800">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        <span className="bg-white text-black p-2 rounded-lg mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                        </span>
                        Provisional Tax Breakdown
                    </h3>
                    <p className="text-gray-400 text-sm mb-6">
                        As a freelancer/sole proprietor, you are likely a provisional taxpayer. You must split your estimated annual tax into two payments to SARS to avoid penalties.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-background p-4 rounded-lg border border-gray-700">
                            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">1st Period (Due August)</span>
                            <div className="mt-2 text-2xl font-bold text-white">{formatCurrency(stats.netTax / 2)}</div>
                            <div className="text-sm text-gray-500 mt-1">50% of estimated liability</div>
                        </div>
                        <div className="bg-background p-4 rounded-lg border border-gray-700">
                            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">2nd Period (Due February)</span>
                            <div className="mt-2 text-2xl font-bold text-white">{formatCurrency(stats.netTax / 2)}</div>
                            <div className="text-sm text-gray-500 mt-1">Balance of liability</div>
                        </div>
                    </div>
                </div>

                {/* VAT Threshold Monitor */}
                <div className="bg-surface p-6 rounded-xl shadow-lg border border-gray-800">
                     <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        <span className="bg-gray-800 text-gray-300 p-2 rounded-lg mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 8.586 15.586 4H12z" clipRule="evenodd" /></svg>
                        </span>
                        VAT Monitor
                    </h3>
                    <p className="text-gray-400 text-sm mb-6">
                        Compulsory VAT registration is required if your turnover exceeds R1 million in any 12-month period.
                    </p>
                    
                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <div>
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-black bg-white">
                                    Turnover
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-white">
                                    {stats.vatPercentage.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                            <div style={{ width: `${stats.vatPercentage}%` }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${stats.totalRevenue > VAT_THRESHOLD ? 'bg-white' : 'bg-gray-400'}`}></div>
                        </div>
                        <p className="text-sm text-gray-300">
                            Current: <span className="text-white font-mono">{formatCurrency(stats.totalRevenue)}</span> / <span className="text-gray-500">R1 000 000</span>
                        </p>
                        {stats.totalRevenue > VAT_THRESHOLD && (
                            <p className="text-white text-xs mt-2 font-bold bg-gray-800 p-2 rounded">You have exceeded the threshold. You must register for VAT.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Reference Table */}
            <div className="bg-surface rounded-xl shadow-lg border border-gray-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700 bg-gray-800/50">
                    <h3 className="text-lg font-bold text-white">2025 Tax Rates (Individuals)</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                        <thead className="uppercase tracking-wider border-b border-gray-700 bg-gray-800 text-gray-400">
                            <tr>
                                <th className="px-6 py-3">Taxable Income (R)</th>
                                <th className="px-6 py-3">Rates of Tax (R)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            <tr className="hover:bg-gray-800/30">
                                <td className="px-6 py-4 text-gray-300">1 – 237 100</td>
                                <td className="px-6 py-4 text-gray-400">18% of taxable income</td>
                            </tr>
                            <tr className="hover:bg-gray-800/30">
                                <td className="px-6 py-4 text-gray-300">237 101 – 370 500</td>
                                <td className="px-6 py-4 text-gray-400">42 678 + 26% of taxable income above 237 100</td>
                            </tr>
                            <tr className="hover:bg-gray-800/30">
                                <td className="px-6 py-4 text-gray-300">370 501 – 512 800</td>
                                <td className="px-6 py-4 text-gray-400">77 362 + 31% of taxable income above 370 500</td>
                            </tr>
                            <tr className="hover:bg-gray-800/30">
                                <td className="px-6 py-4 text-gray-300">512 801 – 673 000</td>
                                <td className="px-6 py-4 text-gray-400">121 475 + 36% of taxable income above 512 800</td>
                            </tr>
                            <tr className="hover:bg-gray-800/30">
                                <td className="px-6 py-4 text-gray-300">673 001 – 857 900</td>
                                <td className="px-6 py-4 text-gray-400">179 147 + 39% of taxable income above 673 000</td>
                            </tr>
                            <tr className="hover:bg-gray-800/30">
                                <td className="px-6 py-4 text-gray-300">857 901 – 1 817 000</td>
                                <td className="px-6 py-4 text-gray-400">251 258 + 41% of taxable income above 857 900</td>
                            </tr>
                            <tr className="hover:bg-gray-800/30">
                                <td className="px-6 py-4 text-gray-300">1 817 001 and above</td>
                                <td className="px-6 py-4 text-gray-400">644 489 + 45% of taxable income above 1 817 000</td>
                            </tr>
                        </tbody>
                        <tfoot className="bg-gray-800/50">
                            <tr>
                                <td className="px-6 py-3 text-gray-500 italic" colSpan={2}>
                                    * Primary Rebate: R17 235 (deducted from tax payable) | Tax Threshold: R95 750
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Tax;