import React, { useState, useEffect } from 'react';
import { Opportunity, OpportunityCategory, JobDetails } from '../types';
import { XIcon } from './Icons';
import { COUNTRIES, OPPORTUNITY_TYPES, EDUCATION_LEVELS } from '../constants';
import { useTranslation } from '../contexts/Translation';

interface AdminOpportunityModalProps {
  opportunityToEdit: Opportunity | null;
  onClose: () => void;
  onSave: (opportunity: Omit<Opportunity, 'id' | 'postedDate'> & { id?: number }) => void;
}

const initialFormState = {
  title: '',
  organization: '',
  category: OpportunityCategory.Scholarships,
  description: '',
  deadline: '',
  country: 'Nigeria',
  educationLevel: 'Any',
  link: '#',
  details: undefined,
};

export const AdminOpportunityModal: React.FC<AdminOpportunityModalProps> = ({ opportunityToEdit, onClose, onSave }) => {
  const [formData, setFormData] = useState<Omit<Opportunity, 'id' | 'postedDate'>>(initialFormState);
  const [detailsJson, setDetailsJson] = useState<string>('');
  const { t } = useTranslation();

  useEffect(() => {
    if (opportunityToEdit) {
      // Remove id and postedDate as they are not editable in this form
      const { id, postedDate, ...editableFields } = opportunityToEdit;
      setFormData(editableFields);
      if (opportunityToEdit.details) {
        setDetailsJson(JSON.stringify(opportunityToEdit.details, null, 2));
      } else {
        setDetailsJson('');
      }
    } else {
      setFormData(initialFormState);
      setDetailsJson('');
    }
  }, [opportunityToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDetailsJson(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let detailsObject: JobDetails | undefined = undefined;
    if(detailsJson) {
        try {
            detailsObject = JSON.parse(detailsJson);
        } catch (error) {
            alert('Invalid JSON in Job Details field.');
            return;
        }
    }
    
    const opportunityData = {
      ...formData,
      details: detailsObject,
      id: opportunityToEdit?.id,
    };
    onSave(opportunityData);
  };
  
  const filteredCountries = COUNTRIES.filter(c => !c.startsWith('Region:'));
  const filteredOppTypes = OPPORTUNITY_TYPES.filter(o => o !== 'All');
  const filteredEduLevels = EDUCATION_LEVELS.filter(e => e !== 'All');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-au-green">
            {opportunityToEdit ? t('adminModalEditTitle') : t('adminModalAddTitle')}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField name="title" label="Title" value={formData.title} onChange={handleChange} required />
            <InputField name="organization" label="Organization" value={formData.organization} onChange={handleChange} required />
          </div>
          <TextAreaField name="description" label="Description" value={formData.description} onChange={handleChange} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField name="category" label="Category" value={formData.category} options={filteredOppTypes} onChange={handleChange} />
            <SelectField name="country" label="Country" value={formData.country} options={filteredCountries} onChange={handleChange} />
            <SelectField name="educationLevel" label="Education Level" value={formData.educationLevel} options={filteredEduLevels} onChange={handleChange} />
            <InputField name="deadline" label={t('deadline')} type="date" value={formData.deadline} onChange={handleChange} required />
          </div>
          <InputField name="link" label="Application Link" value={formData.link} onChange={handleChange} required />
          <TextAreaField 
            name="details" 
            label="Job Details (JSON format)" 
            value={detailsJson} 
            onChange={handleDetailsChange}
            rows={8}
            placeholder='e.g., { "purpose": "...", "mainFunctions": ["..."] }'
           />
           <div className="p-4 bg-gray-50 border-t flex justify-end items-center">
            <button type="button" onClick={onClose} className="mr-2 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                {t('cancel')}
            </button>
            <button type="submit" className="bg-au-green text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90">
                {t('adminModalSaveButton')}
            </button>
           </div>
        </form>
      </div>
    </div>
  );
};

// Helper sub-components for form fields
const InputField: React.FC<{name: string, label: string, value: string, onChange: any, type?: string, required?: boolean}> = 
  ({ name, label, value, onChange, type = 'text', required = false}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <input type={type} id={name} name={name} value={value} onChange={onChange} required={required} 
           className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-au-gold focus:border-au-gold sm:text-sm"/>
  </div>
);

const TextAreaField: React.FC<{name: string, label: string, value: string, onChange: any, required?: boolean, rows?: number, placeholder?: string}> = 
  ({ name, label, value, onChange, required = false, rows = 4, placeholder}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea id={name} name={name} value={value} onChange={onChange} required={required} rows={rows} placeholder={placeholder}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-au-gold focus:border-au-gold sm:text-sm font-mono"/>
  </div>
);

const SelectField: React.FC<{name: string, label: string, value: string, options: string[], onChange: any}> = 
  ({ name, label, value, options, onChange }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <select id={name} name={name} value={value} onChange={onChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-au-gold focus:border-au-gold sm:text-sm rounded-md">
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);
