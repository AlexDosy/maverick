'use client';

import { useAuth } from './auth.context';
import { useRouter } from 'next/navigation';
import { JSX, useEffect } from 'react';

export function withRole<T extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<T>,
  allowedRoles: Array<'ADMIN' | 'INSTRUCTOR' | 'STUDENT'>,
) {
  return function RoleProtected(props: T) {
    const { role } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!role || !allowedRoles.includes(role)) {
        router.push('/403');
      }
    }, [role]);

    if (!role || !allowedRoles.includes(role)) return null;

    return <Component {...props} />;
  };
}

