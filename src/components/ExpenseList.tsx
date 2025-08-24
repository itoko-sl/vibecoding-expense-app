'use client';

import React from 'react';
import { format } from 'date-fns';
import { Clock, CheckCircle, XCircle, Edit, Paperclip } from 'lucide-react';
import { Expense } from '@/types/expense';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit?: (expense: Expense) => void;
  onViewDetail?: (expense: Expense) => void;
}

const statusConfig = {
  '下書き': {
    icon: Edit,
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    label: '下書き'
  },
  '申請中': {
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    label: '申請中'
  },
  '承認済み': {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: '承認済み'
  },
  '差し戻し': {
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    label: '差し戻し'
  }
};

export default function ExpenseList({ expenses, onEdit, onViewDetail }: ExpenseListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy年MM月dd日');
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500 text-lg">経費申請がありません</p>
        <p className="text-gray-400 text-sm mt-2">新しい経費を申請してください</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">経費申請一覧</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {expenses.map((expense) => {
          const StatusIcon = statusConfig[expense.status].icon;
          
          return (
            <div key={expense.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => onViewDetail?.(expense)}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-lg font-medium text-gray-900">
                      {expense.category}
                    </span>
                    {expense.receipt && (
                      <span className="inline-flex items-center text-xs text-gray-500">
                        <Paperclip className="w-3 h-3 mr-1" />
                        レシート添付
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[expense.status].bgColor} ${statusConfig[expense.status].color}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig[expense.status].label}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-2">{expense.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>使用日: {formatDate(expense.date)}</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                  
                  {expense.status === '差し戻し' && expense.rejectionReason && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-700">
                        <strong>差し戻し理由:</strong> {expense.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="ml-4 flex space-x-2">
                  {/* 詳細ボタン */}
                  {onViewDetail && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetail(expense);
                      }}
                      className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      詳細
                    </button>
                  )}
                  
                  {/* 編集ボタン */}
                  {onEdit && (expense.status === '下書き' || expense.status === '差し戻し') && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(expense);
                      }}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      編集
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
