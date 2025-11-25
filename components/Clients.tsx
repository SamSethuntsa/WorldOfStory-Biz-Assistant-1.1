
import React, { useState } from 'react';
import { Client } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';
import ClientForm from './ClientForm';
import { ICONS } from '../constants';

const Clients: React.FC<{
    clients: Client[];
    setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}> = ({ clients, setClients }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAdd = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if(window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
        setClients(clients.filter(client => client.id !== id));
    }
  };

  const handleSave = (client: Client) => {
    if (editingClient) {
      setClients(clients.map(c => c.id === client.id ? client : c));
    } else {
      setClients([...clients, { ...client, id: crypto.randomUUID() }]);
    }
    setIsModalOpen(false);
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-bold text-white tracking-tight">Clients</h2>
        <Button onClick={handleAdd}>Add Client</Button>
      </div>

      {clients.length > 0 && (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
            </div>
            <input
                type="text"
                placeholder="Search clients by name or email..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg leading-5 bg-surface text-gray-200 placeholder-gray-500 focus:outline-none focus:bg-surface focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      )}

      <div className="bg-surface rounded-xl shadow-lg overflow-hidden">
        {clients.length === 0 ? (
             <div className="text-center py-16 px-4">
                {React.cloneElement(ICONS.USERS, {className: "mx-auto h-12 w-12 text-gray-500"})}
                <h3 className="mt-2 text-lg font-medium text-white">No clients found</h3>
                <p className="mt-1 text-sm text-gray-500">Add your first client to get started!</p>
            </div>
        ) : filteredClients.length > 0 ? (
          <ul className="divide-y divide-gray-700/50">
            {filteredClients.map(client => (
              <li key={client.id} className="px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-gray-800/50 transition duration-150">
                <div>
                  <p className="font-semibold text-lg text-white">{client.name}</p>
                  <p className="text-sm text-gray-400">{client.email}</p>
                  {client.phone && <p className="text-sm text-gray-400">{client.phone}</p>}
                </div>
                <div className="flex space-x-2 mt-3 md:mt-0">
                  <Button variant="secondary" size="sm" onClick={() => handleEdit(client)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(client.id)}>Delete</Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
             <div className="text-center py-12 px-4">
                <svg className="mx-auto h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-white">No matches found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search terms.</p>
            </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingClient ? 'Edit Client' : 'Add Client'}>
        <ClientForm onSave={handleSave} client={editingClient} />
      </Modal>
    </div>
  );
};

export default Clients;
