'use client';

import React, { useState } from 'react';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import ExpenseDashboard from '@/components/ExpenseDashboard';
import ExpenseDetailModal from '@/components/ExpenseDetailModal';
import LoginForm from '@/components/LoginForm';
import Header from '@/components/Header';
import RoleGuard from '@/components/RoleGuard';
import ApprovalPage from '@/components/ApprovalPage';
import AdminPage from '@/components/AdminPage';
import { useAuth } from '@/contexts/AuthContext';
import { Expense, ExpenseForm as ExpenseFormType } from '@/types/expense';
import { BarChart3, List, Plus, CheckCircle2, Settings } from 'lucide-react';

export default function Home() {
  console.log('🏠 [DEBUG] Home page component loaded');
  const { isAuthenticated, isLoading } = useAuth();

  console.log('🔐 [DEBUG] Auth state - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  // ローディング中の表示
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  // 未認証の場合はログインフォームを表示
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // 認証済みの場合はメインアプリを表示
  return <AuthenticatedApp />;
}

function AuthenticatedApp() {
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
      date: '2025-08-15',
      category: '会議費',
      amount: 3200,
      description: '部署会議のお茶代',
      status: '承認済み',
      submittedAt: '2025-08-15T09:00:00Z',
      approvedAt: '2025-08-16T11:00:00Z'
    },
    {
      id: '3',
      date: '2025-08-10',
      category: '書籍・研修費',
      amount: 2500,
      description: '技術書購入',
      status: '承認済み',
      submittedAt: '2025-08-10T14:00:00Z',
      approvedAt: '2025-08-11T10:00:00Z'
    },
    {
      id: '4',
      date: '2025-08-19',
      category: '食費',
      amount: 2800,
      description: 'クライアントとの会食費',
      status: '申請中',
      submittedAt: '2025-08-19T16:00:00Z'
    },
    {
      id: '5',
      date: '2025-08-18',
      category: '事務用品',
      amount: 800,
      description: '会議用のノートとペン',
      receipt: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0id2hpdGUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIi8+CiAgPHRleHQgeD0iMTAiIHk9IjIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIj7jgrnjg4bjg7zjgrfjg6fjg4rjg7zkuK3lp4I8L3RleHQ+CiAgPHRleHQgeD0iMTAiIHk9IjQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiPjIwMjUvMDgvMTggMTE6MzA8L3RleHQ+CiAgPGxpbmUgeDE9IjEwIiB5MT0iNTAiIHgyPSIxOTAiIHkyPSI1MCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiLz4KICA8dGV4dCB4PSIxMCIgeT0iNzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+44OO44O844OI77yI5oCh5LqL55SoKTwvdGV4dD4KICA8dGV4dCB4PSIxNjAiIHk9IjcwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPuKCuTMwMDwvdGV4dD4KICA8dGV4dCB4PSIxMCIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+44Oa44Oz77yI5Lqb5YuZ55SoKTwvdGV4dD4KICA8dGV4dCB4PSIxNjAiIHk9IjkwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPuKCuTUwMDwvdGV4dD4KICA8bGluZSB4MT0iMTAiIHkxPSIxMDAiIHgyPSIxOTAiIHkyPSIxMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIi8+CiAgPHRleHQgeD0iMTAiIHk9IjEyMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCI+5ZCI6KiIPC90ZXh0PgogIDx0ZXh0IHg9IjE2MCIgeT0iMTIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSJib2xkIj7igrk4MDA8L3RleHQ+CiAgPHRleHQgeD0iMTAiIHk9IjE0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIj7jgYrpooblrZjjgYLjgorjgYzjgajjgYbjgZTjgYTjgb7jgZfjgZ88L3RleHQ+Cjwvc3ZnPg==',
      status: '差し戻し',
      submittedAt: '2025-08-18T11:00:00Z',
      rejectedAt: '2025-08-19T09:00:00Z',
      rejectionReason: '領収書が添付されていません'
    }
  ]);
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'form' | 'approval' | 'admin'>('dashboard');

  console.log('📱 [DEBUG] Current activeTab:', activeTab);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [viewingExpense, setViewingExpense] = useState<Expense | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { user } = useAuth();

  const handleSubmitExpense = (formData: ExpenseFormType, fileUrl?: string) => {
    processExpenseSubmission(formData, fileUrl);
  };

  const processExpenseSubmission = (formData: ExpenseFormType, receiptUrl?: string) => {
    if (editingExpense) {
      // 編集モード: 既存の経費を更新
      const updatedExpense: Expense = {
        ...editingExpense,
        date: formData.date,
        category: formData.category,
        amount: formData.amount,
        description: formData.description,
        receipt: receiptUrl || editingExpense.receipt,
        status: '申請中',
        submittedAt: new Date().toISOString()
      };
      
      setExpenses(prev => 
        prev.map(expense => 
          expense.id === editingExpense.id ? updatedExpense : expense
        )
      );
      setEditingExpense(null);
    } else {
      // 新規作成モード
      const newExpense: Expense = {
        id: Date.now().toString(),
        date: formData.date,
        category: formData.category,
        amount: formData.amount,
        description: formData.description,
        receipt: receiptUrl,
        status: '申請中',
        submittedAt: new Date().toISOString()
      };
      
      setExpenses(prev => [newExpense, ...prev]);
    }
    
    setActiveTab('list');
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setActiveTab('form');
  };

  const handleViewExpenseDetail = (expense: Expense) => {
    setViewingExpense(expense);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setViewingExpense(null);
  };

  // 承認機能
  const handleApproveExpense = (expenseId: string) => {
    setExpenses(prev => 
      prev.map(expense => 
        expense.id === expenseId 
          ? { 
              ...expense, 
              status: '承認済み' as const, 
              approvedAt: new Date().toISOString() 
            }
          : expense
      )
    );
  };

  // 差し戻し機能
  const handleRejectExpense = (expenseId: string, reason: string) => {
    setExpenses(prev => 
      prev.map(expense => 
        expense.id === expenseId 
          ? { 
              ...expense, 
              status: '差し戻し' as const, 
              rejectedAt: new Date().toISOString(),
              rejectionReason: reason
            }
          : expense
      )
    );
  };

  // サンプルユーザーデータ（実際の実装では認証コンテキストから取得）
  const sampleUsers = [
    {
      id: '1',
      name: '田中 太郎',
      email: 'tanaka@company.com',
      role: '社員' as const,
      department: '営業部',
      createdAt: '2025-01-01T00:00:00Z',
      lastLoginAt: '2025-08-22T09:00:00Z'
    },
    {
      id: '2',
      name: '佐藤 花子',
      email: 'sato@company.com',
      role: '承認者' as const,
      department: '営業部',
      createdAt: '2025-01-01T00:00:00Z',
      lastLoginAt: '2025-08-22T08:30:00Z'
    },
    {
      id: '3',
      name: '山田 管理',
      email: 'admin@company.com',
      role: 'Admin' as const,
      department: '管理部',
      createdAt: '2025-01-01T00:00:00Z',
      lastLoginAt: '2025-08-22T08:00:00Z'
    }
  ];

  // 役割ベースのタブ設定
  const getTabsForRole = () => {
    const baseTabs = [
      { id: 'dashboard', name: 'ダッシュボード', icon: BarChart3 },
      { id: 'list', name: '経費一覧', icon: List }
    ];

    // 社員の場合：申請のみ
    if (user?.role === '社員') {
      return [
        ...baseTabs,
        { id: 'form', name: '新規申請', icon: Plus }
      ];
    }

    // 承認者の場合：承認機能を追加
    if (user?.role === '承認者') {
      return [
        ...baseTabs,
        { id: 'form', name: '新規申請', icon: Plus },
        { id: 'approval', name: '承認・差し戻し', icon: CheckCircle2 }
      ];
    }

    // 管理者の場合：管理機能を追加
    if (user?.role === 'Admin') {
      return [
        ...baseTabs,
        { id: 'form', name: '新規申請', icon: Plus },
        { id: 'approval', name: '承認・差し戻し', icon: CheckCircle2 },
        { id: 'admin', name: '管理設定', icon: Settings }
      ];
    }

    return baseTabs;
  };

  const tabs = getTabsForRole();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <Header />

      {/* ナビゲーション */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    console.log('🎯 [DEBUG] Tab clicked:', tab.id);
                    setActiveTab(tab.id as typeof activeTab);
                  }}
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
        {(() => {
          console.log('🎛️ [DEBUG] Rendering main content with activeTab:', activeTab);
          return null;
        })()}
        
        {activeTab === 'dashboard' && (
          <ExpenseDashboard expenses={expenses} />
        )}
        
        {activeTab === 'list' && (
          <ExpenseList 
            expenses={expenses} 
            onEdit={user?.role === '社員' ? handleEditExpense : undefined}
            onViewDetail={handleViewExpenseDetail}
          />
        )}
        
        {activeTab === 'form' && (() => {
          console.log('🎛️ [DEBUG] Rendering form tab with user role:', user?.role);
          return (
            <RoleGuard allowedRoles={['社員', '承認者', 'Admin']}>
              <ExpenseForm 
                onSubmit={handleSubmitExpense}
                onCancel={() => {
                  setEditingExpense(null);
                  setActiveTab('list');
                }}
                editingExpense={editingExpense}
              />
            </RoleGuard>
          );
        })()}

        {activeTab === 'approval' && (
          <RoleGuard allowedRoles={['承認者', 'Admin']}>
            <ApprovalPage
              expenses={expenses}
              onApprove={handleApproveExpense}
              onReject={handleRejectExpense}
            />
          </RoleGuard>
        )}

        {activeTab === 'admin' && (
          <RoleGuard allowedRoles={['Admin']}>
            <AdminPage
              expenses={expenses}
              users={sampleUsers}
            />
          </RoleGuard>
        )}
      </main>

      {/* 詳細モーダル */}
      <ExpenseDetailModal
        expense={viewingExpense}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </div>
  );
}
