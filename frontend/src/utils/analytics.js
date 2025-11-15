const analytics = {
  track: (event, payload) => {
    // stub: replace with real telemetry later
    console.log("[analytics.track]", event, payload || {});
  },
};

export default analytics;
