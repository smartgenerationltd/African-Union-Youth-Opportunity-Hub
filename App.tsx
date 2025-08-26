import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { OpportunityList } from './components/OpportunityList';
import { FilterBar } from './components/FilterBar';
import { ProfileAssistant } from './components/ProfileAssistant';
import { CommunityPreview } from './components/CommunityPreview';
import { Opportunity, FilterState, OpportunityCategory, AIRecommendation, UserProfile as UserProfileType } from './types';
import { OPPORTUNITIES, COUNTRIES, OPPORTUNITY_TYPES, EDUCATION_LEVELS, DEADLINE_OPTIONS, POSTED_WITHIN_OPTIONS, REGIONS, SORT_OPTIONS } from './constants';
import { getOpportunityMatches } from './services/geminiService';
import { OpportunityModal } from './components/OpportunityModal';
import { Login } from './components/Login';
import { LocalRecommendations } from './components/LocalRecommendations';
import { Chatbot } from './components/Chatbot';
import { JobListPreview } from './components/JobListPreview';
import { AdminOpportunityModal } from './components/AdminOpportunityModal';
import { AdminDashboard } from './components/AdminDashboard';
import { UserProfile } from './components/UserProfile';
import { ProfileSetupModal } from './components/ProfileSetupModal';
import { TranslationProvider, useTranslation } from './contexts/Translation';

const AppContent: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('au-hub-isLoggedIn') === 'true';
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('au-hub-isAdmin') === 'true';
  });
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('au-hub-currentUser');
  });
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [currentView, setCurrentView] = useState<'hub' | 'dashboard' | 'profile'>('hub');
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const savedOpportunities = localStorage.getItem('au-hub-opportunities');
    try {
        if (savedOpportunities && JSON.parse(savedOpportunities).length > 0) {
            return JSON.parse(savedOpportunities);
        }
    } catch (e) {
        console.error("Failed to parse opportunities from localStorage", e);
    }
    return OPPORTUNITIES;
  });
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    country: 'All',
    sector: 'All',
    education: 'All',
    search: '',
    deadline: 'All Upcoming',
    postedWithin: 'Last 3 Months',
    sortBy: 'Latest Postings',
  });
  const [recommendations, setRecommendations] = useState<(Opportunity & { rationale: string })[]>([]);
  const [localRecommendations, setLocalRecommendations] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | 'new' | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [showProfileSetup, setShowProfileSetup] = useState<boolean>(false);
  
  const { language, t } = useTranslation();
  const isInitialMount = useRef(true);


  const jobOpportunities = useMemo(() => 
    opportunities
        .filter(op => op.category === OpportunityCategory.Jobs)
        .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()), 
  [opportunities]);

  useEffect(() => {
    // Load user profile when email changes (on login)
    if (currentUserEmail) {
      const savedProfile = localStorage.getItem(`au-hub-profile-${currentUserEmail}`);
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
    } else {
      setUserProfile(null);
    }
  }, [currentUserEmail]);
  
  useEffect(() => {
    if (feedbackMessage) {
        const timer = setTimeout(() => {
            setFeedbackMessage('');
        }, 3000); // Hide after 3 seconds
        return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);
  
  useEffect(() => {
    // This effect shows a feedback message when the language changes, but not on initial load.
    if (isInitialMount.current) {
        isInitialMount.current = false;
    } else {
        setFeedbackMessage(t('languageSwitched', { language: language }));
    }
  }, [language, t]);

  useEffect(() => {
    // Persist opportunities to localStorage whenever they change
    localStorage.setItem('au-hub-opportunities', JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let newFiltered = opportunities.filter(op => {
        const searchMatch = op.title.toLowerCase().includes(filters.search.toLowerCase()) || op.organization.toLowerCase().includes(filters.search.toLowerCase());
        
        const isRegionMatch = (opCountry: string, selectedFilter: string): boolean => {
          if (!selectedFilter.startsWith('Region: ')) return false;
          const regionName = selectedFilter.replace('Region: ', '');
          const countriesInRegion = REGIONS[regionName as keyof typeof REGIONS];
          return !!countriesInRegion && countriesInRegion.includes(opCountry);
        };
        const countryMatch = filters.country === 'All' || op.country === filters.country || isRegionMatch(op.country, filters.country) || (filters.country === 'International' && op.country === 'International');
        
        const sectorMatch = filters.sector === 'All' || op.category === filters.sector;
        const educationMatch = filters.education === 'All' || op.educationLevel === filters.education;

        // --- Posted Within Filter Logic ---
        const { postedWithin } = filters;
        let postedWithinMatch = true;
        if (postedWithin !== 'All Time') {
            const postedDate = new Date(op.postedDate);
            if (isNaN(postedDate.getTime())) {
                 postedWithinMatch = false;
            } else {
                const now = new Date();
                let cutoffDate = new Date(now);

                switch (postedWithin) {
                    case 'Last 24 Hours':
                        cutoffDate.setHours(now.getHours() - 24);
                        break;
                    case 'Last 7 Days':
                        cutoffDate.setDate(now.getDate() - 7);
                        break;
                    case 'Last 30 Days':
                        cutoffDate.setDate(now.getDate() - 30);
                        break;
                    case 'Last 3 Months':
                        cutoffDate.setMonth(now.getMonth() - 3);
                        break;
                }
                if (postedDate < cutoffDate) {
                    postedWithinMatch = false;
                }
            }
        }
        
        // --- Deadline Filter Logic ---
        const { deadline: deadlineFilter } = filters;
        let deadlineMatch = true;

        if (op.deadline.toLowerCase() === 'open enrollment') {
            if (deadlineFilter !== 'All Upcoming') deadlineMatch = false;
        } else {
            const opDeadline = new Date(op.deadline);
            if (isNaN(opDeadline.getTime())) {
                deadlineMatch = false;
            } else {
                opDeadline.setHours(0, 0, 0, 0);

                if (opDeadline < today) {
                    deadlineMatch = false;
                } else {
                    switch (deadlineFilter) {
                        case 'Next 7 Days': {
                            const next7Days = new Date(today);
                            next7Days.setDate(today.getDate() + 7);
                            deadlineMatch = opDeadline <= next7Days;
                            break;
                        }
                        case 'Next 30 Days': {
                            const next30Days = new Date(today);
                            next30Days.setDate(today.getDate() + 30);
                            deadlineMatch = opDeadline <= next30Days;
                            break;
                        }
                        case 'Next 3 Months': {
                            const next3Months = new Date(today);
                            next3Months.setMonth(today.getMonth() + 3);
                            deadlineMatch = opDeadline <= next3Months;
                            break;
                        }
                        case 'Over 3 Months': {
                             const next3Months = new Date(today);
                             next3Months.setMonth(today.getMonth() + 3);
                             deadlineMatch = opDeadline > next3Months;
                             break;
                        }
                        case 'All Upcoming':
                        default:
                            deadlineMatch = true;
                            break;
                    }
                }
            }
        }
        
        return searchMatch && countryMatch && sectorMatch && educationMatch && deadlineMatch && postedWithinMatch;
    });

    // --- Sorting Logic ---
    if (filters.sortBy === 'Upcoming Deadline') {
        newFiltered.sort((a, b) => {
            const deadlineA = a.deadline.toLowerCase();
            const deadlineB = b.deadline.toLowerCase();
            if (deadlineA === 'open enrollment') return 1;
            if (deadlineB === 'open enrollment') return -1;
            const dateA = new Date(a.deadline).getTime();
            const dateB = new Date(b.deadline).getTime();
            if (isNaN(dateA)) return 1;
            if (isNaN(dateB)) return -1;
            return dateA - dateB;
        });
    } else { // Default to 'Latest Postings'
        newFiltered.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    }

    setFilteredOpportunities(newFiltered);
  }, [opportunities, filters]);
  
  useEffect(() => {
    if (filters.country && filters.country !== 'All' && !filters.country.startsWith('Region:')) {
      const sortedByDate = [...opportunities].sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
      const countryMatches = sortedByDate
        .filter(op => op.country === filters.country)
        .slice(0, 3);
      setLocalRecommendations(countryMatches);
    } else {
      setLocalRecommendations([]);
    }
  }, [filters.country, opportunities]);

  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleFindMatches = async () => {
    if (!userProfile?.bio.trim()) {
      setError('Please enter your profile information first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setRecommendations([]);
    try {
      const matchedRecommendations: AIRecommendation[] = await getOpportunityMatches(userProfile.bio, opportunities);
      const matchedOpportunities = matchedRecommendations
        .map(rec => {
          const opportunity = opportunities.find(op => op.id === rec.id);
          if (opportunity) {
            return { ...opportunity, rationale: rec.rationale };
          }
          return null;
        })
        .filter((op): op is Opportunity & { rationale: string } => op !== null);

      setRecommendations(matchedOpportunities);
    } catch (e) {
      setError('Failed to get recommendations. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  
  const closeModal = () => {
    setSelectedOpportunity(null);
  };
  
  const handleLogin = (isAdminLogin: boolean, email: string) => {
    localStorage.setItem('au-hub-isLoggedIn', 'true');
    localStorage.setItem('au-hub-currentUser', email);
    setIsLoggedIn(true);
    setCurrentUserEmail(email);

    if (isAdminLogin) {
      localStorage.setItem('au-hub-isAdmin', 'true');
      setIsAdmin(true);
      setCurrentView('dashboard');
    } else {
      // Check for profile setup for regular users
      const savedProfileString = localStorage.getItem(`au-hub-profile-${email}`);
      if (savedProfileString) {
          const savedProfile = JSON.parse(savedProfileString);
          setUserProfile(savedProfile); // Load profile into state immediately
          // Trigger setup modal if profile is incomplete (e.g., default names from registration)
          if (savedProfile.name === 'New User' || savedProfile.name === 'Social User') {
              setShowProfileSetup(true);
          }
      } else {
          // This case is a fallback: if a user exists but has no profile, create a default and show setup.
          const defaultProfile: UserProfileType = {
            name: 'New User',
            email: email,
            bio: `I am a new user from [Your Country], passionate about [Your Interests]. I have skills in [Your Skills] and recently completed [Your Education]. I am looking for opportunities in [Your Desired Field].`,
            skills: [],
            interests: [],
            country: 'Nigeria',
            educationLevel: 'Any',
          };
          localStorage.setItem(`au-hub-profile-${email}`, JSON.stringify(defaultProfile));
          setUserProfile(defaultProfile);
          setShowProfileSetup(true);
      }
      setCurrentView('hub');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('au-hub-isLoggedIn');
    localStorage.removeItem('au-hub-isAdmin');
    localStorage.removeItem('au-hub-currentUser');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentUserEmail(null);
    setUserProfile(null);
    setCurrentView('hub');
  };

  const handleViewAllJobs = () => {
    handleFilterChange('sector', OpportunityCategory.Jobs);
    if (isAdmin) setCurrentView('hub');
  };
  
  const handleSaveOpportunity = (opportunityToSave: Omit<Opportunity, 'id' | 'postedDate'> & { id?: number }) => {
    const isUpdating = !!opportunityToSave.id;
    if (isUpdating) { // Editing existing
      setOpportunities(prev => prev.map(op => op.id === opportunityToSave.id ? { ...op, ...opportunityToSave } as Opportunity : op));
    } else { // Creating new
      const newOpportunity: Opportunity = {
        ...opportunityToSave,
        id: Date.now(), // Simple unique ID
        postedDate: new Date().toISOString().split('T')[0],
      };
      setOpportunities(prev => [newOpportunity, ...prev]);
    }
    setEditingOpportunity(null);
    setFeedbackMessage(isUpdating ? t('opportunityUpdatedSuccess') : t('opportunityCreatedSuccess'));
  };

  const handleDeleteOpportunity = (id: number) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      setOpportunities(prev => prev.filter(op => op.id !== id));
      setFeedbackMessage(t('opportunityDeletedSuccess'));
    }
  };

  const handleUpdateProfile = (updatedProfile: UserProfileType) => {
    if (currentUserEmail) {
        localStorage.setItem(`au-hub-profile-${currentUserEmail}`, JSON.stringify(updatedProfile));
        setUserProfile(updatedProfile);
        setFeedbackMessage(t('profileUpdatedSuccess'));
        setCurrentView('hub'); // Navigate back to hub after saving
    }
  };

  const handleProfileSetupSave = (updatedProfile: UserProfileType) => {
    if (currentUserEmail) {
        localStorage.setItem(`au-hub-profile-${currentUserEmail}`, JSON.stringify(updatedProfile));
        setUserProfile(updatedProfile);
        setShowProfileSetup(false);
        setFeedbackMessage(t('profileSetupSuccess'));
    }
  };

  const handleBioChange = (newBio: string) => {
    if (userProfile) {
        const updatedProfile = { ...userProfile, bio: newBio };
        setUserProfile(updatedProfile);
        // Auto-save bio change to localStorage for persistence
        if (currentUserEmail) {
            localStorage.setItem(`au-hub-profile-${currentUserEmail}`, JSON.stringify(updatedProfile));
        }
    }
  };

  const opportunityListTitle = filters.sortBy === 'Upcoming Deadline' ? t('opportunitiesByDeadline') : t('latestOpportunities');

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-au-dark">
      <Header 
        onLogout={handleLogout} 
        isAdmin={isAdmin} 
        currentView={currentView}
        onNavigate={setCurrentView}
      />

      {feedbackMessage && (
        <div className="fixed top-24 right-8 bg-au-green text-white py-2 px-4 rounded-lg shadow-lg z-[100] animate-toast">
          {feedbackMessage}
        </div>
      )}
      
      {isAdmin && currentView === 'dashboard' ? (
        <AdminDashboard
          opportunities={opportunities}
          onAddNew={() => setEditingOpportunity('new')}
          onEdit={setEditingOpportunity}
          onDelete={handleDeleteOpportunity}
        />
      ) : currentView === 'profile' && userProfile ? (
         <UserProfile 
            profile={userProfile} 
            onSave={handleUpdateProfile} 
            onCancel={() => setCurrentView('hub')}
         />
      ) : (
        <main className="container mx-auto p-4 md:p-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-au-green mb-2">{t('mainTitle')}</h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">{t('mainSubtitle')}</p>
          </div>

          <JobListPreview 
            jobs={jobOpportunities.slice(0, 3)}
            onViewAll={handleViewAllJobs}
            onOpportunitySelect={setSelectedOpportunity}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <FilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                countries={COUNTRIES}
                opportunityTypes={OPPORTUNITY_TYPES}
                educationLevels={EDUCATION_LEVELS}
                deadlineOptions={DEADLINE_OPTIONS}
                postedWithinOptions={POSTED_WITHIN_OPTIONS}
                sortOptions={SORT_OPTIONS}
              />
              {isAdmin && (
                <div className="text-right">
                  <button
                    onClick={() => setEditingOpportunity('new')}
                    className="bg-au-green text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    {t('adminDashboardAddNewOpp')}
                  </button>
                </div>
              )}
              <LocalRecommendations
                recommendations={localRecommendations}
                country={filters.country}
                onOpportunitySelect={setSelectedOpportunity}
              />
              <OpportunityList
                title={recommendations.length > 0 ? t('yourTopAiMatches') : opportunityListTitle}
                opportunities={recommendations.length > 0 ? recommendations : filteredOpportunities}
                onOpportunitySelect={setSelectedOpportunity}
                isAdmin={isAdmin}
                onEdit={setEditingOpportunity}
                onDelete={handleDeleteOpportunity}
              />
              {recommendations.length > 0 && (
                <OpportunityList
                  title={opportunityListTitle}
                  opportunities={filteredOpportunities}
                  onOpportunitySelect={setSelectedOpportunity}
                  isAdmin={isAdmin}
                  onEdit={setEditingOpportunity}
                  onDelete={handleDeleteOpportunity}
                />
              )}
            </div>

            <div className="lg:col-span-4 space-y-8">
              <ProfileAssistant
                profile={userProfile?.bio || ''}
                setProfile={handleBioChange}
                onFindMatches={handleFindMatches}
                isLoading={isLoading}
                error={error}
              />
              <CommunityPreview />
            </div>
          </div>
        </main>
      )}

      {selectedOpportunity && userProfile && <OpportunityModal opportunity={selectedOpportunity} userProfile={userProfile.bio} onClose={closeModal} />}
      {editingOpportunity && (
        <AdminOpportunityModal
          opportunityToEdit={editingOpportunity === 'new' ? null : editingOpportunity}
          onClose={() => setEditingOpportunity(null)}
          onSave={handleSaveOpportunity}
        />
      )}
      {showProfileSetup && userProfile && (
        <ProfileSetupModal 
          profile={userProfile}
          onSave={handleProfileSetupSave}
        />
      )}
      <Chatbot />
      <style>{`
        @keyframes toast-anim {
          0% { opacity: 0; transform: translateY(-20px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        .animate-toast {
          animation: toast-anim 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <TranslationProvider>
      <AppContent />
    </TranslationProvider>
  );
};

export default App;