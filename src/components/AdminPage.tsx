'use client';

import React, { useState } from 'react';
import { Users, BarChart3, Settings, Download, Filter } from 'lucide-react';
import { Expense } from '@/types/expense';
import { User } from '@/types/user';

interface AdminPageProps {
  expenses: Expense[];
  users: User[];
}

export default function AdminPage({ expenses, users }: AdminPageProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // レシート表示
  const showReceiptModal = (receiptUrl: string) => {
    setSelectedReceipt(receiptUrl);
    setIsReceiptModalOpen(true);
  };

  const closeReceiptModal = () => {
    setSelectedReceipt(null);
    setIsReceiptModalOpen(false);
  };

  // 部署一覧を取得
  const departments = Array.from(new Set(users.map(user => user.department).filter(Boolean)));

  // フィルタリングされた経費
  const filteredExpenses = expenses.filter(expense => {
    if (selectedDepartment !== 'all') {
      const expenseUser = users.find(user => user.id === expense.id); // 実際の実装では申請者IDを経費に含める必要があります
      if (!expenseUser || expenseUser.department !== selectedDepartment) {
        return false;
      }
    }
    if (selectedStatus !== 'all' && expense.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  // 統計データ
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingCount = filteredExpenses.filter(e => e.status === '申請中').length;
  const approvedCount = filteredExpenses.filter(e => e.status === '承認済み').length;
  const rejectedCount = filteredExpenses.filter(e => e.status === '差し戻し').length;

  // 部署別統計
  const departmentStats = departments.map(dept => {
    const deptUsers = users.filter(user => user.department === dept);
    const deptExpenses = expenses.filter(expense => {
      // 実際の実装では申請者IDを使用
      return true; // 仮の実装
    });
    const deptTotal = deptExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      department: dept,
      userCount: deptUsers.length,
      expenseCount: deptExpenses.length,
      totalAmount: deptTotal
    };
  });

  const exportToCSV = () => {
    const csvData = filteredExpenses.map(expense => ({
      日付: expense.date,
      カテゴリ: expense.category,
      金額: expense.amount,
      説明: expense.description,
      レシート有無: expense.receipt ? 'あり' : 'なし',
      ステータス: expense.status,
      申請日: expense.submittedAt
    }));

    const csvContent = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Settings className="mr-3 h-6 w-6 text-purple-600" />
          管理者ダッシュボード
        </h2>
      </div>

      {/* 統計サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-800">総経費額</p>
              <p className="text-2xl font-bold text-blue-900">¥{totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-800">申請中</p>
              <p className="text-2xl font-bold text-yellow-900">{pendingCount}件</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-800">承認済み</p>
              <p className="text-2xl font-bold text-green-900">{approvedCount}件</p>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-red-800">差し戻し</p>
              <p className="text-2xl font-bold text-red-900">{rejectedCount}件</p>
            </div>
          </div>
        </div>
      </div>

      {/* フィルター */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            フィルター
          </h3>
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
          >
            <Download className="w-4 h-4 mr-2" />
            CSVエクスポート
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
              部署
            </label>
            <select
              id="department"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">すべての部署</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              ステータス
            </label>
            <select
              id="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">すべてのステータス</option>
              <option value="申請中">申請中</option>
              <option value="承認済み">承認済み</option>
              <option value="差し戻し">差し戻し</option>
            </select>
          </div>
        </div>
      </div>

      {/* 部署別統計 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">部署別統計</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  部署
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  社員数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  申請件数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  総経費額
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departmentStats.map((stat) => (
                <tr key={stat.department}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {stat.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stat.userCount}人
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stat.expenseCount}件
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ¥{stat.totalAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 経費一覧 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          全社員の経費一覧 ({filteredExpenses.length}件)
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  日付
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  カテゴリ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  説明
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金額
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  レシート
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.slice(0, 50).map((expense) => (
                <tr key={expense.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ¥{expense.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {expense.receipt ? (
                      <div className="flex items-center space-x-2">
                        <img
                          src={expense.receipt}
                          alt="レシート"
                          className="w-12 h-12 object-cover rounded-md border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => showReceiptModal(expense.receipt!)}
                        />
                        <span className="text-xs text-gray-500">クリックで拡大</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">なし</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      expense.status === '承認済み' 
                        ? 'bg-green-100 text-green-800'
                        : expense.status === '申請中'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {expense.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredExpenses.length > 50 && (
          <p className="text-sm text-gray-500 mt-4 text-center">
            最新50件を表示中（全{filteredExpenses.length}件）
          </p>
        )}
      </div>

      {/* レシート表示モーダル */}
      {isReceiptModalOpen && selectedReceipt && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={closeReceiptModal}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">レシート画像</h3>
              <button
                onClick={closeReceiptModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedReceipt}
                alt="レシート拡大表示"
                className="max-w-full h-auto mx-auto"
              />
            </div>
            <div className="flex justify-end p-4 border-t border-gray-200">
              <button
                onClick={() => window.open(selectedReceipt, '_blank')}
                className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                新しいタブで開く
              </button>
              <button
                onClick={closeReceiptModal}
                className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
