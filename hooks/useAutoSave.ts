import { useEffect, useCallback, useRef } from 'react';
import { useValuationStore } from '@/lib/store';

const STORAGE_KEY = 'tracker_draft';
const AUTO_SAVE_INTERVAL = 3000; // 3초마다 자동 저장

export function useAutoSave() {
  const { input, currentStep } = useValuationStore();
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<string>('');

  // 자동 저장
  const save = useCallback(() => {
    const data = {
      input,
      currentStep,
      timestamp: Date.now()
    };
    
    const serialized = JSON.stringify(data);
    
    // 변경사항이 없으면 저장하지 않음
    if (serialized === lastSavedRef.current) {
      return;
    }
    
    try {
      localStorage.setItem(STORAGE_KEY, serialized);
      lastSavedRef.current = serialized;
      console.log('[AutoSave] 저장 완료');
    } catch (error) {
      console.error('[AutoSave] 저장 실패:', error);
    }
  }, [input, currentStep]);

  // 복구
  const restore = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;
      
      const data = JSON.parse(saved);
      
      // 24시간 이상 지난 데이터는 무시
      const dayInMs = 24 * 60 * 60 * 1000;
      if (Date.now() - data.timestamp > dayInMs) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('[AutoSave] 복구 실패:', error);
      return null;
    }
  }, []);

  // 초기화
  const clear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    lastSavedRef.current = '';
    console.log('[AutoSave] 초기화 완료');
  }, []);

  // 자동 저장 활성화
  useEffect(() => {
    // 즉시 저장
    save();
    
    // 주기적 저장
    const interval = setInterval(save, AUTO_SAVE_INTERVAL);
    
    // 페이지 나가기 전 저장
    const handleBeforeUnload = () => {
      save();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [save]);

  // 입력 변경 시 디바운스 저장
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      save();
    }, 1000); // 1초 후 저장
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [input, save]);

  return {
    save,
    restore,
    clear
  };
}

