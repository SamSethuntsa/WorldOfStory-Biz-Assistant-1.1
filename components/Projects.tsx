
import React, { useState } from 'react';
import { Project, Client, ProjectStatus } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';
import ProjectForm from './ProjectForm';
import { ICONS } from '../constants';

interface ProjectsProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  clients: Client[];
}

const Projects: React.FC<ProjectsProps> = ({ projects, setProjects, clients }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // FIX: Explicitly define Map generics to avoid 'unknown' type inference on values
  const clientMap = new Map<string, string>(clients.map(c => [c.id, c.name]));

  const handleAdd = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if(window.confirm('Are you sure you want to delete this project?')) {
        setProjects(projects.filter(project => project.id !== id));
    }
  };

  const handleSave = (project: Project) => {
    if (editingProject) {
      setProjects(projects.map(p => p.id === project.id ? project : p));
    } else {
      setProjects([...projects, { ...project, id: crypto.randomUUID() }]);
    }
    setIsModalOpen(false);
  };

  const getStatusClasses = (status: ProjectStatus) => {
    switch(status) {
        case 'Ongoing': return 'bg-white text-black border border-white';
        case 'Completed': return 'bg-gray-800 text-gray-300 border border-gray-700';
        case 'Paused': return 'bg-transparent text-gray-500 border border-gray-700 border-dashed';
        default: return 'bg-gray-500/20 text-gray-300';
    }
  }

  const filteredProjects = projects.filter(project => {
    const clientName = clientMap.get(project.clientId) || '';
    const query = searchQuery.toLowerCase();
    return project.name.toLowerCase().includes(query) || (clientName as string).toLowerCase().includes(query);
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-bold text-white tracking-tight">Projects</h2>
        <Button onClick={handleAdd} disabled={clients.length === 0}>{clients.length === 0 ? 'Add a Client First' : 'Add Project'}</Button>
      </div>

      {projects.length > 0 && (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
            </div>
            <input
                type="text"
                placeholder="Search projects by name or client..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg leading-5 bg-surface text-gray-200 placeholder-gray-500 focus:outline-none focus:bg-surface focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      )}

      <div className="bg-surface rounded-xl shadow-lg overflow-hidden">
        {projects.length === 0 ? (
            <div className="text-center py-16 px-4">
                {React.cloneElement(ICONS.BRIEFCASE, {className: "mx-auto h-12 w-12 text-gray-500"})}
                <h3 className="mt-2 text-lg font-medium text-white">No projects yet</h3>
                <p className="mt-1 text-sm text-gray-500">{clients.length > 0 ? 'Add your first project!' : 'You need to add a client before you can add a project.'}</p>
            </div>
        ) : filteredProjects.length > 0 ? (
          <ul className="divide-y divide-gray-700/50">
            {filteredProjects.map(project => (
              <li key={project.id} className="px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-gray-800/50 transition duration-150">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="font-semibold text-lg text-white truncate">{project.name}</p>
                  <p className="text-sm text-gray-400">{clientMap.get(project.clientId) || 'Unknown Client'}</p>
                  {project.description && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2 max-w-xl">{project.description}</p>
                  )}
                  <div className='flex items-center space-x-2 mt-2'>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusClasses(project.status)}`}>{project.status}</span>
                    <span className="text-sm text-gray-400">{`R${project.rate} ${project.rateType === 'fixed' ? 'fixed' : '/hr'}`}</span>
                  </div>
                </div>
                <div className="flex space-x-2 mt-3 md:mt-0 flex-shrink-0">
                  <Button variant="secondary" size="sm" onClick={() => handleEdit(project)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(project.id)}>Delete</Button>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProject ? 'Edit Project' : 'Add Project'}>
        <ProjectForm onSave={handleSave} project={editingProject} clients={clients} />
      </Modal>
    </div>
  );
};

export default Projects;