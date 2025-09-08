export const types = {
  TRACK_MAP_EXPORT: 'TRACK_MAP_EXPORT',
  TRACK_CHART_EXPORT: 'TRACK_CHART_EXPORT',
};

export const trackMapExport = () => ({
  type: types.TRACK_MAP_EXPORT,
});

export const trackChartExport = ({ pageArea, fileType, path }) => ({
  type: types.TRACK_CHART_EXPORT,
  payload: { pageArea, fileType, path },
});
