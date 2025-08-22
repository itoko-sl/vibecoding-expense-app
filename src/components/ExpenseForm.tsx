'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Upload, Calendar, DollarSign, FileText, Tag } from 'lucide-react';
import { ExpenseForm, ExpenseCategory } from '@/types/expense';

const categories: ExpenseCategory[] = [
  '交通費',
  '宿泊費', 
  '食費',
  '会議費',
  '通信費',
  '事務用品',
  '書籍・研修費',
  'その他'
];

interface ExpenseFormComponentProps {
  onSubmit: (data: ExpenseForm) => void;
  onCancel: () => void;
}

export default function ExpenseFormComponent({ onSubmit, onCancel }: ExpenseFormComponentProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ExpenseForm>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onFormSubmit = (data: ExpenseForm) => {
    onSubmit(data);
    reset();
    setSelectedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <Plus className="mr-2 h-6 w-6" />
        新規経費申請
      </h2>
      
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* 日付 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            使用日
          </label>
          <input
            type="date"
            {...register('date', { required: '使用日は必須です' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        {/* カテゴリ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Tag className="mr-2 h-4 w-4" />
            カテゴリ
          </label>
          <select
            {...register('category', { required: 'カテゴリは必須です' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          >
            <option value="">カテゴリを選択</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        {/* 金額 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <DollarSign className="mr-2 h-4 w-4" />
            金額（円）
          </label>
          <input
            type="number"
            min="0"
            step="1"
            {...register('amount', { 
              required: '金額は必須です',
              min: { value: 1, message: '金額は1円以上である必要があります' }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            placeholder="例: 1000"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>

        {/* 説明 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            使用目的・詳細
          </label>
          <textarea
            {...register('description', { required: '使用目的は必須です' })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            placeholder="例: 顧客との打ち合わせのための交通費"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* 領収書アップロード */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Upload className="mr-2 h-4 w-4" />
            領収書（任意）
          </label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
          {selectedFile && (
            <p className="mt-1 text-sm text-gray-600">
              選択されたファイル: {selectedFile.name}
            </p>
          )}
        </div>

        {/* ボタン */}
        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            申請する
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-200"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}
