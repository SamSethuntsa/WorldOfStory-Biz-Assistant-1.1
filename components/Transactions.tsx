
import React, { useState } from 'react';
import { Transaction, Project } from '../types';
import { EXPENSE_CATEGORIES, ICONS } from '../constants';
import Modal from './ui/Modal';
import Button from './ui/Button';
import TransactionForm from './TransactionForm';

interface TransactionsProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  projects: Project[];
  clientMap: Map<string, string>;
  projectMap: Map<string, string>;
}

const Transactions: React.FC<TransactionsProps> = ({ transactions, setTransactions, projects, clientMap, projectMap }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const categoryMap = new Map(EXPENSE_CATEGORIES.map(c => [c.id, c]));

  const handleAdd = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if(window.confirm('Are you sure you want to delete this transaction?')) {
        setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const handleSave = (transaction: Transaction) => {
    if (editingTransaction) {
      setTransactions(transactions.map(t => t.id === transaction.id ? transaction : t));
    } else {
      setTransactions([...transactions, { ...transaction, id: crypto.randomUUID() }]);
    }
    setIsModalOpen(false);
  };

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Transactions</h2>
        <Button onClick={handleAdd}>
            <span className="hidden md:inline">Add Transaction</span>
            <span className="md:hidden">+ Add</span>
        </Button>
      </div>

      <div className="bg-surface rounded-xl shadow-lg overflow-hidden">
        {sortedTransactions.length > 0 ? (
          <ul className="divide-y divide-gray-700/50">
            {sortedTransactions.map(t => (
              <li key={t.id} className="px-4 md:px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center hover:bg-gray-800/50 transition duration-150 gap-4">
                <div className="flex items-start space-x-4">
                    {t.type === 'expense' && t.categoryId && (
                        <div className="hidden sm:block text-gray-400 bg-gray-800 p-2 rounded-lg">
                            {categoryMap.get(t.categoryId)?.icon}
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-white text-base md:text-lg">{t.description}</p>
                        <div className="flex flex-wrap gap-2 text-sm mt-1">
                            <span className="text-gray-400">{new Date(t.date).toLocaleDateString('en-ZA')}</span>
                            <span className="text-gray-600 hidden sm:inline">•</span>
                            {t.type === 'revenue' && t.projectId && (
                                <span className="text-white">{projectMap.get(t.projectId) || 'Unknown Project'}</span>
                            )}
                            {t.type === 'expense' && t.categoryId && (
                                <span className="text-gray-400">{categoryMap.get(t.categoryId)?.name || 'Uncategorized'}</span>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t border-gray-700/50 sm:border-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                    <p className={`font-semibold text-lg ${t.type === 'revenue' ? 'text-white' : 'text-gray-500'}`}>
                        {t.type === 'revenue' ? '+' : '-'}R{t.amount.toFixed(2)}
                    </p>
                    <div className="flex space-x-2 mt-0 sm:mt-2">
                      <Button variant="secondary" size="sm" onClick={() => handleEdit(t)} className="text-xs">Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(t.id)} className="text-xs">Delete</Button>
                    </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
            <div className="text-center py-16 px-4">
                {React.cloneElement(ICONS.ARROWS, {className: "mx-auto h-12 w-12 text-gray-500"})}
                <h3 className="mt-2 text-lg font-medium text-white">No transactions yet</h3>
                <p className="mt-1 text-sm text-gray-500">Add your first transaction to get started!</p>
            </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}>
        <TransactionForm onSave={handleSave} transaction={editingTransaction} projects={projects} />
      </Modal>
    </div>
  );
};

export default Transactions;