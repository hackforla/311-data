export const types = {
	GET_DB_REQUEST: 'GET_DB_REQUEST',
	GET_DB_REQUEST_SUCCESS: 'GET_DB_REQUEST_SUCCESS',
	GET_DATA_REQUEST: 'GET_DATA_REQUEST',
	GET_DATA_REQUEST_SUCCESS: 'GET_DATA_REQUEST_SUCCESS',
	UPDATE_DATE_RANGES: 'UPDATE_DATE_RANGES',
	GET_PINS_SUCCESS: 'GET_PINS_SUCCESS',
	GET_PINS_FAILURE: 'GET_PINS_FAILURE',
	GET_OPEN_REQUESTS: 'GET_OPEN_REQUESTS',
	GET_OPEN_REQUESTS_SUCCESS: 'GET_OPEN_REQUESTS_SUCCESS',
	GET_OPEN_REQUESTS_FAILURE: 'GET_OPEN_REQUESTS_FAILURE',
	UPDATE_PIN_INFO: 'UPDATE_PIN_INFO',
	CLEAR_PIN_INFO: 'CLEAR_PIN_INFO',
	GET_PIN_INFO_REQUEST: 'GET_PIN_INFO_REQUEST',
	GET_PIN_INFO_SUCCESS: 'GET_PIN_INFO_SUCCESS',
	GET_PIN_INFO_FAILURE: 'GET_PIN_INFO_FAILURE',
	GET_NC_BY_LNG_LAT: 'GET_NC_BY_LNG_LAT',
	GET_NC_BY_LNG_LAT_SUCCESS: 'GET_NC_BY_LNG_LAT_SUCCESS',
	GET_NC_BY_LNG_LAT_FAILURE: 'GET_NC_BY_LNG_LAT_FAILURE',
	SET_SELECTED_NC_ID: 'SET_SELECTED_NC_ID',
	GET_HEATMAP_SUCCESS: 'GET_HEATMAP_SUCCESS',
	GET_HEATMAP_FAILURE: 'GET_HEATMAP_FAILURE',
	GET_VIS_DATA_SUCCESS: 'GET_VIS_DATA_SUCCESS',
	GET_VIS_DATA_FAILURE: 'GET_VIS_DATA_FAILURE',
	SEND_GIT_REQUEST: 'SEND_GIT_REQUEST',
	GIT_RESPONSE_SUCCESS: 'GIT_RESPONSE_SUCCESS',
	GIT_RESPONSE_FAILURE: 'GIT_RESPONSE_FAILURE',
};

export const getDbRequest = () => ({
	type: types.GET_DB_REQUEST,
});

export const getDbRequestSuccess = response => ({
	type: types.GET_DB_REQUEST_SUCCESS,
	payload: response,
});

export const getDataRequest = () => ({
	type: types.GET_DATA_REQUEST,
});

export const getDataRequestSuccess = response => ({
	type: types.GET_DATA_REQUEST_SUCCESS,
	payload: response,
});

export const updateDateRanges = dateRanges => ({
	type: types.UPDATE_DATE_RANGES,
	payload: dateRanges,
});

export const updatePinInfo = pinData => ({
	type: types.UPDATE_PIN_INFO,
	payload: pinData,
});

export const clearPinInfo = () => ({
	type: types.CLEAR_PIN_INFO,
});

export const getPinInfoRequest = requestId => ({
	type: types.GET_PIN_INFO_REQUEST,
	payload: requestId,
});

export const getPinInfoSuccess = response => ({
	type: types.GET_PIN_INFO_SUCCESS,
	payload: response,
});

export const getPinInfoFailure = error => ({
	type: types.GET_PIN_INFO_FAILURE,
	payload: error,
});

export const getNcByLngLat = ({ longitude, latitude }) => ({
	type: types.GET_NC_BY_LNG_LAT,
	payload: { longitude, latitude },
});

export const getNcByLngLatSuccess = response => ({
	type: types.GET_NC_BY_LNG_LAT_SUCCESS,
	payload: response,
});

export const getNcByLngLatFailure = error => ({
	type: types.GET_NC_BY_LNG_LAT_FAILURE,
	payload: error,
});

export const setSelectedNcId = id => ({
	type: types.SET_SELECTED_NC_ID,
	payload: id,
});

export const getHeatmapSuccess = response => ({
	type: types.GET_HEATMAP_SUCCESS,
	payload: response,
});

export const getHeatmapFailure = error => ({
	type: types.GET_HEATMAP_FAILURE,
	payload: error,
});

export const getVisDataSuccess = response => ({
	type: types.GET_VIS_DATA_SUCCESS,
	payload: response,
});

export const getVisDataFailure = error => ({
	type: types.GET_VIS_DATA_FAILURE,
	payload: error,
});

export const sendGitRequest = fields => ({
	type: types.SEND_GIT_REQUEST,
	payload: fields,
});

export const gitResponseSuccess = response => ({
	type: types.GIT_RESPONSE_SUCCESS,
	payload: response,
});

export const gitResponseFailure = error => ({
	type: types.GIT_RESPONSE_FAILURE,
	payload: error,
});

const initialState = {
	isDbLoading: true,
	isMapLoading: false,
	error: null,
	pins: [],
	pinsInfo: {},
	selectedNcId: null,
	// Empty GeoJSON object.
	requests: { type: 'FeatureCollection', features: [] },
	dateRangesWithRequests: [],
};

export default (state = initialState, action) => {
	switch (action.type) {
		case types.GET_DB_REQUEST:
			return {
				...state,
				isDbLoading: true,
			};
		case types.GET_DB_REQUEST_SUCCESS: {
			return {
				...state,
				isDbLoading: false,
			};
		}
		case types.GET_DATA_REQUEST:
			return {
				...state,
				isMapLoading: true,
			};
		case types.GET_DATA_REQUEST_SUCCESS: {
			const newRequests = {
				type: 'FeatureCollection',
				features: [...state.requests.features, ...action.payload],
			};
			return {
				...state,
				requests: newRequests,
				isMapLoading: false,
			};
		}
		case types.UPDATE_DATE_RANGES:
			return {
				...state,
				dateRangesWithRequests: action.payload,
			};
		 case types.GET_PINS_SUCCESS:
		    return {
		      ...state,
		      error: null,
		      pins: action.payload,
		      isMapLoading: false,
		    };
		case types.GET_PINS_FAILURE: {
		  const {
		    response: { status },
		    message,
		  } = action.payload;
		  return {
		    ...state,
		    error: {
		      code: status,
		      message,
		      error: action.payload,
		    },
		    isMapLoading: false,
		  };
		}
		case types.UPDATE_PIN_INFO:
			return {
				...state,
				error: null,
				pinsInfo: {
					...state.pinsInfo,
					...action.payload,
				},
			};
		case types.CLEAR_PIN_INFO:
			return {
				...state,
				error: null,
				pinsInfo: {},
			};
		case types.GET_PIN_INFO_SUCCESS:
			return {
				...state,
				error: null,
				pinsInfo: {
					...state.pinsInfo,
					[action.payload.requestId]: action.payload,
				},
			};
		case types.GET_PIN_INFO_FAILURE: {
			const {
				response: { status },
				message,
			} = action.payload;
			return {
				...state,
				error: {
					code: status,
					message,
					error: action.payload,
				},
			};
		}
		case types.GET_NC_BY_LNG_LAT_SUCCESS: {
			return {
				...state,
				error: null,
				selectedNcId: action.payload.council_id,
			};
		}
		case types.GET_NC_BY_LNG_LAT_FAILURE: {
			const {
				response: { status },
				message,
			} = action.payload;
			return {
				...state,
				error: {
					code: status,
					message,
					error: action.payload,
				},
			};
		}
		case types.SET_SELECTED_NC_ID: {
			return {
				...state,
				selectedNcId: action.payload,
			};
		}
		default:
			return state;
	}
};
