import React from 'react';

const DbContext = React.createContext({
  db: null,
  conn: null,
  worker: null,
  tableName: '',
});

export default DbContext;
