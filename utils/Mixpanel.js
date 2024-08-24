import mixpanel from 'mixpanel-browser';

const token = import.meta.env.PROD
  ? import.meta.env.MIXPANEL_TOKEN_PROD
  : import.meta.env.MIXPANEL_TOKEN_DEV;

// Set MIXPANEL_ENABLED env variable to:
//   1 or greater to enable Mixpanel logging
//   0 to disable Mixpanel logging
const mixpanelEnabled = import.meta.env.MIXPANEL_ENABLED > 0;

if (mixpanelEnabled) {
  mixpanel.init(token);
}

const Mixpanel = {
  track: (name, props) => {
    if (mixpanelEnabled) {
      mixpanel.track(name, props);
    }
  },
  time_event: name => {
    if (mixpanelEnabled) {
      mixpanel.time_event(name);
    }
  },
};

export default Mixpanel;
