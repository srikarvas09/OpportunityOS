// ============================================================
// OpportunityOS — Global App Context
// Provides active student state + data refresh triggers
// ============================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Student } from '../types/database';
import * as api from '../services/api';

interface AppContextValue {
  // Active student
  activeStudentId: number;
  setActiveStudentId: (id: number) => void;
  activeStudent: Student | null;

  // All students list (for switcher)
  students: Student[];

  // Global loading state
  isLoading: boolean;

  // Toast notifications
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeStudentId, setActiveStudentIdState] = useState<number>(1);
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load students on mount
  useEffect(() => {
    api.getStudents().then(s => {
      setStudents(s);
      setIsLoading(false);
    });
  }, []);

  // Load active student when ID changes
  useEffect(() => {
    api.getStudentById(activeStudentId).then(setActiveStudent);
  }, [activeStudentId]);

  const setActiveStudentId = useCallback((id: number) => {
    setActiveStudentIdState(id);
  }, []);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{
      activeStudentId, setActiveStudentId, activeStudent,
      students, isLoading, toasts, showToast, dismissToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
