import { acceptCookies } from '@reducers/ui';
import store from '../../../redux/store';

const checkAcceptedCookies = () => {
  const { ui } = store.getState();
  if (sessionStorage.getItem('accept-cookies') && !ui.cookiesAccepted) {
    store.dispatch(acceptCookies());
  }
};

export default [
  checkAcceptedCookies,
];
