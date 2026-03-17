export const initGA = (measurementId) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', measurementId);
  }
};

export const trackPageView = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-XXXXXXXXXX', {
      page_path: url,
    });
  }
};

export const trackEvent = (eventName, eventParams = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

export const trackDiagnosticStart = () => {
  trackEvent('diagnostic_started', {
    event_category: 'engagement',
    event_label: 'User started diagnostic',
  });
};

export const trackDiagnosticComplete = (score, focusArea) => {
  trackEvent('diagnostic_completed', {
    event_category: 'engagement',
    event_label: 'User completed diagnostic',
    scare_score: score,
    focus_area: focusArea,
  });
};

export const trackActionClick = (actionType, score, focusArea) => {
  trackEvent('action_clicked', {
    event_category: 'conversion',
    event_label: actionType,
    action_type: actionType,
    scare_score: score,
    focus_area: focusArea,
  });
};

export const trackLeadCapture = (actionType, email) => {
  trackEvent('lead_captured', {
    event_category: 'conversion',
    event_label: actionType,
    action_type: actionType,
  });

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', 'user_properties', {
      user_action: actionType,
    });
  }
};

export const trackModalOpen = (modalType) => {
  trackEvent('modal_opened', {
    event_category: 'engagement',
    event_label: modalType,
    modal_type: modalType,
  });
};

export const trackModalClose = (modalType) => {
  trackEvent('modal_closed', {
    event_category: 'engagement',
    event_label: modalType,
    modal_type: modalType,
  });
};
