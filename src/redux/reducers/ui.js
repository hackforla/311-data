import { MENU_TABS } from '@components/common/CONSTANTS';

export const types = {
  TOGGLE_MENU: 'TOGGLE_MENU',
  SET_MENU_TAB: 'SET_MENU_TAB',
  SET_ERROR_MODAL: 'SET_ERROR_MODAL',
  SHOW_DATA_CHARTS: 'SHOW_DATA_CHARTS',
  SHOW_COMPARISON_CHARTS: 'SHOW_COMPARISON_CHARTS',
  SHOW_FEEDBACK_SUCCESS: 'SHOW_FEEDBACK_SUCCESS',
  UPDATE_MAP_POSITION: 'UPDATE_MAP_POSITION',
  ACCEPT_COOKIES: 'ACCEPT_COOKIES',
  DISABLE_SPLASH_PAGE: 'DISABLE_SPLASH_PAGE',
};

export const toggleMenu = () => ({
  type: types.TOGGLE_MENU,
});

export const setMenuTab = tab => ({
  type: types.SET_MENU_TAB,
  payload: tab,
});

export const setErrorModal = isOpen => ({
  type: types.SET_ERROR_MODAL,
  payload: isOpen,
});

export const showDataCharts = isShown => ({
  type: types.SHOW_DATA_CHARTS,
  payload: isShown,
});

export const showComparisonCharts = isShown => ({
  type: types.SHOW_COMPARISON_CHARTS,
  payload: isShown,
});

export const showFeedbackSuccess = isShown => ({
  type: types.SHOW_FEEDBACK_SUCCESS,
  payload: isShown,
});

export const updateMapPosition = position => ({
  type: types.UPDATE_MAP_POSITION,
  payload: position,
});

export const acceptCookies = () => ({
  type: types.ACCEPT_COOKIES,
});

export const disableSplashPage = () => ({
  type: types.DISABLE_SPLASH_PAGE,
});

const initialState = {
  menu: {
    isOpen: false,
    activeTab: MENU_TABS.MAP,
  },
  map: {},
  error: {
    isOpen: false,
  },
  showDataCharts: false,
  showComparisonCharts: false,
  displayFeedbackSuccess: false,
  splashPageDisabled: false,
  cookiesAccepted: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.TOGGLE_MENU:
      return {
        ...state,
        menu: {
          ...state.menu,
          isOpen: !state.menu.isOpen,
        },
      };
    case types.SET_ERROR_MODAL:
      return {
        ...state,
        error: {
          ...state.error,
          isOpen: action.payload,
        },
      };
    case types.SET_MENU_TAB:
      return {
        ...state,
        menu: {
          ...state.menu,
          activeTab: action.payload,
        },
      };
    case types.SHOW_DATA_CHARTS:
      return {
        ...state,
        showDataCharts: action.payload,
      };
    case types.SHOW_COMPARISON_CHARTS:
      return {
        ...state,
        showComparisonCharts: action.payload,
      };
    case types.SHOW_FEEDBACK_SUCCESS:
      return {
        ...state,
        displayFeedbackSuccess: action.payload,
      };
    case types.UPDATE_MAP_POSITION:
      return {
        ...state,
        map: action.payload,
      };
    case types.ACCEPT_COOKIES:
      return {
        ...state,
        cookiesAccepted: true,
      };
    case types.DISABLE_SPLASH_PAGE:
      return {
        ...state,
        splashPageDisabled: true,
      };
    default:
      return state;
  }
};
