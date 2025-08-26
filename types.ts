export enum OpportunityCategory {
  Scholarships = 'Scholarships',
  Internships = 'Internships',
  Fellowships = 'Fellowships',
  Grants = 'Grants',
  Jobs = 'Jobs',
  Contests = 'Contests',
  Training = 'Training',
}

export interface JobDetails {
  purpose?: string;
  mainFunctions?: string[];
  specificResponsibilities?: string[];
  academicRequirements?: string;
  requiredSkills?: {
    functional?: string[];
    personal?: string[];
  };
  mandatoryNote?: string;
}

export interface Opportunity {
  id: number;
  title: string;
  organization: string;
  category: OpportunityCategory;
  description: string;
  details?: JobDetails;
  deadline: string;
  postedDate: string;
  country: string;
  educationLevel: string;
  link: string;
}

export interface FilterState {
  country: string;
  sector: string; // Corresponds to OpportunityCategory
  education: string;
  search: string;
  deadline: string;
  postedWithin: string;
  sortBy: string;
}

export interface ForumPost {
  id: number;
  author: string;
  avatarUrl: string;
  post: string;
  timestamp: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface AIRecommendation {
  id: number;
  rationale: string;
}

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  skills: string[];
  interests: string[];
  country: string;
  educationLevel: string;
}