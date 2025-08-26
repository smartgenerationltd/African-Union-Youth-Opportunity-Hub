import { Opportunity, OpportunityCategory, ForumPost } from './types';

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: 1,
    title: 'AU Scholarship for Young Innovators 2025',
    organization: 'African Union Commission',
    category: OpportunityCategory.Scholarships,
    description: 'Full scholarship for master\'s programs in STEM fields at partner universities across Africa for the 2025 academic year.',
    deadline: '2025-09-15',
    postedDate: '2024-11-16',
    country: 'Ethiopia',
    educationLevel: 'Bachelors',
    link: '#',
  },
  {
    id: 2,
    title: 'AfCFTA Youth Entrepreneurship Grant 2025',
    organization: 'AfCFTA Secretariat',
    category: OpportunityCategory.Grants,
    description: 'Seed funding up to $25,000 for startups focused on cross-border trade solutions, with a focus on 2025 launch dates.',
    deadline: '2025-03-30',
    postedDate: '2024-11-17',
    country: 'Ghana',
    educationLevel: 'High School',
    link: '#',
  },
  {
    id: 3,
    title: 'AU Youth Division Internship (2025 Cohort)',
    organization: 'African Union Commission',
    category: OpportunityCategory.Internships,
    description: 'A 6-month paid internship program starting in Feb 2025 for young professionals passionate about youth policy.',
    deadline: '2025-01-15',
    postedDate: '2024-11-18',
    country: 'Ethiopia',
    educationLevel: 'Bachelors',
    link: '#',
  },
  {
    id: 4,
    title: 'Mandela Leadership Fellowship 2025',
    organization: 'USAID & AU',
    category: OpportunityCategory.Fellowships,
    description: 'Intensive leadership training and networking opportunities for the 2025 cohort of emerging African leaders.',
    deadline: '2025-02-15',
    postedDate: '2024-11-19',
    country: 'South Africa',
    educationLevel: 'Masters',
    link: '#',
  },
  {
    id: 5,
    title: 'African Innovation Challenge 2025',
    organization: 'AU Innovation Program',
    category: OpportunityCategory.Contests,
    description: 'A competition seeking tech-based solutions for challenges in agriculture and health for implementation in 2025.',
    deadline: '2025-04-20',
    postedDate: '2024-11-20',
    country: 'Kenya',
    educationLevel: 'Any',
    link: '#',
  },
   {
    id: 6,
    title: 'Digital Skills Training Program 2025',
    organization: 'Smart Africa & AU',
    category: OpportunityCategory.Training,
    description: 'Free certification courses in data science, AI, and cybersecurity for African youth, with new modules for 2025.',
    deadline: 'Open Enrollment',
    postedDate: '2024-11-21',
    country: 'Rwanda',
    educationLevel: 'Any',
    link: '#',
  },
  {
    id: 7,
    title: 'Green Economy Job Placements 2025',
    organization: 'African Development Bank',
    category: OpportunityCategory.Jobs,
    description: 'Connecting young graduates with jobs in the renewable energy and sustainable agriculture sectors for 2025.',
    deadline: '2025-05-01',
    postedDate: '2024-11-22',
    country: 'Nigeria',
    educationLevel: 'Bachelors',
    link: '#',
  },
  {
    id: 8,
    title: 'Google Africa Developer Scholarship 2025',
    organization: 'Google Africa',
    category: OpportunityCategory.Scholarships,
    description: 'Access to Google\'s top certification courses in Android development, Cloud, and Mobile Web for the 2025 class.',
    deadline: '2025-01-31',
    postedDate: '2024-12-01',
    country: 'Nigeria',
    educationLevel: 'Any',
    link: '#',
  },
  {
    id: 9,
    title: 'Mastercard Foundation Scholars Program 2025',
    organization: 'Mastercard Foundation',
    category: OpportunityCategory.Scholarships,
    description: 'Comprehensive scholarships for secondary and higher education to academically talented yet economically disadvantaged students for 2025 entry.',
    deadline: '2025-02-10',
    postedDate: '2024-12-02',
    country: 'Ghana',
    educationLevel: 'High School',
    link: '#',
  },
  {
    id: 10,
    title: 'Tony Elumelu Foundation Entrepreneurship Programme 2025',
    organization: 'Tony Elumelu Foundation',
    category: OpportunityCategory.Grants,
    description: '$5,000 in seed capital, mentorship, and a 12-week business training program for African entrepreneurs in 2025.',
    deadline: '2025-03-31',
    postedDate: '2024-12-03',
    country: 'Nigeria',
    educationLevel: 'Any',
    link: '#',
  },
  {
    id: 11,
    title: 'AfDB Young Professionals Program (YPP) 2025',
    organization: 'African Development Bank',
    category: OpportunityCategory.Jobs,
    description: 'A 3-year leadership development program for young professionals to have a career in development finance, starting mid-2025.',
    deadline: '2025-04-15',
    postedDate: '2024-12-04',
    country: 'Ivory Coast',
    educationLevel: 'Masters',
    link: '#',
  },
  {
    id: 12,
    title: 'UNICEF Africa Youth Advocacy Fellowship 2025',
    organization: 'UNICEF Africa',
    category: OpportunityCategory.Fellowships,
    description: 'A program for young Africans to champion children\'s rights and influence policy. 2025 cohort applications are open.',
    deadline: '2025-06-20',
    postedDate: '2024-12-05',
    country: 'Kenya',
    educationLevel: 'Bachelors',
    link: '#',
  },
  {
    id: 13,
    title: 'Anzisha Prize for Young African Entrepreneurs 2025',
    organization: 'Anzisha Prize',
    category: OpportunityCategory.Contests,
    description: 'Celebrating and supporting very young African entrepreneurs (15-22 years old) with over $100,000 in prizes in 2025.',
    deadline: '2025-04-30',
    postedDate: '2024-12-06',
    country: 'South Africa',
    educationLevel: 'High School',
    link: '#',
  },
  {
    id: 14,
    title: 'MEST Africa Entrepreneurial Training Program 2025',
    organization: 'MEST Africa',
    category: OpportunityCategory.Training,
    description: 'A one-year, fully sponsored program for aspiring tech entrepreneurs for the 2025 session, including seed funding and incubation.',
    deadline: '2025-03-28',
    postedDate: '2024-12-07',
    country: 'Ghana',
    educationLevel: 'Bachelors',
    link: '#',
  },
  {
    id: 15,
    title: 'Aga Khan Foundation East Africa Graduate Internship 2025',
    organization: 'Aga Khan Foundation',
    category: OpportunityCategory.Internships,
    description: 'A 1-year internship for 2025 graduates to gain experience in international development across various sectors.',
    deadline: '2025-08-30',
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Posted 2 days ago
    country: 'Tanzania',
    educationLevel: 'Bachelors',
    link: '#',
  },
  {
    id: 16,
    title: 'Global Youth Climate Action Fund 2025',
    organization: 'United Nations Framework Convention on Climate Change (UNFCCC)',
    category: OpportunityCategory.Grants,
    description: 'Grants for youth-led projects addressing climate change in their communities. Open to all African nationals. Projects to be implemented in 2025.',
    deadline: '2025-07-15',
    postedDate: new Date().toISOString().split('T')[0], // Posted today
    country: 'International',
    educationLevel: 'Any',
    link: '#',
  },
  {
    id: 17,
    title: 'AVoHC Rapid Responder - Risk Communication & Community Engagement Expert',
    organization: 'Africa CDC',
    category: OpportunityCategory.Jobs,
    description: 'Volunteer service for the African Volunteers Health Corps (AVoHC) to support public health emergency responses across African Union Member States.',
    deadline: '2025-08-12',
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Posted yesterday
    country: 'International',
    educationLevel: 'Bachelors',
    link: '#',
    details: {
      mandatoryNote: "Please be aware that the use of the AU CV template is MANDATORY. Kindly download the CV, fill it out, and upload it to your profile to apply. This is a crucial step in the application process.",
      purpose: "The Africa CDC seeks to recruit citizens of any AU Member State for the African Volunteers Health Corps (AVoHC) roster. This is a volunteer service role, not direct employment. AVoHC volunteers with expertise in public health, social sciences, epidemiology, and communication are deployed to support Africa CDC's public health emergency responses.",
      mainFunctions: [
        "Provide technical support on risk communication and community engagement to incident management teams at subnational, national, regional, and continental levels.",
        "Work with Ministries of Health and other authorities to strengthen national systems for risk communication during public health emergencies.",
        "Ensure populations and service providers adhere to relevant prevention measures through effective communication strategies."
      ],
      specificResponsibilities: [
        "Strengthen national risk communication policies, regulations, and response capacities.",
        "Enhance the risk communication capacity of health professionals and stakeholders.",
        "Promote protective measures by building trust and engaging with communities and affected populations.",
        "Support the creation and dissemination of tailored public health messages through appropriate channels.",
        "Advance emergency risk communication practices based on a systematic assessment of evidence."
      ],
      academicRequirements: "A BSc degree in Public Health, Communication, Social Sciences, Anthropology, or a related discipline with at least 5 years of relevant work experience, OR a Master's degree in a similar field with at least 2 years of relevant experience. An advanced university degree is desirable.",
      requiredSkills: {
        functional: [
          "Demonstrable expertise in managing complex public health programmes, especially in risk communication and community engagement.",
          "Moderate to strong multimedia skills to develop and disseminate risk communication products.",
          "Excellent organizational, time-management, and presentation skills.",
          "Ability to translate technical information for both technical and lay audiences.",
          "Strong oral communication and interpersonal relationship skills to engage with diverse backgrounds."
        ],
        personal: [
          "Ability to work under pressure and meet tight deadlines.",
          "Strong analytical and problem-solving abilities.",
          "Proven ability to produce precise and intelligible reports.",
          "Ability to operate effectively in a multicultural environment.",
          "High level of autonomy, team spirit, adaptability, and resourcefulness.",
          "Pro-active and solutions-oriented mindset."
        ]
      }
    }
  }
];

export const REGIONS = {
  'Central Africa': ['Angola', 'Cameroon', 'Central African Republic', 'Chad', 'Congo (Brazzaville)', 'Congo (Kinshasa)', 'Equatorial Guinea', 'Gabon', 'Sao Tome and Principe'],
  'East Africa': ['Burundi', 'Comoros', 'Djibouti', 'Eritrea', 'Ethiopia', 'Kenya', 'Madagascar', 'Malawi', 'Mauritius', 'Mozambique', 'Rwanda', 'Seychelles', 'Somalia', 'South Sudan', 'Tanzania', 'Uganda', 'Zambia', 'Zimbabwe'],
  'North Africa': ['Algeria', 'Egypt', 'Libya', 'Morocco', 'Sudan', 'Tunisia'],
  'Southern Africa': ['Botswana', 'Eswatini', 'Lesotho', 'Namibia', 'South Africa'],
  'West Africa': ['Benin', 'Burkina Faso', 'Cabo Verde', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Ivory Coast', 'Liberia', 'Mali', 'Mauritania', 'Niger', 'Nigeria', 'Senegal', 'Sierra Leone', 'Togo'],
};

const AFRICAN_COUNTRIES = [
    'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cameroon', 'Central African Republic', 'Chad', 'Comoros', 'Congo (Brazzaville)', 'Congo (Kinshasa)', 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Ivory Coast', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe',
];

export const COUNTRIES = [
    'All',
    'International',
    ...Object.keys(REGIONS).map(r => `Region: ${r}`).sort(),
    ...AFRICAN_COUNTRIES.sort(),
];

export const OPPORTUNITY_TYPES = ['All', ...Object.values(OpportunityCategory)];
export const EDUCATION_LEVELS = ['All', 'Any', 'High School', 'Bachelors', 'Masters'];
export const DEADLINE_OPTIONS = ['All Upcoming', 'Next 7 Days', 'Next 30 Days', 'Next 3 Months', 'Over 3 Months'];
export const POSTED_WITHIN_OPTIONS = ['All Time', 'Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Last 3 Months'];
export const SORT_OPTIONS = ['Latest Postings', 'Upcoming Deadline'];


export const FORUM_POSTS: ForumPost[] = [
    {
        id: 1,
        author: 'Amina Kone',
        avatarUrl: 'https://picsum.photos/seed/amina/40/40',
        post: 'Just submitted my application for the AfCFTA grant! Fingers crossed. Anyone else applying?',
        timestamp: '2h ago'
    },
    {
        id: 2,
        author: 'Samuel Chege',
        avatarUrl: 'https://picsum.photos/seed/samuel/40/40',
        post: 'The CV templates in the Application Assistant are a lifesaver! Highly recommend using them.',
        timestamp: '5h ago'
    },
    {
        id: 3,
        author: 'Fatima Zahra',
        avatarUrl: 'https://picsum.photos/seed/fatima/40/40',
        post: 'Looking for a mentor with experience in tech startups. Any leads?',
        timestamp: '1d ago'
    }
];