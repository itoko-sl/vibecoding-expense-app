'use client';

import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
import { Expense } from '@/types/expense';
import ApprovalActions from './ApprovalActions';

interface ApprovalPageProps {
  expenses: Expense[];
  onApprove: (expenseId: string) => void;
  onReject: (expenseId: string, reason: string) => void;
}

export default function ApprovalPage({ expenses, onApprove, onReject }: ApprovalPageProps) {
  const pendingExpenses = expenses.filter(expense => expense.status === '申請中');
  const completedExpenses = expenses.filter(expense => expense.status !== '申請中');

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <CheckCircle2 className="mr-3 h-6 w-6 text-green-600" />
          承認・差し戻し管理
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-yellow-800">承認待ち</p>
                <p className="text-2xl font-bold text-yellow-900">{pendingExpenses.length}件</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle2 className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-green-800">処理済み</p>
                <p className="text-2xl font-bold text-green-900">{completedExpenses.length}件</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 承認待ちの申請 */}
      {pendingExpenses.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">承認待ちの申請</h3>
          <div className="space-y-4">
            {pendingExpenses.map((expense) => (
              <ApprovalActions
                key={expense.id}
                expense={expense}
                onApprove={onApprove}
                onReject={onReject}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">承認待ちの申請はありません</h3>
          <p className="text-gray-500">すべての申請が処理済みです。</p>
        </div>
      )}

      {/* 処理済みの申請（最新5件） */}
      {completedExpenses.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">最近処理した申請</h3>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="divide-y divide-gray-200">
              {completedExpenses.slice(0, 5).map((expense) => (
                <div key={expense.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{expense.category}</h4>
                      <p className="text-sm text-gray-500">{expense.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ¥{expense.amount.toLocaleString()}
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        expense.status === '承認済み' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {expense.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
