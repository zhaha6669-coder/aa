import { logEvent as firebaseLogEvent } from 'firebase/analytics';
import { getAnalyticsInstance } from './firebase';

// Custom event types
type AnalyticsEvent = 
  | 'contact_form_submit'
  | 'newsletter_subscribe'
  | 'service_view'
  | 'project_view'
  | 'cta_click'
  | 'language_change'
  | 'social_link_click'
  | 'download_click';

interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Log a custom analytics event
 */
export const logEvent = (eventName: AnalyticsEvent, params?: EventParams) => {
  const analytics = getAnalyticsInstance();
  
  if (analytics) {
    firebaseLogEvent(analytics, eventName, params);
  }
};

/**
 * Track contact form submission
 */
export const trackContactSubmit = (formData: { name: string; service?: string }) => {
  logEvent('contact_form_submit', {
    contact_name: formData.name,
    service_interest: formData.service || 'general',
  });
};

/**
 * Track newsletter subscription
 */
export const trackNewsletterSubscribe = (email: string) => {
  logEvent('newsletter_subscribe', {
    email_domain: email.split('@')[1],
  });
};

/**
 * Track service page view
 */
export const trackServiceView = (serviceName: string, serviceSlug: string) => {
  logEvent('service_view', {
    service_name: serviceName,
    service_slug: serviceSlug,
  });
};

/**
 * Track project/portfolio view
 */
export const trackProjectView = (projectName: string, projectSlug: string) => {
  logEvent('project_view', {
    project_name: projectName,
    project_slug: projectSlug,
  });
};

/**
 * Track CTA button clicks
 */
export const trackCtaClick = (ctaName: string, location: string) => {
  logEvent('cta_click', {
    cta_name: ctaName,
    cta_location: location,
  });
};

/**
 * Track language changes
 */
export const trackLanguageChange = (fromLang: string, toLang: string) => {
  logEvent('language_change', {
    from_language: fromLang,
    to_language: toLang,
  });
};

/**
 * Track social link clicks
 */
export const trackSocialClick = (platform: string) => {
  logEvent('social_link_click', {
    platform: platform,
  });
};
