
import React, { useState, useEffect } from 'react';
import { Transaction, Project, TransactionType } from '../types';
import { EXPENSE_CATEGORIES } from '../constants';
import { suggestExpenseCategory } from '../services/geminiService';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';

interface TransactionFormProps {
  onSave: (transaction: Transaction) => void;
  transaction: Transaction | null;
  projects: Project[];
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSave, transaction, projects }) => {
  const [type, setType] = useState<TransactionType>('revenue');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [projectId, setProjectId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setDescription(transaction.description);
      setAmount(transaction.amount);
      setDate(transaction.date);
      setProjectId(transaction.projectId || '');
      setCategoryId(transaction.categoryId || '');
    } else {
        setType('revenue');
        setDescription('');
        setAmount(0);
        setDate(new Date().toISOString().split('T')[0]);
        setProjectId(projects[0]?.id || '');
        setCategoryId(EXPENSE_CATEGORIES[0]?.id || '');
    }
  }, [transaction, projects]);

  const handleSuggestCategory = async () => {
    if (!description) {
        alert("Please enter a description first.");
        return;
    }
    setIsSuggesting(true);
    try {
        const suggestedId = await suggestExpenseCategory(description, EXPENSE_CATEGORIES);
        if (suggestedId) {
            setCategoryId(suggestedId);
        } else {
            alert("Could not suggest a category. Please select one manually.");
        }
    } catch (error) {
        console.error(error);
        alert("An error occurred while suggesting a category.");
    } finally {
        setIsSuggesting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amount <= 0) {
        alert("Description and a positive amount are required.");
        return;
    }
    onSave({
      id: transaction?.id || '',
      type,
      description,
      amount,
      date,
      projectId: type === 'revenue' ? projectId : undefined,
      categoryId: type === 'expense' ? categoryId : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select label="Type" id="transaction-type" value={type} onChange={(e) => setType(e.target.value as TransactionType)}>
        <option value="revenue">Revenue</option>
        <option value="expense">Expense</option>
      </Select>
      <Input label="Description" id="transaction-desc" type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <Input label="Amount" id="transaction-amount" type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} required />
      <Input label="Date" id="transaction-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      
      {type === 'revenue' ? (
        <Select label="Project" id="transaction-project" value={projectId} onChange={(e) => setProjectId(e.target.value)} required>
          {projects.filter(p => p.status === 'Ongoing').map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Select>
      ) : (
        <div>
            <Select label="Category" id="transaction-category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                {EXPENSE_CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </Select>
            <Button type="button" variant="secondary" onClick={handleSuggestCategory} disabled={isSuggesting || !description} className="w-full mt-2">
                {isSuggesting ? 'Thinking...' : '✨ Suggest Category (AI)'}
            </Button>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button type="submit">Save Transaction</Button>
      </div>
    </form>
  );
};

export default TransactionForm;
