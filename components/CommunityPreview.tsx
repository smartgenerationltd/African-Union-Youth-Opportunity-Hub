

import React from 'react';
import { FORUM_POSTS } from '../constants';
import { ChatAlt2Icon } from './Icons';
import { useTranslation } from '../contexts/Translation';

export const CommunityPreview: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
                <ChatAlt2Icon className="w-6 h-6 text-au-green mr-2" />
                <h2 className="text-2xl font-bold text-au-green">{t('communityYouthCommunity')}</h2>
            </div>
            <div className="space-y-4">
                {FORUM_POSTS.map(post => (
                    <div key={post.id} className="flex items-start space-x-3">
                        <img src={post.avatarUrl} alt={post.author} className="w-10 h-10 rounded-full" />
                        <div>
                            <p className="font-semibold text-sm">{post.author}</p>
                            <p className="text-gray-700 text-sm">{post.post}</p>
                            <p className="text-xs text-gray-400 mt-1">{post.timestamp}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-4 bg-au-gold text-au-dark font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
                {t('communityJoinConversation')}
            </button>
        </div>
    );
};
