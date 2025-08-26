import React from 'react';
import { Opportunity } from '../types';
import { OpportunityCard } from './OpportunityCard';
import { useTranslation } from '../contexts/Translation';

interface OpportunityListProps {
  title: string;
  opportunities: (Opportunity & { rationale?: string })[];
  onOpportunitySelect: (opportunity: Opportunity) => void;
  isAdmin?: boolean;
  onEdit?: (opportunity: Opportunity) => void;
  onDelete?: (id: number) => void;
}

export const OpportunityList: React.FC<OpportunityListProps> = ({ title, opportunities, onOpportunitySelect, isAdmin, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-au-green mb-4">{title}</h2>
      {opportunities.length > 0 ? (
        <div className="space-y-4">
          {opportunities.map(op => (
            <OpportunityCard
              key={op.id}
              opportunity={op}
              rationale={op.rationale}
              onSelect={onOpportunitySelect}
              isAdmin={isAdmin}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p className="font-semibold">{t('noOpportunitiesFound')}</p>
          <p className="text-sm">{t('noOpportunitiesHint')}</p>
        </div>
      )}
    </div>
  );
};
