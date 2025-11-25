
import React, { useState, useEffect } from 'react';
import { Project, Client, ProjectStatus } from '../types';
import Input from './ui/Input';
import Select from './ui/Select';
import TextArea from './ui/TextArea';
import Button from './ui/Button';

interface ProjectFormProps {
  onSave: (project: Project) => void;
  project: Project | null;
  clients: Client[];
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSave, project, clients }) => {
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('Ongoing');
  const [rate, setRate] = useState(0);
  const [rateType, setRateType] = useState<'hourly' | 'fixed'>('hourly');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (project) {
      setName(project.name);
      setClientId(project.clientId);
      setStatus(project.status);
      setRate(project.rate);
      setRateType(project.rateType);
      setDescription(project.description || '');
    } else {
        setName('');
        setClientId(clients[0]?.id || '');
        setStatus('Ongoing');
        setRate(0);
        setRateType('hourly');
        setDescription('');
    }
  }, [project, clients]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !clientId || rate <= 0) {
        alert('Please fill out all fields and ensure rate is positive.');
        return;
    }
    onSave({ id: project?.id || '', name, clientId, status, rate, rateType, description });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Project Name" id="project-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      <Select label="Client" id="project-client" value={clientId} onChange={(e) => setClientId(e.target.value)} required>
        {clients.map(client => (
          <option key={client.id} value={client.id}>{client.name}</option>
        ))}
      </Select>
      <TextArea label="Description" id="project-desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Project details, goals, or notes..." />
      <Select label="Status" id="project-status" value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)}>
        <option>Ongoing</option>
        <option>Completed</option>
        <option>Paused</option>
      </Select>
      <div className="flex gap-4">
        <div className="flex-grow">
          <Input label="Rate" id="project-rate" type="number" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} required />
        </div>
        <div className="w-1/3">
          <Select label="Type" id="project-rate-type" value={rateType} onChange={(e) => setRateType(e.target.value as 'hourly' | 'fixed')}>
            <option value="hourly">Hourly</option>
            <option value="fixed">Fixed</option>
          </Select>
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit">Save Project</Button>
      </div>
    </form>
  );
};

export default ProjectForm;