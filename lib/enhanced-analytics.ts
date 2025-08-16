import { event as gaEvent } from './analytics';

interface UserBehavior {
  sessionId: string;
  startTime: number;
  stepTimes: Record<number, number>;
  corrections: number;
  abandonmentPoint?: number;
  completionTime?: number;
  interactions: Array<{
    type: string;
    timestamp: number;
    data?: any;
  }>;
}

class EnhancedAnalytics {
  private behavior: UserBehavior;
  private currentStep: number = 0;
  private stepStartTime: number = Date.now();

  constructor() {
    this.behavior = {
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      stepTimes: {},
      corrections: 0,
      interactions: []
    };
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  // 페이지 뷰 추적
  trackPageView(step: number, title?: string) {
    const timeOnPreviousStep = Date.now() - this.stepStartTime;
    
    if (this.currentStep > 0) {
      this.behavior.stepTimes[this.currentStep] = timeOnPreviousStep;
    }
    
    this.currentStep = step;
    this.stepStartTime = Date.now();

    gaEvent({
      action: 'page_view',
      category: 'valuation_flow',
      label: `step_${step}`,
      value: step
    });

    // 단계별 평균 시간 분석
    if (timeOnPreviousStep > 30000) { // 30초 이상
      this.showHelperNotification();
    }
  }

  // 사용자 인터랙션 추적
  trackInteraction(action: string, data?: any) {
    this.behavior.interactions.push({
      type: action,
      timestamp: Date.now(),
      data
    });

    gaEvent({
      action: 'user_interaction',
      category: 'valuation_flow',
      label: action,
      value: this.currentStep
    });
  }

  // 입력 수정 추적
  trackCorrection(field: string) {
    this.behavior.corrections++;
    
    gaEvent({
      action: 'field_correction',
      category: 'valuation_flow',
      label: field,
      value: this.behavior.corrections
    });
  }

  // 이탈 추적
  trackAbandonment() {
    this.behavior.abandonmentPoint = this.currentStep;
    
    gaEvent({
      action: 'abandonment',
      category: 'valuation_flow',
      label: `step_${this.currentStep}`,
      value: Date.now() - this.behavior.startTime
    });

    this.sendBehaviorData();
  }

  // 완료 추적
  trackCompletion(result: any) {
    this.behavior.completionTime = Date.now() - this.behavior.startTime;
    
    gaEvent({
      action: 'completion',
      category: 'valuation_flow',
      label: result.businessType,
      value: result.value
    });

    // 상세 완료 데이터
    gaEvent({
      action: 'completion_details',
      category: 'valuation_result',
      label: `percentile_${result.percentile}`,
      value: this.behavior.completionTime
    });

    this.sendBehaviorData();
  }

  // 추천 사용 추적
  trackSuggestionUsed(field: string, accepted: boolean) {
    gaEvent({
      action: 'suggestion_interaction',
      category: 'smart_features',
      label: `${field}_${accepted ? 'accepted' : 'rejected'}`,
      value: this.currentStep
    });
  }

  // 접근성 기능 사용 추적
  trackAccessibilityFeature(feature: string) {
    gaEvent({
      action: 'accessibility_used',
      category: 'accessibility',
      label: feature,
      value: 1
    });
  }

  // 오류 추적
  trackError(error: string, context?: any) {
    gaEvent({
      action: 'error_occurred',
      category: 'errors',
      label: error,
      value: this.currentStep
    });

    // 에러 로깅 (추후 Sentry 등과 연동)
    console.error('[Analytics Error]', error, context);
  }

  // A/B 테스트 추적
  trackExperiment(experimentName: string, variant: string, result?: any) {
    gaEvent({
      action: 'experiment_exposure',
      category: 'ab_test',
      label: `${experimentName}_${variant}`,
      value: result
    });
  }

  // 도움말 표시
  private showHelperNotification() {
    // 사용자에게 도움말 제공
    const helpMessage = this.getContextualHelp(this.currentStep);
    if (helpMessage) {
      this.trackInteraction('helper_shown', { step: this.currentStep });
    }
  }

  // 문맥별 도움말
  private getContextualHelp(step: number): string | null {
    const helps: Record<number, string> = {
      1: '비즈니스 유형을 선택하는데 어려움이 있으신가요? 가장 유사한 유형을 선택해주세요.',
      2: '매출 입력이 어려우신가요? 대략적인 금액도 괜찮습니다.',
      3: '수익 계산이 어려우신가요? 간단 계산기를 사용해보세요.',
      4: '정확한 구독자 수를 모르시나요? 대략적인 숫자도 괜찮습니다.',
      5: '성장률 판단이 어려우신가요? 최근 추세를 생각해보세요.',
      6: '운영 기간이 애매하신가요? 실제 수익이 발생한 시점을 기준으로 선택해주세요.'
    };

    return helps[step] || null;
  }

  // 행동 데이터 전송
  private sendBehaviorData() {
    // 서버로 상세 행동 데이터 전송 (추후 구현)
    const data = {
      ...this.behavior,
      avgTimePerStep: this.calculateAvgTimePerStep(),
      interactionRate: this.calculateInteractionRate()
    };

    console.log('[Analytics] Behavior data:', data);
    
    // TODO: Supabase에 저장
  }

  // 평균 단계 시간 계산
  private calculateAvgTimePerStep(): number {
    const times = Object.values(this.behavior.stepTimes);
    if (times.length === 0) return 0;
    return times.reduce((a, b) => a + b, 0) / times.length;
  }

  // 인터랙션 비율 계산
  private calculateInteractionRate(): number {
    const totalTime = Date.now() - this.behavior.startTime;
    return this.behavior.interactions.length / (totalTime / 1000); // 초당 인터랙션
  }

  // 퍼널 분석
  getFunnelMetrics() {
    return {
      sessionId: this.behavior.sessionId,
      currentStep: this.currentStep,
      timeSpent: Date.now() - this.behavior.startTime,
      corrections: this.behavior.corrections,
      stepTimes: this.behavior.stepTimes
    };
  }
}

// 싱글톤 인스턴스
let analyticsInstance: EnhancedAnalytics | null = null;

export function getAnalytics(): EnhancedAnalytics {
  if (!analyticsInstance) {
    analyticsInstance = new EnhancedAnalytics();
  }
  return analyticsInstance;
}

// 편의 함수들
export const analytics = {
  pageView: (step: number, title?: string) => getAnalytics().trackPageView(step, title),
  interaction: (action: string, data?: any) => getAnalytics().trackInteraction(action, data),
  correction: (field: string) => getAnalytics().trackCorrection(field),
  abandonment: () => getAnalytics().trackAbandonment(),
  completion: (result: any) => getAnalytics().trackCompletion(result),
  suggestion: (field: string, accepted: boolean) => getAnalytics().trackSuggestionUsed(field, accepted),
  accessibility: (feature: string) => getAnalytics().trackAccessibilityFeature(feature),
  error: (error: string, context?: any) => getAnalytics().trackError(error, context),
  experiment: (name: string, variant: string, result?: any) => getAnalytics().trackExperiment(name, variant, result),
  funnel: () => getAnalytics().getFunnelMetrics()
};