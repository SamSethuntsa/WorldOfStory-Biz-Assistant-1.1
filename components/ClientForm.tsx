
import React, { useState, useEffect } from 'react';
import { Client } from '../types';
import Input from './ui/Input';
import Button from './ui/Button';

interface ClientFormProps {
  onSave: (client: Client) => void;
  client: Client | null;
}

const ClientForm: React.FC<ClientFormProps> = ({ onSave, client }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (client) {
      setName(client.name);
      setEmail(client.email);
      setPhone(client.phone || '');
    } else {
        setName('');
        setEmail('');
        setPhone('');
    }
  }, [client]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Name and Email are required.');
      return;
    }
    onSave({ id: client?.id || '', name, email, phone });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Name" id="client-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input label="Email" id="client-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input label="Phone (Optional)" id="client-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <div className="flex justify-end pt-2">
        <Button type="submit">Save Client</Button>
      </div>
    </form>
  );
};

export default ClientForm;
