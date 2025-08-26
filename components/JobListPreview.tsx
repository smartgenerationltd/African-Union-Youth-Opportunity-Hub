import React from 'react';
import { Opportunity } from '../types';
import { OpportunityCard } from './OpportunityCard';
import { ArrowRightIcon } from './Icons';
import { useTranslation } from '../contexts/Translation';

interface JobListPreviewProps {
  jobs: Opportunity[];
  onViewAll: () => void;
  onOpportunitySelect: (opportunity: Opportunity) => void;
}

export const JobListPreview: React.FC<JobListPreviewProps> = ({ jobs, onViewAll, onOpportunitySelect }) => {
  const { t } = useTranslation();

  if (jobs.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-au-green">{t('featuredJobs')}</h2>
        <button
          onClick={onViewAll}
          className="flex items-center space-x-2 text-au-green font-semibold hover:underline"
        >
          <span>{t('viewAllJobs')}</span>
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map(job => (
          <OpportunityCard key={`job-${job.id}`} opportunity={job} onSelect={onOpportunitySelect} />
        ))}
      </div>
    </div>
  );
};
