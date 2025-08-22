export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  receipt?: string; // 領収書のファイルパス
  status: ExpenseStatus;
  submittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

export type ExpenseCategory = 
  | '交通費'
  | '宿泊費'
  | '食費'
  | '会議費'
  | '通信費'
  | '事務用品'
  | '書籍・研修費'
  | 'その他';

export type ExpenseStatus = 
  | '下書き'
  | '申請中'
  | '承認済み'
  | '差し戻し';

export interface ExpenseForm {
  date: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  receipt?: FileList;
}
