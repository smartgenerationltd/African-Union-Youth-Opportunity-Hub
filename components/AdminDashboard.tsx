import React, { useState, useEffect } from 'react';
import { Opportunity } from '../types';
import { BriefcaseIcon, UsersIcon, PencilAltIcon, XIcon } from './Icons';
import { useTranslation } from '../contexts/Translation';

interface AdminDashboardProps {
  opportunities: Opportunity[];
  onAddNew: () => void;
  onEdit: (opportunity: Opportunity) => void;
  onDelete: (id: number) => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; }> = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4">
    <div className="bg-au-green/10 p-3 rounded-full">
        {icon}
    </div>
    <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-au-dark">{value}</p>
    </div>
  </div>
);

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ opportunities, onAddNew, onEdit, onDelete }) => {
  const [userCount, setUserCount] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    try {
      const users = JSON.parse(localStorage.getItem('au-users') || '{}');
      setUserCount(Object.keys(users).length);
    } catch (e) {
      console.error("Failed to parse users from localStorage", e);
      setUserCount(0);
    }
  }, []);

  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-extrabold text-au-green mb-8">{t('adminDashboardTitle')}</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title={t('adminDashboardTotalOpps')} value={opportunities.length} icon={<BriefcaseIcon className="w-6 h-6 text-au-green" />} />
          <StatCard title={t('adminDashboardRegisteredUsers')} value={userCount} icon={<UsersIcon className="w-6 h-6 text-au-green" />} />
          {/* Add more stats later if needed */}
      </div>

      {/* Opportunity Management Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-au-green">{t('adminDashboardManageOpps')}</h2>
          <button
            onClick={onAddNew}
            className="bg-au-green text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            {t('adminDashboardAddNewOpp')}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Title</th>
                <th scope="col" className="px-6 py-3">Organization</th>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">{t('deadline')}</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map(op => (
                <tr key={op.id} className="bg-white border-b hover:bg-gray-50">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{op.title}</th>
                  <td className="px-6 py-4">{op.organization}</td>
                  <td className="px-6 py-4">{op.category}</td>
                  <td className="px-6 py-4">{op.deadline}</td>
                  <td className="px-6 py-4 flex space-x-2 justify-end">
                    <button onClick={() => onEdit(op)} className="p-2 text-gray-500 hover:text-au-green rounded-full hover:bg-gray-100 transition-colors" aria-label="Edit">
                      <PencilAltIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => onDelete(op.id)} className="p-2 text-gray-500 hover:text-au-red rounded-full hover:bg-gray-100 transition-colors" aria-label="Delete">
                      <XIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {opportunities.length === 0 && (
             <p className="text-center text-gray-500 py-8">{t('noOpportunitiesFound')}</p>
          )}
        </div>
      </div>
    </main>
  );
};
