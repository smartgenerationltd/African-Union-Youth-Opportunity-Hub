

import React, { useState, useCallback } from 'react';
import { Opportunity, JobDetails } from '../types';
import { XIcon, DocumentTextIcon, PencilAltIcon, PresentationChartLineIcon, SparklesIcon } from './Icons';
import { generateApplicationContent } from '../services/geminiService';
import { useTranslation } from '../contexts/Translation';

interface OpportunityModalProps {
  opportunity: Opportunity;
  userProfile: string;
  onClose: () => void;
}

type AssistantMode = 'CV' | 'Letter' | 'Proposal';

const AssistantButton: React.FC<{
  mode: AssistantMode;
  currentMode: AssistantMode | null;
  onClick: (mode: AssistantMode) => void;
  Icon: React.ElementType;
  text: string;
}> = ({ mode, currentMode, onClick, Icon, text }) => (
  <button
    onClick={() => onClick(mode)}
    className={`flex-1 p-3 text-sm font-semibold flex items-center justify-center space-x-2 rounded-lg transition-colors ${
      currentMode === mode
        ? 'bg-au-green text-white shadow'
        : 'bg-gray-100 hover:bg-gray-200'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span>{text}</span>
  </button>
);

// New component for displaying detailed job information
const JobDetailsDisplay: React.FC<{ details: JobDetails }> = ({ details }) => {
  if (!details) return null;

  return (
    <div className="space-y-4 text-sm">
      {details.mandatoryNote && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-r-lg" role="alert">
            <p className="font-bold">Important Notice</p>
            <p>{details.mandatoryNote}</p>
        </div>
      )}
      {details.purpose && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-1">Purpose of Job</h4>
          <p className="text-gray-600 leading-relaxed">{details.purpose}</p>
        </div>
      )}
      {details.mainFunctions && details.mainFunctions.length > 0 && (
         <div>
          <h4 className="font-semibold text-gray-800 mb-1">Main Functions</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-1 pl-2">
            {details.mainFunctions.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </div>
      )}
      {details.specificResponsibilities && details.specificResponsibilities.length > 0 && (
         <div>
          <h4 className="font-semibold text-gray-800 mb-1">Specific Responsibilities</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-1 pl-2">
            {details.specificResponsibilities.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </div>
      )}
      {details.academicRequirements && (
         <div>
          <h4 className="font-semibold text-gray-800 mb-1">Academic Requirements</h4>
          <p className="text-gray-600 leading-relaxed">{details.academicRequirements}</p>
        </div>
      )}
      {details.requiredSkills && (
        <div>
           <h4 className="font-semibold text-gray-800 mb-2">Required Skills</h4>
           <div className="space-y-3">
            {details.requiredSkills.functional && (
                <div>
                    <h5 className="font-semibold text-gray-700">Functional Skills</h5>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mt-1 pl-2">
                        {details.requiredSkills.functional.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </div>
            )}
             {details.requiredSkills.personal && (
                <div>
                    <h5 className="font-semibold text-gray-700">Personal Abilities</h5>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mt-1 pl-2">
                        {details.requiredSkills.personal.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </div>
            )}
           </div>
        </div>
      )}
    </div>
  )
};

export const OpportunityModal: React.FC<OpportunityModalProps> = ({ opportunity, userProfile, onClose }) => {
  const [assistantContent, setAssistantContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<AssistantMode | null>(null);
  const { t } = useTranslation();

  const handleGenerateContent = useCallback(async (mode: AssistantMode) => {
    if (activeMode === mode) {
        // Hide if clicking the same button again
        setActiveMode(null);
        setAssistantContent('');
        return;
    }
    setActiveMode(mode);
    setIsLoading(true);
    setError(null);
    setAssistantContent('');
    try {
      const content = await generateApplicationContent(opportunity, userProfile, mode);
      setAssistantContent(content);
    } catch (e) {
      setError(`Failed to generate content for ${mode}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  }, [opportunity, userProfile, activeMode]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-au-green">{opportunity.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
            <div>
                <h3 className="font-semibold text-gray-800">Organization:</h3>
                <p className="text-gray-600">{opportunity.organization}</p>
            </div>
            <div>
                <h3 className="font-semibold text-gray-800">Description:</h3>
                <p className="text-gray-600 leading-relaxed">{opportunity.description}</p>
            </div>
            
            {opportunity.details && <JobDetailsDisplay details={opportunity.details} />}

            <div className="border-t pt-4">
                <h3 className="text-xl font-bold text-au-green mb-3 flex items-center">
                    <SparklesIcon className="w-6 h-6 mr-2 text-au-gold" />
                    {t('opportunityModalAIHelper')}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{t('opportunityModalAIHelperPrompt')}</p>
                <div className="flex space-x-2">
                    <AssistantButton mode="CV" currentMode={activeMode} onClick={handleGenerateContent} Icon={DocumentTextIcon} text={t('opportunityModalCVTips')} />
                    <AssistantButton mode="Letter" currentMode={activeMode} onClick={handleGenerateContent} Icon={PencilAltIcon} text={t('opportunityModalLetterTips')} />
                    <AssistantButton mode="Proposal" currentMode={activeMode} onClick={handleGenerateContent} Icon={PresentationChartLineIcon} text={t('opportunityModalProposalTips')} />
                </div>
                { (isLoading || error || assistantContent) && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                        {isLoading && (
                            <div className="flex items-center text-gray-600">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Generating AI suggestions...</span>
                            </div>
                        )}
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        {assistantContent && (
                            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: assistantContent.replace(/\n/g, '<br />') }} />
                        )}
                    </div>
                )}
            </div>
        </div>

        <div className="p-4 bg-gray-50 border-t rounded-b-lg flex justify-between items-center">
            <div>
                <p className="text-sm font-semibold text-gray-700">{t('deadline')}</p>
                <p className="text-sm text-gray-600">{opportunity.deadline}</p>
            </div>
            <a 
                href={opportunity.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-au-green text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
            >
                {t('opportunityModalApplyNow')}
            </a>
        </div>
      </div>
       <style>{`
        .animate-fade-in {
            animation: fade-in 0.2s ease-out forwards;
        }
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .prose {
          color: #374151;
        }
        .prose h1, .prose h2, .prose h3, .prose h4 {
          font-weight: 600;
        }
        .prose ul {
          list-style-type: disc;
          padding-left: 1.5rem;
        }
        .prose strong {
          font-weight: 600;
        }
       `}</style>
    </div>
  );
};
