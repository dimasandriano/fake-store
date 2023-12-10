'use client';
import React from 'react';

import { QueryProvider } from '@/services/providers/QueryProvider';

export default function Template({ children }: { children: React.ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
