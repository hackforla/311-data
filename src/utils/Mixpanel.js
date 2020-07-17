import mixpanel from 'mixpanel-browser';

const envCheck = process.env.NODE_ENV === 'production';
const token = envCheck ? process.env.MIXPANEL_TOKEN_PROD : process.env.MIXPANEL_TOKEN_DEV;

// Set MIXPANEL_ENABLED env variable to:
//   1 or greater to enable Mixpanel logging
//   0 to disable Mixpanel logging
const mixpanelEnabled = process.env.MIXPANEL_ENABLED > 0;

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
