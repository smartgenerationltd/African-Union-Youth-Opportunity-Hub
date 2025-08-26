import React from 'react';
import { Opportunity } from '../types';
import { MapPinIcon } from './Icons';
import { useTranslation } from '../contexts/Translation';

interface LocalRecommendationsProps {
  recommendations: Opportunity[];
  country: string;
  onOpportunitySelect: (opportunity: Opportunity) => void;
}

const RecommendationCard: React.FC<{ opportunity: Opportunity; onSelect: (op: Opportunity) => void }> = ({ opportunity, onSelect }) => (
  <div
    onClick={() => onSelect(opportunity)}
    className="p-3 bg-gray-100 rounded-lg hover:bg-au-gold/20 cursor-pointer transition-colors border border-transparent hover:border-au-gold/50"
  >
    <p className="font-semibold text-au-green truncate">{opportunity.title}</p>
    <p className="text-sm text-gray-600 truncate">{opportunity.organization}</p>
  </div>
);

export const LocalRecommendations: React.FC<LocalRecommendationsProps> = ({ recommendations, country, onOpportunitySelect }) => {
  const { t } = useTranslation();
  
  if (recommendations.length === 0 || country === 'All') {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center mb-3">
        <MapPinIcon className="w-6 h-6 text-au-green mr-2" />
        <h3 className="text-xl font-bold text-au-green">
          {t('localOpportunitiesIn', { country })}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {recommendations.map(op => (
          <RecommendationCard key={`local-${op.id}`} opportunity={op} onSelect={onOpportunitySelect} />
        ))}
      </div>
    </div>
  );
};
