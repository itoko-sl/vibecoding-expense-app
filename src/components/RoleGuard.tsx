'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps) {
  const { user } = useAuth();
  
  console.log('🛡️ [DEBUG] RoleGuard - user:', user, 'allowedRoles:', allowedRoles);
  
  if (!user || !allowedRoles.includes(user.role)) {
    console.log('🚫 [DEBUG] RoleGuard - Access denied');
    return <>{fallback}</>;
  }
  
  console.log('✅ [DEBUG] RoleGuard - Access granted, rendering children');
  return <>{children}</>;
}
