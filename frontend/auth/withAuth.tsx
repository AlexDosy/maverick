'use client';

import { useAuth } from './auth.context';
import { useRouter } from 'next/navigation';
import { JSX, useEffect } from 'react';

export function withAuth<T extends JSX.IntrinsicAttributes>(Component: React.ComponentType<T>) {
  return function Protected(props: T) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) router.push('/login');
    }, [isAuthenticated]);

    if (!isAuthenticated) return null;

    return <Component {...props} />;
  };
}
