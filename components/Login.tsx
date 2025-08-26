import React, { useState } from 'react';
import { GlobeIcon, GoogleIcon, LinkedInIcon, MicrosoftIcon } from './Icons';
import { useTranslation } from '../contexts/Translation';

interface LoginProps {
  onLogin: (isAdmin: boolean, email: string) => void;
}

const SocialButton: React.FC<{ onClick: () => void; text: string; icon: React.ReactNode; className: string; }> = ({ onClick, text, icon, className }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-center py-2.5 px-4 rounded-lg font-semibold text-base transition-transform transform hover:scale-105 ${className}`}
    >
        {icon}
        <span className="ml-3">{text}</span>
    </button>
);

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Hardcoded admin credentials
    if (email === 'admin@au.org' && password === 'admin123') {
      onLogin(true, email); // Login as admin
      return;
    }

    const users = JSON.parse(localStorage.getItem('au-users') || '{}');

    if (isRegistering) {
      // Sign Up
      if (users[email]) {
        setError('An account with this email already exists. Please sign in.');
      } else {
        // In a real app, you would hash the password before storing.
        users[email] = { password };
        localStorage.setItem('au-users', JSON.stringify(users));
        
        // Create a default profile for the new user
        const defaultProfile = {
          name: 'New User',
          email: email,
          bio: `I am a new user from [Your Country], passionate about [Your Interests]. I have skills in [Your Skills] and recently completed [Your Education]. I am looking for opportunities in [Your Desired Field].`,
          skills: [],
          interests: [],
          country: 'Nigeria',
          educationLevel: 'Any',
        };
        localStorage.setItem(`au-hub-profile-${email}`, JSON.stringify(defaultProfile));

        onLogin(false, email);
      }
    } else {
      // Sign In
      if (users[email]) {
        // In a real app, you would verify the password hash.
        // For this mock, we just check if the user exists.
        onLogin(false, email);
      } else {
        setError('No account found with this email. Please sign up.');
      }
    }
  };

  const handleSocialLogin = () => {
    // Social logins bypass the email/password check for this simulation
    const socialEmail = 'social-user@example.com';
    const existingProfile = localStorage.getItem(`au-hub-profile-${socialEmail}`);
    if (!existingProfile) {
        const defaultProfile = {
          name: 'Social User',
          email: socialEmail,
          bio: `I am a new user from [Your Country], passionate about [Your Interests]. I have skills in [Your Skills] and recently completed [Your Education]. I am looking for opportunities in [Your Desired Field].`,
          skills: [],
          interests: [],
          country: 'Nigeria',
          educationLevel: 'Any',
        };
        localStorage.setItem(`au-hub-profile-${socialEmail}`, JSON.stringify(defaultProfile));
    }
    onLogin(false, socialEmail); // Social logins are for regular users
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-sans p-4">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-2xl shadow-xl text-center">
        
        <div className="flex flex-col items-center space-y-2">
            <div className="bg-au-green p-4 rounded-full">
                <GlobeIcon className="w-10 h-10 text-au-gold" />
            </div>
            <h1 className="text-3xl font-bold text-au-green tracking-tight">{t('headerTitle')}</h1>
            <p className="text-sm text-gray-500 italic">{t('headerSlogan')}</p>
        </div>

        <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {isRegistering ? t('loginCreateAccount') : t('loginWelcome')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isRegistering ? t('loginSignUpPrompt') : t('loginSignInPrompt')}
            </p>
        </div>

        <form className="space-y-4" onSubmit={handleEmailAuth}>
          <input
            type="email"
            placeholder={t('emailAddress')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-au-gold"
            required
          />
          <input
            type="password"
            placeholder={t('password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-au-gold"
            required
          />
          {error && <p className="text-red-500 text-sm text-left">{error}</p>}
          <button type="submit" className="w-full py-3 px-4 bg-au-green text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors">
            {isRegistering ? t('signUp') : t('signIn')}
          </button>
        </form>

        <div className="flex items-center">
            <div className="flex-grow bg-gray-200 h-px"></div>
            <span className="flex-shrink text-sm text-gray-500 px-4">{t('or')}</span>
            <div className="flex-grow bg-gray-200 h-px"></div>
        </div>
        
        <div className="space-y-3">
            <SocialButton 
                onClick={handleSocialLogin} 
                text={isRegistering ? t('signUpWithGoogle') : t('signInWithGoogle')}
                icon={<GoogleIcon className="w-5 h-5" />}
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            />
            <SocialButton 
                onClick={handleSocialLogin} 
                text={isRegistering ? t('signUpWithLinkedIn') : t('signInWithLinkedIn')}
                icon={<LinkedInIcon className="w-5 h-5 text-white" />}
                className="bg-[#0077B5] text-white hover:bg-[#00669c]"
            />
            <SocialButton 
                onClick={handleSocialLogin} 
                text={isRegistering ? t('signUpWithMicrosoft') : t('signInWithMicrosoft')}
                icon={<MicrosoftIcon className="w-5 h-5 text-gray-700" />}
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            />
        </div>

        <div className="text-sm text-gray-600">
            {isRegistering ? (
                <>
                    {t('alreadyHaveAccount')}{' '}
                    <button onClick={() => { setIsRegistering(false); setError(''); }} className="font-semibold text-au-green hover:underline focus:outline-none">
                        {t('signIn')}
                    </button>
                </>
            ) : (
                <>
                    {t('dontHaveAccount')}{' '}
                    <button onClick={() => { setIsRegistering(true); setError(''); }} className="font-semibold text-au-green hover:underline focus:outline-none">
                        {t('signUp')}
                    </button>
                </>
            )}
        </div>
        
      </div>
    </div>
  );
};
