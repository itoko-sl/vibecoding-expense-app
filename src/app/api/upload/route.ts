import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  console.log('🔧 [DEBUG] Upload API called');
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    console.log('🔧 [DEBUG] File received:', file ? `${file.name} (${file.size} bytes, ${file.type})` : 'No file');
    
    if (!file) {
      console.log('❌ [ERROR] No file in request');
      return NextResponse.json({ error: 'ファイルが見つかりません' }, { status: 400 });
    }

    // ファイルの検証
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.log('❌ [ERROR] Invalid file type:', file.type);
      return NextResponse.json({ error: '画像ファイルのみアップロード可能です' }, { status: 400 });
    }

    // ファイルサイズの制限 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      console.log('❌ [ERROR] File too large:', file.size);
      return NextResponse.json({ error: 'ファイルサイズは5MB以下にしてください' }, { status: 400 });
    }

    // アップロードディレクトリの作成
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'receipts');
    console.log('🔧 [DEBUG] Upload directory:', uploadsDir);
    
    try {
      await mkdir(uploadsDir, { recursive: true });
      console.log('✅ [DEBUG] Directory created/exists');
    } catch (error) {
      // ディレクトリが既に存在する場合は無視
    }

    // ファイル名の生成（タイムスタンプ + ランダム文字列）
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = path.extname(file.name);
    const fileName = `receipt_${timestamp}_${randomString}${extension}`;
    
    console.log('🔧 [DEBUG] Generated filename:', fileName);
    
    // ファイルの保存
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadsDir, fileName);
    
    console.log('🔧 [DEBUG] Saving file to:', filePath);
    
    await writeFile(filePath, buffer);
    
    console.log('✅ [DEBUG] File saved successfully');
    
    // レスポンスでファイルのURLを返す
    const fileUrl = `/uploads/receipts/${fileName}`;
    
    console.log('🔧 [DEBUG] Returning URL:', fileUrl);
    
    return NextResponse.json({ 
      success: true, 
      url: fileUrl,
      fileName: fileName,
      fileSize: file.size,
      fileType: file.type
    });
    
  } catch (error) {
    console.error('❌ [ERROR] ファイルアップロードエラー:', error);
    return NextResponse.json({ error: 'ファイルアップロードに失敗しました' }, { status: 500 });
  }
}
