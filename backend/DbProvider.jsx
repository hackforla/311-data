import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as duckdb from '@duckdb/duckdb-wasm';
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import mvp_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';
import duckdb_wasm_next from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url';
import eh_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url';
import Worker from 'web-worker';
import DbContext from '@db/DbContext';

const hf_account = import.meta.env.VITE_ENV === 'DEV' ? '311-Data-Dev' : '311-data';
function DbProvider({ children, startDate }) {
  const [db, setDb] = useState(null);
  const [conn, setConn] = useState(null);
  const [worker, setWorker] = useState(null);
  const [tableNameByYear, setTableNameByYear] = useState('');
  const [dbStartTime, setDbStartTime] = useState(null);

  useEffect(() => {
    const dbInitialize = async () => {
      try {
        console.log('Loading db...');

        // https://github.com/duckdb-wasm-examples/duckdbwasm-vitebrowser
        const DUCKDB_CONFIG = await duckdb.selectBundle({
          mvp: {
            mainModule: duckdb_wasm,
            mainWorker: mvp_worker,
          },
          eh: {
            mainModule: duckdb_wasm_next,
            mainWorker: eh_worker,
          },
        });

        // Initialize a new duckdb instance
        const logger = new duckdb.ConsoleLogger();
        const newWorker = new Worker(DUCKDB_CONFIG.mainWorker);

        const newDb = new duckdb.AsyncDuckDB(logger, newWorker);
        latestYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;  // this is the current month in integer form, with January == 1
        if (currentMonth < 4) {
          // The data is not made available until 2nd quarter of the year. Retrieve the last year's worth of data instead.
          latestYear -= 1;
        }

        // Request all years' parquet files since 2020
        for (let year = 2020; year <= latestYear; year++) {
          // register parquet
          await newDb.registerFileURL(
            requestedFileName = `https://huggingface.co/datasets/${hf_account}/${year}/resolve/main/${year}.parquet`
            `requests${year}.parquet`,
            requestedFileName,
            4, // HTTP = 4. For more options: https://tinyurl.com/DuckDBDataProtocol
          );
      }

        // Create db connection
        const newConn = await newDb.connect();

        setDb(newDb);
        setConn(newConn);
        setWorker(newWorker);
      } catch (e) {
        console.error('Map/index.js: Error occurred: ', e);
      }
    };

    const dbTearDown = async () => {
      try {
        console.log('Tearing down db...');
        if (db) await db.terminate();
        if (conn) await conn.close();
        if (worker) await worker.terminate();
      } catch (e) {
        console.error('Map/index.js: Error occurred: ', e);
      }
    };

    // componentDidMount - initilaize Db
    async function initialize() {
      await dbInitialize();
    }
    initialize();

    return () => {
      // componentWillUnmount - tearDown Db
      async function tearDown() {
        await dbTearDown();
      }
      tearDown();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Important: dependency array must be empty or you will get the following error
  // "cannot send a message since the worker is not set" and app will infinite loop

  // This useEffect specifically handle dynamic table name generation
  // separated from the previous useEffect that handles db initialization and teardown
  useEffect(() => {
    if (startDate) {
      const year = new Date(startDate).getFullYear();
      setTableNameByYear(`requests_${year}`);
    }
  }, [startDate]); // Depend on startDate

  //   block until db, conn, worker are available
  if (!db || !conn || !worker) {
    return null;
  }

  return (
    <DbContext.Provider value={{
      db,
      conn,
      worker,
      tableNameByYear,
      dbStartTime,
      setDbStartTime,
    }}
    >
      {children}
    </DbContext.Provider>
  );
}

DbProvider.propTypes = {
  children: PropTypes.node,
  startDate: PropTypes.string,
};

DbProvider.defaultProps = {
  children: null,
  startDate: null,
};

// connect DbProvider to Redux to get startDate
const mapStateToProps = state => ({
  startDate: state.filters.startDate,
});

export default connect(mapStateToProps)(DbProvider);
