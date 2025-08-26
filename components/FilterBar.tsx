import React from 'react';
import { FilterState } from '../types';
import { SearchIcon } from './Icons';
import { useTranslation } from '../contexts/Translation';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  countries: string[];
  opportunityTypes: string[];
  educationLevels: string[];
  deadlineOptions: string[];
  postedWithinOptions: string[];
  sortOptions: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
    filters, 
    onFilterChange, 
    countries, 
    opportunityTypes, 
    educationLevels, 
    deadlineOptions,
    postedWithinOptions,
    sortOptions
}) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative mb-4">
            <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={filters.search}
                onChange={(e) => onFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-au-gold"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="w-5 h-5 text-gray-400" />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SelectFilter label={t('countryRegion')} value={filters.country} options={countries} onChange={(e) => onFilterChange('country', e.target.value)} />
            <SelectFilter label={t('opportunityType')} value={filters.sector} options={opportunityTypes} onChange={(e) => onFilterChange('sector', e.target.value)} />
            <SelectFilter label={t('educationLevel')} value={filters.education} options={educationLevels} onChange={(e) => onFilterChange('education', e.target.value)} />
            <SelectFilter label={t('postedWithin')} value={filters.postedWithin} options={postedWithinOptions} onChange={(e) => onFilterChange('postedWithin', e.target.value)} />
            <SelectFilter label={t('deadline')} value={filters.deadline} options={deadlineOptions} onChange={(e) => onFilterChange('deadline', e.target.value)} />
            <SelectFilter label={t('sortBy')} value={filters.sortBy} options={sortOptions} onChange={(e) => onFilterChange('sortBy', e.target.value)} />
        </div>
    </div>
  );
};

interface SelectFilterProps {
    label: string;
    value: string;
    options: string[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectFilter: React.FC<SelectFilterProps> = ({ label, value, options, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select
            value={value}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-au-gold"
        >
            {options.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    </div>
);
