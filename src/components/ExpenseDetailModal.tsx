'use client';

import React from 'react';
import { X, Calendar, DollarSign, Tag, FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Expense } from '@/types/expense';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ExpenseDetailModalProps {
  expense: Expense | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExpenseDetailModal({ expense, isOpen, onClose }: ExpenseDetailModalProps) {
  if (!isOpen || !expense) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case '承認済み': return 'text-green-600 bg-green-50';
      case '申請中': return 'text-yellow-600 bg-yellow-50';
      case '差し戻し': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '承認済み': return <CheckCircle className="w-4 h-4" />;
      case '申請中': return <Clock className="w-4 h-4" />;
      case '差し戻し': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '不明';
    return format(new Date(dateString), 'yyyy年M月d日 HH:mm', { locale: ja });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">経費詳細</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6 space-y-6">
          {/* ステータス */}
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(expense.status)}`}>
              {getStatusIcon(expense.status)}
              <span className="ml-2">{expense.status}</span>
            </span>
          </div>

          {/* 基本情報 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">申請日</div>
                  <div className="font-medium text-gray-900">{expense.date}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Tag className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">カテゴリ</div>
                  <div className="font-medium text-gray-900">{expense.category}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">金額</div>
                  <div className="font-medium text-gray-900">¥{expense.amount.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <div className="text-sm text-gray-500">説明</div>
                  <div className="font-medium text-gray-900">{expense.description}</div>
                </div>
              </div>

              {/* レシート表示 */}
              {expense.receipt && (
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="w-full">
                    <div className="text-sm text-gray-500 mb-2">レシート</div>
                    <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                      <img
                        src={expense.receipt}
                        alt="レシート"
                        className="max-w-full h-auto max-h-64 object-contain cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => window.open(expense.receipt, '_blank')}
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      クリックで拡大表示
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* タイムライン */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">処理履歴</h3>
            <div className="space-y-4">
              {/* 申請 */}
              {expense.submittedAt && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">申請提出</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(expense.submittedAt)}
                    </div>
                  </div>
                </div>
              )}

              {/* 承認/差し戻し */}
              {expense.approvedAt && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">承認完了</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(expense.approvedAt)}
                    </div>
                  </div>
                </div>
              )}

              {expense.rejectedAt && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">差し戻し</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(expense.rejectedAt)}
                    </div>
                    {expense.rejectionReason && (
                      <div className="text-sm text-red-600 mt-1">
                        理由: {expense.rejectionReason}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
