import React from 'react';

const DbContext = React.createContext({
  db: null,
  conn: null,
  worker: null,
  tableNameByYear: '',
  startTime: null,
});

export default DbContext;
