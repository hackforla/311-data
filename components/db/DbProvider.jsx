import React, { useEffect, useState } from 'react';
import PropTypes from 'proptypes';
import * as duckdb from '@duckdb/duckdb-wasm';
import Worker from 'web-worker';
import DbContext from '@db/DbContext';

// List of remote dataset locations used by db.registerFileURL
const datasets = {
  parquet: {
    // huggingface
    hfYtd:
      'https://huggingface.co/datasets/edwinjue/311-data-2023/resolve/refs%2Fconvert%2Fparquet/default/train/0000.parquet', // year-to-date
    hfLastMonth:
      'https://huggingface.co/datasets/edwinjue/311-data-last-month/resolve/refs%2Fconvert%2Fparquet/edwinjue--311-data-last-month/csv-train.parquet', // last month
  },
  csv: {
    // huggingface
    hfYtd:
      'https://huggingface.co/datasets/edwinjue/311-data-2023/resolve/main/2023.csv', // year-to-date
  },
};

const DbProvider = ({ children }) => {
  const [db, setDb] = useState(null);
  const [conn, setConn] = useState(null);
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    const dbInitialize = async () => {
      try {
        console.log('Loading db...');

        const DUCKDB_CONFIG = await duckdb.selectBundle({
          mvp: {
            mainModule: './duckdb.wasm',
            mainWorker: './duckdb-browser.worker.js',
          },
          eh: {
            mainModule: './duckdb-eh.wasm',
            mainWorker: './duckdb-browser-eh.worker.js',
          },
        });

        // Initialize a new duckdb instance
        const logger = new duckdb.ConsoleLogger();
        const newWorker = new Worker(DUCKDB_CONFIG.mainWorker);

        const newDb = new duckdb.AsyncDuckDB(logger, newWorker);

        await newDb.instantiate(
          DUCKDB_CONFIG.mainModule,
          DUCKDB_CONFIG.pthreadWorker,
        );

        // register parquet
        await newDb.registerFileURL(
          'requests.parquet',
          datasets.parquet.hfYtd,
          4, // HTTP = 4. For more options: https://tinyurl.com/DuckDBDataProtocol
        );

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

  //   block until db, conn, worker are available
  if (!db || !conn || !worker) {
    return null;
  }

  return (
    <DbContext.Provider value={{ db, conn, worker }}>
      {children}
    </DbContext.Provider>
  );
};

DbProvider.propTypes = {
  children: PropTypes.node,
};

DbProvider.defaultProps = {
  children: null,
};

export default DbProvider;
