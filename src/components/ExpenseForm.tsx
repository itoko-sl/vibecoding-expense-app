'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Upload, Calendar, DollarSign, FileText, Tag } from 'lucide-react';
import { ExpenseForm, ExpenseCategory, Expense } from '@/types/expense';

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
  onSubmit: (data: ExpenseForm, fileUrl?: string) => void;
  onCancel: () => void;
  editingExpense?: Expense | null;
}

export default function ExpenseFormComponent({ onSubmit, onCancel, editingExpense }: ExpenseFormComponentProps) {
  console.log('🚀 [DEBUG] ExpenseForm component loaded');
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ExpenseForm>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  console.log('🚀 [DEBUG] ExpenseForm state - selectedFile:', selectedFile ? selectedFile.name : 'none');

  // 編集モードの場合、フォームに既存データを設定
  useEffect(() => {
    if (editingExpense) {
      setValue('date', editingExpense.date);
      setValue('category', editingExpense.category);
      setValue('amount', editingExpense.amount);
      setValue('description', editingExpense.description);
    } else {
      reset();
      setSelectedFile(null);
    }
  }, [editingExpense, setValue, reset]);

  const onFormSubmit = async (data: ExpenseForm) => {
    console.log('🔧 [DEBUG] Form submitted');
    console.log('🔧 [DEBUG] Form data:', data);
    console.log('🔧 [DEBUG] Selected file:', selectedFile ? `${selectedFile.name} (${selectedFile.size} bytes, ${selectedFile.type})` : 'No file');
    
    setIsUploading(true);
    
    try {
      let fileUrl: string | undefined;
      
      // ファイルがある場合、まずアップロード
      if (selectedFile) {
        console.log('🔧 [DEBUG] Starting file upload...');
        console.log('🔧 [DEBUG] File details:', {
          name: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size,
          lastModified: selectedFile.lastModified
        });
        
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        console.log('🔧 [DEBUG] FormData created, sending request to /api/upload');
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        console.log('🔧 [DEBUG] Upload response status:', response.status);
        console.log('🔧 [DEBUG] Upload response ok:', response.ok);
        
        const responseText = await response.text();
        console.log('🔧 [DEBUG] Response text:', responseText);
        
        if (!response.ok) {
          let errorData;
          try {
            errorData = JSON.parse(responseText);
          } catch (e) {
            errorData = { error: responseText };
          }
          console.error('❌ [ERROR] Upload failed:', errorData);
          throw new Error(errorData.error || 'ファイルアップロードに失敗しました');
        }
        
        const result = JSON.parse(responseText);
        console.log('✅ [DEBUG] Upload successful:', result);
        fileUrl = result.url;
      } else {
        console.log('🔧 [DEBUG] No file selected, skipping upload');
      }
      
      // フォームデータとファイルURLを送信
      console.log('🔧 [DEBUG] Submitting form with fileUrl:', fileUrl);
      onSubmit(data, fileUrl);
      reset();
      setSelectedFile(null);
    } catch (error) {
      console.error('❌ [ERROR] アップロードエラー:', error);
      alert(error instanceof Error ? error.message : 'ファイルアップロードに失敗しました');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('🔧 [DEBUG] File selected:', file ? `${file.name} (${file.size} bytes, ${file.type})` : 'No file');
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <Plus className="mr-2 h-6 w-6" />
        {editingExpense ? '経費申請を編集' : '新規経費申請'}
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
            <div className="mt-1 text-sm text-gray-600">
              <p>選択されたファイル: {selectedFile.name}</p>
              <p>ファイルサイズ: {Math.round(selectedFile.size / 1024)}KB</p>
              <p>ファイルタイプ: {selectedFile.type}</p>
            </div>
          )}
        </div>

        {/* ボタン */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isUploading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                アップロード中...
              </>
            ) : (
              editingExpense ? '更新する' : '申請する'
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isUploading}
            className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-700 font-medium py-2 px-4 rounded-md transition duration-200"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}
