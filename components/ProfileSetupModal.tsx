import React, { useState, useEffect } from 'react';
import { UserProfile as UserProfileType } from '../types';
import { COUNTRIES, EDUCATION_LEVELS } from '../constants';
import { GlobeIcon } from './Icons';
import { useTranslation } from '../contexts/Translation';

interface ProfileSetupModalProps {
  profile: UserProfileType;
  onSave: (updatedProfile: UserProfileType) => void;
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

export const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({ profile, onSave }) => {
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
    // Ensure user provides a name
    if (!formData.name.trim() || formData.name === 'New User') {
        alert('Please enter your full name.');
        return;
    }
    onSave(formData);
  };
  
  const filteredCountries = COUNTRIES.filter(c => !c.startsWith('Region:'));
  const filteredEduLevels = EDUCATION_LEVELS.filter(e => e !== 'All');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 text-center border-b">
          <div className="flex flex-col items-center space-y-2 mb-2">
              <div className="bg-au-green p-3 rounded-full">
                  <GlobeIcon className="w-8 h-8 text-au-gold" />
              </div>
              <h1 className="text-3xl font-bold text-au-green">{t('welcomeToTheHub')}</h1>
          </div>
          <p className="text-lg text-gray-600">{t('profileSetupPrompt')}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('fullName')}</label>
                    <input type="text" id="name" name="name" value={formData.name === 'New User' ? '' : formData.name} onChange={handleChange} required placeholder="e.g., Kwame Nkrumah" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-au-gold focus:border-au-gold sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('emailAddress')}</label>
                    <input type="email" id="email" name="email" value={formData.email} disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm text-gray-500" />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">{t('userProfileAIBio')}</label>
                <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={4} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-au-gold focus:border-au-gold sm:text-sm" placeholder="Tell us about your skills, experience, and aspirations..."></textarea>
                <p className="mt-1 text-xs text-gray-500">{t('userProfileAIBioHelp')}</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('userProfileYourSkills')}</label>
                <TagInput tags={formData.skills} setTags={handleSkillsChange} placeholder={t('userProfileAddSkillPlaceholder')} />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('userProfileYourInterests')}</label>
                <TagInput tags={formData.interests} setTags={handleInterestsChange} placeholder={t('userProfileAddInterestPlaceholder')} />
            </div>

           <div className="pt-4 flex justify-center">
            <button type="submit" className="w-full md:w-1/2 bg-au-green text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors text-lg">
                {t('getStarted')}
            </button>
           </div>
        </form>
      </div>
    </div>
  );
};
