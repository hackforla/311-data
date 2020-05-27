import queryString from 'query-string';
import Mixpanel from '@utils/Mixpanel';

const handleReferralCode = (
  location,
  history,
) => {
  const { search, pathname } = location;
  const { push } = history;
  const { referral } = queryString.parse(search);

  if (referral) {
    Mixpanel.track('Referral Link Used', {
      'Referral code': referral,
      Path: pathname,
    });
    push(pathname);
  }
};

const logAboutPageVisit = location => {
  const { pathname } = location;
  if (pathname === '/about') {
    Mixpanel.track('About 311');
  }
};


export default [
  handleReferralCode,
  logAboutPageVisit,
];
