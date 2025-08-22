'use client';

import React, { useState } from 'react';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import ExpenseDashboard from '@/components/ExpenseDashboard';
import { Expense, ExpenseForm as ExpenseFormType } from '@/types/expense';
import { Receipt, BarChart3, List, Plus } from 'lucide-react';

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([
    // サンプルデータ
    {
      id: '1',
      date: '2025-08-20',
      category: '交通費',
      amount: 1500,
      description: '顧客訪問のための電車代',
      status: '承認済み',
      submittedAt: '2025-08-20T10:00:00Z',
      approvedAt: '2025-08-21T14:00:00Z'
    },
    {
      id: '2',
      date: '2025-08-19',
      category: '食費',
      amount: 3000,
      description: 'クライアントとの会食費',
      status: '申請中',
      submittedAt: '2025-08-19T16:00:00Z'
    },
    {
      id: '3',
      date: '2025-08-18',
      category: '事務用品',
      amount: 800,
      description: '会議用のノートとペン',
      status: '差し戻し',
      submittedAt: '2025-08-18T11:00:00Z',
      rejectedAt: '2025-08-19T09:00:00Z',
      rejectionReason: '領収書が添付されていません'
    }
  ]);
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'form'>('dashboard');

  const handleSubmitExpense = (formData: ExpenseFormType) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      date: formData.date,
      category: formData.category,
      amount: formData.amount,
      description: formData.description,
      status: '申請中',
      submittedAt: new Date().toISOString()
    };
    
    setExpenses(prev => [newExpense, ...prev]);
    setActiveTab('list');
  };

  const handleEditExpense = (expense: Expense) => {
    // 編集機能は簡略化のため省略
    console.log('編集:', expense);
  };

  const tabs = [
    { id: 'dashboard', name: 'ダッシュボード', icon: BarChart3 },
    { id: 'list', name: '経費一覧', icon: List },
    { id: 'form', name: '新規申請', icon: Plus }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Receipt className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                経費申請システム
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              社員用ポータル
            </div>
          </div>
        </div>
      </header>

      {/* ナビゲーション */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' && (
          <ExpenseDashboard expenses={expenses} />
        )}
        
        {activeTab === 'list' && (
          <ExpenseList 
            expenses={expenses} 
            onEdit={handleEditExpense}
          />
        )}
        
        {activeTab === 'form' && (
          <ExpenseForm 
            onSubmit={handleSubmitExpense}
            onCancel={() => setActiveTab('list')}
          />
        )}
      </main>
    </div>
  );
}
