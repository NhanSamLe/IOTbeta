import React from 'react';
import { Users, Activity, Database, BarChart3 } from 'lucide-react';

interface NavigationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const pages = [
    { id: 1, name: 'Thông tin đề tài', icon: Users },
    { id: 2, name: 'Bảng điều khiển', icon: Activity },
    { id: 3, name: 'Cơ sở dữ liệu', icon: Database },
    { id: 4, name: 'Biểu đồ', icon: BarChart3 },
  ];

  return (
    <nav className="bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Hệ thống cảnh báo tránh vật cản
            </h1>
          </div>
          
          <div className="flex space-x-2">
            {pages.map((page) => {
              const Icon = page.icon;
              return (
                <button
                  key={page.id}
                  onClick={() => onPageChange(page.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    currentPage === page.id
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 transform scale-105'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50 hover:shadow-md'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{page.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};