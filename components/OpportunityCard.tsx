import React from 'react';
import { Opportunity, OpportunityCategory } from '../types';
import { BriefcaseIcon, BookOpenIcon, StarIcon, CalendarIcon, ClockIcon, TrophyIcon, AcademicCapIcon, CurrencyDollarIcon, SparklesIcon, PencilAltIcon, XIcon } from './Icons';
import { useTranslation } from '../contexts/Translation';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onSelect: (opportunity: Opportunity) => void;
  rationale?: string;
  isAdmin?: boolean;
  onEdit?: (opportunity: Opportunity) => void;
  onDelete?: (id: number) => void;
}

const categoryStyles: { [key in OpportunityCategory]: { icon: React.ReactNode; color: string } } = {
  [OpportunityCategory.Scholarships]: { icon: <BookOpenIcon className="w-5 h-5" />, color: 'green' },
  [OpportunityCategory.Internships]: { icon: <BriefcaseIcon className="w-5 h-5" />, color: 'blue' },
  [OpportunityCategory.Fellowships]: { icon: <StarIcon className="w-5 h-5" />, color: 'yellow' },
  [OpportunityCategory.Grants]: { icon: <CurrencyDollarIcon className="w-5 h-5" />, color: 'red' },
  [OpportunityCategory.Jobs]: { icon: <BriefcaseIcon className="w-5 h-5" />, color: 'indigo' },
  [OpportunityCategory.Contests]: { icon: <TrophyIcon className="w-5 h-5" />, color: 'purple' },
  [OpportunityCategory.Training]: { icon: <AcademicCapIcon className="w-5 h-5" />, color: 'pink' },
};

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, onSelect, rationale, isAdmin, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const style = categoryStyles[opportunity.category] || { icon: <StarIcon className="w-5 h-5"/>, color: 'gray' };

  const colorClasses = {
    green: { bg: 'bg-green-100', text: 'text-green-800', border: 'hover:border-green-500' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'hover:border-blue-500' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'hover:border-yellow-500' },
    red: { bg: 'bg-red-100', text: 'text-red-800', border: 'hover:border-red-500' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'hover:border-indigo-500' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'hover:border-purple-500' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-800', border: 'hover:border-pink-500' },
    gray: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'hover:border-gray-500' },
  }[style.color];

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(opportunity);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(opportunity.id);
  };

  return (
    <div 
        className={`border border-gray-200 p-4 rounded-lg hover:shadow-lg ${colorClasses?.border} transition-all duration-300 cursor-pointer relative`}
        onClick={() => onSelect(opportunity)}
    >
      <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-full ${colorClasses?.bg} ${colorClasses?.text}`}>
            {style.icon}
          </div>
          <div className="flex-1">
            <p className={`text-sm font-bold ${colorClasses?.text}`}>{opportunity.category}</p>
            <h3 className="text-lg font-semibold text-au-dark hover:text-au-green">{opportunity.title}</h3>
            <p className="text-sm text-gray-600">{opportunity.organization}</p>
            <div className="flex items-center justify-between text-xs text-gray-500 mt-2 flex-wrap gap-x-4 gap-y-1">
                <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1"/>
                    <span>{t('deadline')}: {opportunity.deadline}</span>
                </div>
                <div className="flex items-center text-gray-400">
                    <ClockIcon className="w-4 h-4 mr-1"/>
                    <span>{new Date(opportunity.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
            </div>
          </div>
      </div>
      {rationale && (
        <div className="mt-3 pt-3 border-t border-gray-200 text-sm">
           <div className="flex items-start text-gray-700">
              <SparklesIcon className="w-4 h-4 text-au-gold mr-2 mt-0.5 flex-shrink-0" />
              <p>
                <span className="font-semibold">{t('aiRationale')}:</span> {rationale}
              </p>
            </div>
        </div>
      )}
       {isAdmin && (
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={handleEditClick}
            className="p-1.5 bg-gray-200 rounded-full text-gray-600 hover:bg-au-green hover:text-white transition-colors"
            aria-label="Edit Opportunity"
          >
            <PencilAltIcon className="w-4 h-4" />
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-1.5 bg-gray-200 rounded-full text-gray-600 hover:bg-au-red hover:text-white transition-colors"
            aria-label="Delete Opportunity"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
