/* global Raven, ratatoskr */

export default () => {
  if (process.env.NODE_ENV === 'production') {
    try {
      Raven
        .config('https://979cb1ce6a43473290a6212f6bfc004c@sentry.io/178949', {
          release: ratatoskr.version,
        })
        .install();
    } catch (error) {
      // Ignore if Raven is not there (for instance in offline mode)
    }
  }
};
