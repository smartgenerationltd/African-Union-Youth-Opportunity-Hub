import React, { useState, useEffect } from 'react';
import { UserProfile as UserProfileType } from '../types';
import { COUNTRIES, EDUCATION_LEVELS } from '../constants';
import { UserCircleIcon } from './Icons';
import { useTranslation } from '../contexts/Translation';

interface UserProfileProps {
  profile: UserProfileType;
  onSave: (updatedProfile: UserProfileType) => void;
  onCancel: () => void;
}

const TagInput: React.FC<{ tags: string[]; setTags: (tags: string[]) => void; placeholder: string; }> = ({ tags, setTags, placeholder }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setInputValue('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                    <span key={tag} className="bg-au-green/20 text-au-green text-sm font-semibold px-3 py-1 rounded-full flex items-center">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="ml-2 text-au-green hover:text-au-red">&times;</button>
                    </span>
                ))}
            </div>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-au-gold focus:border-au-gold sm:text-sm"
            />
        </div>
    );
};

export const UserProfile: React.FC<UserProfileProps> = ({ profile, onSave, onCancel }) => {
  const [formData, setFormData] = useState<UserProfileType>(profile);
  const { t } = useTranslation();

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSkillsChange = (skills: string[]) => {
      setFormData(prev => ({ ...prev, skills }));
  };
  
  const handleInterestsChange = (interests: string[]) => {
      setFormData(prev => ({ ...prev, interests }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  const filteredCountries = COUNTRIES.filter(c => !c.startsWith('Region:'));
  const filteredEduLevels = EDUCATION_LEVELS.filter(e => e !== 'All');

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
            <UserCircleIcon className="w-16 h-16 text-au-green" />
            <div>
                <h1 className="text-4xl font-extrabold text-au-green">{t('myProfile')}</h1>
                <p className="text-lg text-gray-500">{t('profileSubtitle')}</p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md border border-gray-200 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('fullName')}</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-au-gold focus:border-au-gold sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('emailAddress')}</label>
                    <input type="email" id="email" name="email" value={formData.email} disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm text-gray-500" />
                </div>
            </div>
            
            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">{t('userProfileAIBio')}</label>
                <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={5} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-au-gold focus:border-au-gold sm:text-sm" placeholder="Tell us about your skills, experience, and aspirations..."></textarea>
                <p className="mt-1 text-xs text-gray-500">{t('userProfileAIBioHelp')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">{t('userProfileCountry')}</label>
                    <select name="country" value={formData.country} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-au-gold focus:border-au-gold sm:text-sm rounded-md">
                        {filteredCountries.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('userProfileHighestEducation')}</label>
                    <select name="educationLevel" value={formData.educationLevel} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-au-gold focus:border-au-gold sm:text-sm rounded-md">
                        {filteredEduLevels.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('userProfileYourSkills')}</label>
                <TagInput tags={formData.skills} setTags={handleSkillsChange} placeholder={t('userProfileAddSkillPlaceholder')} />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('userProfileYourInterests')}</label>
                <TagInput tags={formData.interests} setTags={handleInterestsChange} placeholder={t('userProfileAddInterestPlaceholder')} />
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-end items-center space-x-3">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                    {t('cancel')}
                </button>
                <button type="submit" className="bg-au-green text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
                    {t('saveChanges')}
                </button>
            </div>
        </form>
      </div>
    </main>
  );
};
