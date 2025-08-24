'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, FileText, MessageSquare } from 'lucide-react';
import { Expense } from '@/types/expense';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ApprovalActionsProps {
  expense: Expense;
  onApprove: (expenseId: string) => void;
  onReject: (expenseId: string, reason: string) => void;
}

export default function ApprovalActions({ expense, onApprove, onReject }: ApprovalActionsProps) {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = () => {
    onApprove(expense.id);
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(expense.id, rejectionReason);
      setRejectionReason('');
      setShowRejectForm(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy年MM月dd日', { locale: ja });
  };

  if (expense.status !== '申請中') {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{expense.category}</h3>
          <p className="text-gray-600 mt-1">{expense.description}</p>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span>使用日: {formatDate(expense.date)}</span>
            <span className="text-lg font-semibold text-blue-600">
              {formatCurrency(expense.amount)}
            </span>
          </div>
        </div>
        
        {expense.receipt && (
          <div className="ml-4">
            <img
              src={expense.receipt}
              alt="レシート"
              className="w-20 h-20 object-cover rounded-md border border-gray-200 cursor-pointer"
              onClick={() => window.open(expense.receipt, '_blank')}
            />
            <p className="text-xs text-gray-500 mt-1 text-center">レシート</p>
          </div>
        )}
      </div>

      {!showRejectForm ? (
        <div className="flex space-x-3">
          <button
            onClick={handleApprove}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            承認
          </button>
          
          <button
            onClick={() => setShowRejectForm(true)}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <XCircle className="w-4 h-4 mr-2" />
            差し戻し
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-2">
              差し戻し理由
            </label>
            <textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="差し戻しの理由を入力してください..."
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              差し戻し実行
            </button>
            
            <button
              onClick={() => {
                setShowRejectForm(false);
                setRejectionReason('');
              }}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
