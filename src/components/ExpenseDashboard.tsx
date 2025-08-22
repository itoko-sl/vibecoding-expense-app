'use client';

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Clock } from 'lucide-react';
import { Expense } from '@/types/expense';

interface ExpenseDashboardProps {
  expenses: Expense[];
}

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
  
  const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingTotal = pendingExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const monthlyChange = lastMonthTotal > 0 
    ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 
    : 0;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount);
  };

  const stats = [
    {
      name: '今月の承認済み経費',
      value: formatCurrency(thisMonthTotal),
      change: monthlyChange,
      changeType: monthlyChange >= 0 ? 'increase' : 'decrease',
      icon: DollarSign,
    },
    {
      name: '申請中の経費',
      value: formatCurrency(pendingTotal),
      count: `${pendingExpenses.length}件`,
      icon: Clock,
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">ダッシュボード</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow-md rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-8 w-8 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        {'count' in stat && (
                          <div className="ml-2 text-sm text-gray-500">
                            {stat.count}
                          </div>
                        )}
                        {'change' in stat && stat.change !== undefined && stat.change !== 0 && (
                          <div className="ml-2 flex items-baseline text-sm font-semibold">
                            {stat.changeType === 'increase' ? (
                              <TrendingUp className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                            )}
                            <span className={stat.changeType === 'increase' ? 'text-green-900' : 'text-red-900'}>
                              {Math.abs(stat.change).toFixed(1)}%
                            </span>
                            <span className="text-gray-500 ml-1">前月比</span>
                          </div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* カテゴリ別統計 */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">今月のカテゴリ別経費</h3>
        {thisMonthExpenses.length === 0 ? (
          <p className="text-gray-500">今月の承認済み経費はありません</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(
              thisMonthExpenses.reduce((acc, expense) => {
                acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
                return acc;
              }, {} as Record<string, number>)
            )
              .sort(([,a], [,b]) => b - a)
              .map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{category}</span>
                  <span className="text-sm text-gray-900">{formatCurrency(amount)}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
