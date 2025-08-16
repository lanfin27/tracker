import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface UseAccessibilityOptions {
  enableKeyboardNav?: boolean;
  enableAriaAnnouncements?: boolean;
  trapFocus?: boolean;
}

export function useAccessibility(options: UseAccessibilityOptions = {}) {
  const {
    enableKeyboardNav = true,
    enableAriaAnnouncements = true,
    trapFocus = false
  } = options;
  
  const router = useRouter();
  const focusableElementsRef = useRef<HTMLElement[]>([]);
  const currentFocusIndex = useRef(0);

  // 스크린리더 공지
  const announceToScreenReader = useCallback((message: string) => {
    if (!enableAriaAnnouncements) return;
    
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'toss-sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, [enableAriaAnnouncements]);

  // 포커스 가능한 요소 찾기
  const getFocusableElements = useCallback((): HTMLElement[] => {
    const container = trapFocus 
      ? document.querySelector('[data-focus-trap="true"]') || document
      : document;
      
    const elements = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), ' +
      'input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    return Array.from(elements);
  }, [trapFocus]);

  // 포커스 이동
  const moveFocus = useCallback((direction: 'next' | 'prev') => {
    const elements = getFocusableElements();
    if (elements.length === 0) return;
    
    const currentElement = document.activeElement as HTMLElement;
    const currentIndex = elements.indexOf(currentElement);
    
    let nextIndex: number;
    if (direction === 'next') {
      nextIndex = currentIndex + 1 >= elements.length ? 0 : currentIndex + 1;
    } else {
      nextIndex = currentIndex - 1 < 0 ? elements.length - 1 : currentIndex - 1;
    }
    
    elements[nextIndex]?.focus();
    currentFocusIndex.current = nextIndex;
  }, [getFocusableElements]);

  // 키보드 네비게이션
  useEffect(() => {
    if (!enableKeyboardNav) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Tab 키 처리 (포커스 트랩)
      if (trapFocus && e.key === 'Tab') {
        e.preventDefault();
        moveFocus(e.shiftKey ? 'prev' : 'next');
        return;
      }

      // 글로벌 키보드 단축키
      switch(e.key) {
        case 'Escape':
          // ESC 키로 뒤로가기
          if (!e.target || (e.target as HTMLElement).tagName !== 'INPUT') {
            router.back();
          }
          break;
          
        case 'Enter':
          // Enter 키로 다음 단계 (포커스가 입력 필드에 없을 때)
          if (!e.target || (e.target as HTMLElement).tagName !== 'INPUT') {
            const nextButton = document.querySelector<HTMLButtonElement>('[data-action="next"]');
            nextButton?.click();
          }
          break;
          
        case '?':
          // ? 키로 도움말 표시
          if (e.shiftKey) {
            announceToScreenReader('도움말: 방향키로 이동, Enter로 선택, ESC로 뒤로가기');
          }
          break;
          
        case 'ArrowLeft':
          // 이전 단계로
          if (!e.target || (e.target as HTMLElement).tagName !== 'INPUT') {
            const prevButton = document.querySelector<HTMLButtonElement>('[data-action="prev"]');
            prevButton?.click();
          }
          break;
          
        case 'ArrowRight':
          // 다음 단계로
          if (!e.target || (e.target as HTMLElement).tagName !== 'INPUT') {
            const nextButton = document.querySelector<HTMLButtonElement>('[data-action="next"]');
            nextButton?.click();
          }
          break;
      }

      // 숫자 키로 옵션 선택
      if (e.key >= '1' && e.key <= '9') {
        const optionIndex = parseInt(e.key) - 1;
        const options = document.querySelectorAll<HTMLButtonElement>('[data-option-index]');
        if (options[optionIndex]) {
          options[optionIndex].click();
          announceToScreenReader(`${optionIndex + 1}번 옵션 선택됨`);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardNav, trapFocus, moveFocus, router, announceToScreenReader]);

  // 포커스 트랩 설정
  useEffect(() => {
    if (!trapFocus) return;

    const elements = getFocusableElements();
    if (elements.length > 0) {
      elements[0]?.focus();
    }
  }, [trapFocus, getFocusableElements]);

  return {
    announceToScreenReader,
    moveFocus,
    getFocusableElements
  };
}

// 진동 피드백 훅
export function useHapticFeedback() {
  const vibrate = useCallback((pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  const success = useCallback(() => vibrate(100), [vibrate]);
  const error = useCallback(() => vibrate([50, 50, 50]), [vibrate]);
  const selection = useCallback(() => vibrate(50), [vibrate]);
  const warning = useCallback(() => vibrate([100, 50, 100]), [vibrate]);

  return { success, error, selection, warning };
}

// 음성 안내 훅
export function useVoiceGuidance() {
  const speak = useCallback((text: string, options?: Partial<SpeechSynthesisUtterance>) => {
    if (!('speechSynthesis' in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options?.lang || 'ko-KR';
    utterance.rate = options?.rate || 1;
    utterance.pitch = options?.pitch || 1;
    utterance.volume = options?.volume || 1;

    speechSynthesis.cancel(); // 이전 음성 중단
    speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }, []);

  return { speak, stop };
}