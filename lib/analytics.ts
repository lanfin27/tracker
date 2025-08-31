// Google Analytics event tracking helper functions

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    Kakao?: any;
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Event categories
export const EventCategory = {
  USER_ENGAGEMENT: 'user_engagement',
  FORM_INTERACTION: 'form_interaction',
  VALUATION_FLOW: 'valuation_flow',
  EMAIL_COLLECTION: 'email_collection',
  PAGE_VIEW: 'page_view',
  CLICK: 'click',
} as const;

// Event names
export const EventName = {
  // Page views
  VIEW_HOME: 'view_home',
  VIEW_VALUATION: 'view_valuation',
  VIEW_RESULT: 'view_result',
  VIEW_PRIVACY: 'view_privacy',
  VIEW_STATS: 'view_stats',
  
  // User engagement
  SCROLL_DEPTH: 'scroll_depth',
  TIME_ON_PAGE: 'time_on_page',
  
  // CTA clicks
  CLICK_START_VALUATION: 'click_start_valuation',
  CLICK_RESTART_VALUATION: 'click_restart_valuation',
  CLICK_VIEW_COMPETITORS: 'click_view_competitors',
  CLICK_VIEW_ANALYSIS: 'click_view_analysis',
  
  // Valuation flow
  SELECT_BUSINESS_TYPE: 'select_business_type',
  INPUT_REVENUE: 'input_revenue',
  INPUT_PROFIT: 'input_profit',
  INPUT_SUBSCRIBERS: 'input_subscribers',
  INPUT_BUSINESS_AGE: 'input_business_age',
  COMPLETE_STEP: 'complete_step',
  ABANDON_VALUATION: 'abandon_valuation',
  COMPLETE_VALUATION: 'complete_valuation',
  
  // Email collection
  OPEN_EMAIL_MODAL: 'open_email_modal',
  CLOSE_EMAIL_MODAL: 'close_email_modal',
  SUBMIT_EMAIL: 'submit_email',
  SUBMIT_WEEKLY_EMAIL: 'submit_weekly_email',
  EMAIL_SUBMISSION_SUCCESS: 'email_submission_success',
  EMAIL_SUBMISSION_ERROR: 'email_submission_error',
  
  // Results interactions
  VIEW_RESULT_VALUE: 'view_result_value',
  VIEW_RANKING: 'view_ranking',
  VIEW_COMPETITORS: 'view_competitors',
  VIEW_DETAILED_ANALYSIS: 'view_detailed_analysis',
  
  // Sharing
  SHARE_RESULT: 'share_result',
} as const;

// Page view tracking
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID!, {
      page_path: url,
    });
  }
};

// Legacy event function (for backward compatibility)
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track event function (new comprehensive version)
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      timestamp: new Date().toISOString(),
    });
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 GA Event:', eventName, parameters);
    }
  }
};

// Track page view
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  trackEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  });
};

// Track scroll depth
export const trackScrollDepth = (depth: number) => {
  trackEvent(EventName.SCROLL_DEPTH, {
    event_category: EventCategory.USER_ENGAGEMENT,
    scroll_depth: depth,
  });
};

// Track valuation step
export const trackValuationStep = (
  step: number,
  stepName: string,
  data?: Record<string, any>
) => {
  trackEvent(EventName.COMPLETE_STEP, {
    event_category: EventCategory.VALUATION_FLOW,
    step_number: step,
    step_name: stepName,
    ...data,
  });
};

// Track email submission
export const trackEmailSubmission = (
  success: boolean,
  source: string,
  businessData?: Record<string, any>
) => {
  trackEvent(
    success ? EventName.EMAIL_SUBMISSION_SUCCESS : EventName.EMAIL_SUBMISSION_ERROR,
    {
      event_category: EventCategory.EMAIL_COLLECTION,
      source,
      ...businessData,
    }
  );
};

// Track CTA click
export const trackCTAClick = (ctaName: string, location: string) => {
  trackEvent(ctaName, {
    event_category: EventCategory.CLICK,
    location,
  });
};

// Track business type selection
export const trackBusinessTypeSelection = (businessType: string) => {
  trackEvent(EventName.SELECT_BUSINESS_TYPE, {
    event_category: EventCategory.VALUATION_FLOW,
    business_type: businessType,
  });
};

// Track valuation result
export const trackValuationResult = (
  value: number,
  businessType: string,
  percentile: number
) => {
  trackEvent(EventName.VIEW_RESULT_VALUE, {
    event_category: EventCategory.VALUATION_FLOW,
    valuation_value: value,
    business_type: businessType,
    percentile,
  });
};

// Initialize scroll tracking
export const initScrollTracking = () => {
  if (typeof window === 'undefined') return;
  
  let maxScroll = 0;
  const thresholds = [25, 50, 75, 90, 100];
  
  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (window.scrollY / scrollHeight) * 100;
    
    thresholds.forEach((threshold) => {
      if (scrollPercent >= threshold && maxScroll < threshold) {
        trackScrollDepth(threshold);
        maxScroll = threshold;
      }
    });
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
};

// Track time on page
export const trackTimeOnPage = (pageName: string) => {
  if (typeof window === 'undefined') return;
  
  const startTime = Date.now();
  
  const sendTimeOnPage = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    trackEvent(EventName.TIME_ON_PAGE, {
      event_category: EventCategory.USER_ENGAGEMENT,
      page: pageName,
      time_seconds: timeSpent,
    });
  };
  
  // Send when user leaves the page
  window.addEventListener('beforeunload', sendTimeOnPage);
  
  // Also send after certain intervals
  const intervals = [30, 60, 120, 300]; // 30s, 1m, 2m, 5m
  const timers = intervals.map((seconds) =>
    setTimeout(() => {
      sendTimeOnPage();
    }, seconds * 1000)
  );
  
  return () => {
    window.removeEventListener('beforeunload', sendTimeOnPage);
    timers.forEach(clearTimeout);
  };
};