'use client';

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Clock, CheckCircle, XCircle, FileText, Calendar, BarChart3, PieChart } from 'lucide-react';
import { Expense } from '@/types/expense';

interface ExpenseDashboardProps {
  expenses: Expense[];
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY'
  }).format(amount);
};

export default function ExpenseDashboard({ expenses }: ExpenseDashboardProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  // 今月の経費
  const thisMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && 
           expenseDate.getFullYear() === currentYear &&
           expense.status === '承認済み';
  });
  
  // 先月の経費
  const lastMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return expenseDate.getMonth() === lastMonth && 
           expenseDate.getFullYear() === lastMonthYear &&
           expense.status === '承認済み';
  });
  
  // 申請中の経費
  const pendingExpenses = expenses.filter(expense => expense.status === '申請中');
  
  // 全ステータス別の統計
  const approvedExpenses = expenses.filter(expense => expense.status === '承認済み');
  const draftExpenses = expenses.filter(expense => expense.status === '下書き');
  const rejectedExpenses = expenses.filter(expense => expense.status === '差し戻し');
  
  const approvedTotal = approvedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingTotal = pendingExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const draftTotal = draftExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const rejectedTotal = rejectedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const monthlyChange = lastMonthTotal > 0 
    ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 
    : 0;

  // カテゴリ別統計
  const categoryStats = expenses.reduce((acc, expense) => {
    if (expense.status === '承認済み') {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryStats)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  // 月別推移データ（過去6ヶ月）
  const monthlyData: Array<{month: string, amount: number, count: number}> = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.getMonth();
    const year = date.getFullYear();
    
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === month && 
             expenseDate.getFullYear() === year &&
             expense.status === '承認済み';
    });
    
    const total = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    monthlyData.push({
      month: `${year}/${String(month + 1).padStart(2, '0')}`,
      amount: total,
      count: monthExpenses.length
    });
  }

  // 最新の申請（最大10件）
  const recentExpenses = expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const stats = [
    {
      title: '今月の承認済み経費',
      value: formatCurrency(thisMonthTotal),
      change: monthlyChange,
      changeType: monthlyChange >= 0 ? 'increase' : 'decrease',
      icon: DollarSign,
    },
    {
      title: '申請中',
      value: formatCurrency(pendingTotal),
      count: `${pendingExpenses.length}件`,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    {
      title: '承認済み',
      value: formatCurrency(approvedTotal),
      count: `${approvedExpenses.length}件`,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      title: '差し戻し',
      value: formatCurrency(rejectedTotal),
      count: `${rejectedExpenses.length}件`,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`bg-white shadow-md rounded-lg p-6 border-l-4 ${
                stat.borderColor || 'border-blue-500'
              } ${stat.bgColor || ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${stat.color || 'text-gray-600'}`}>
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${stat.color || 'text-gray-900'}`}>
                    {stat.value}
                  </p>
                  {stat.count && (
                    <p className={`text-sm ${stat.color || 'text-gray-500'}`}>
                      {stat.count}
                    </p>
                  )}
                  {stat.change !== undefined && (
                    <div className="flex items-center mt-2">
                      {stat.changeType === 'increase' ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {Math.abs(stat.change).toFixed(1)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">前月比</span>
                    </div>
                  )}
                </div>
                <Icon className={`h-8 w-8 ${stat.color || 'text-blue-500'}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* カテゴリ別統計 */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <PieChart className="mr-2 h-5 w-5" />
          カテゴリ別経費（承認済み）
        </h3>
        {categoryData.length === 0 ? (
          <p className="text-gray-500">承認済み経費はありません</p>
        ) : (
          <div className="space-y-4">
            {/* カテゴリ別バーチャート */}
            <div className="space-y-3">
              {categoryData.map((item, index) => {
                const maxAmount = Math.max(...categoryData.map(d => d.amount));
                const widthPercentage = (item.amount / maxAmount) * 100;
                const colors = [
                  'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 
                  'bg-purple-500', 'bg-indigo-500', 'bg-pink-500', 'bg-gray-500'
                ];
                const color = colors[index % colors.length];
                
                return (
                  <div key={item.category} className="flex items-center space-x-3">
                    <div className="w-24 text-sm font-medium text-gray-700 truncate">
                      {item.category}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded-full h-6 relative">
                        <div 
                          className={`${color} h-6 rounded-full flex items-center justify-center text-white text-xs font-medium`}
                          style={{ width: `${Math.max(widthPercentage, 8)}%` }}
                        >
                          {widthPercentage > 15 && formatCurrency(item.amount)}
                        </div>
                      </div>
                    </div>
                    <div className="w-20 text-sm text-gray-900 text-right">
                      {widthPercentage <= 15 && formatCurrency(item.amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 月別推移チャート */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <BarChart3 className="mr-2 h-5 w-5" />
          過去6ヶ月の経費推移
        </h3>
        <div className="space-y-4">
          <div className="flex items-end space-x-2 h-48">
            {monthlyData.map((data, index) => {
              const maxAmount = Math.max(...monthlyData.map(d => d.amount));
              const heightPercentage = maxAmount > 0 ? (data.amount / maxAmount) * 100 : 0;
              
              return (
                <div key={data.month} className="flex-1 flex flex-col items-center">
                  <div 
                    className="bg-blue-500 rounded-t-md w-full min-h-[4px] flex items-end justify-center relative group cursor-pointer"
                    style={{ height: `${Math.max(heightPercentage, 2)}%` }}
                  >
                    {/* ツールチップ */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      {formatCurrency(data.amount)} ({data.count}件)
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-top-left">
                    {data.month}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* 月別データテーブル */}
          <div className="mt-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      月
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      件数
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      金額
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {monthlyData.map((data) => (
                    <tr key={data.month}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {data.month}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {data.count}件
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(data.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 最新の申請 */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          最新の申請
        </h3>
        {recentExpenses.length === 0 ? (
          <p className="text-gray-500">申請がありません</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    日付
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    カテゴリ
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    金額
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {expense.date}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {expense.category}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
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
        )}
      </div>
    </div>
  );
}
