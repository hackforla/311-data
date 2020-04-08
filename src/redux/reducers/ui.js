import { MENU_TABS } from '@components/common/CONSTANTS';

const types = {
  TOGGLE_MENU: 'TOGGLE_MENU',
  SET_MENU_TAB: 'SET_MENU_TAB',
  SET_ERROR_MODAL: 'SET_ERROR_MODAL',
  SHOW_DATA_CHARTS: 'SHOW_DATA_CHARTS',
  SHOW_COMPARISON_CHARTS: 'SHOW_COMPARISON_CHARTS',
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

const initialState = {
  menu: {
    isOpen: true,
    activeTab: MENU_TABS.MAP,
  },
  error: {
    isOpen: false,
  },
  showDataCharts: false,
  showComparisonCharts: false,
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
    default:
      return state;
  }
};
