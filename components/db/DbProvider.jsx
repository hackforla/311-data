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
import moment from 'moment';

// List of remote dataset locations used by db.registerFileURL
const datasets = {
  parquet: {
    // huggingface
    hfYtd2025:
      'https://huggingface.co/datasets/311-data/2025/resolve/main/2025.parquet', // 2025 year-to-date
    hfYtd2024:
      'https://huggingface.co/datasets/311-data/2024/resolve/main/2024.parquet', // 2024 year-to-date
    hfYtd2023:
      'https://huggingface.co/datasets/311-data/2023/resolve/main/2023.parquet', // 2023 entire year
    hfYtd2022:
      'https://huggingface.co/datasets/311-data/2022/resolve/main/2022.parquet', // 2022 entire year
    hfYtd2021:
      'https://huggingface.co/datasets/311-data/2021/resolve/main/2021.parquet', // 2021 entire year
    hfYtd2020:
      'https://huggingface.co/datasets/311-data/2020/resolve/main/2020.parquet', // 2020 entire year
  },
};

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

        await newDb.instantiate(
          DUCKDB_CONFIG.mainModule,
          DUCKDB_CONFIG.pthreadWorker,
        );

        // register parquet
        await newDb.registerFileURL(
          'requests2025.parquet',
          datasets.parquet.hfYtd2025,
          4, // HTTP = 4. For more options: https://tinyurl.com/DuckDBDataProtocol
        );

        await newDb.registerFileURL(
          'requests2024.parquet',
          datasets.parquet.hfYtd2024,
          4, // HTTP = 4. For more options: https://tinyurl.com/DuckDBDataProtocol
        );

        await newDb.registerFileURL(
          'requests2023.parquet',
          datasets.parquet.hfYtd2023,
          4,
        );

        await newDb.registerFileURL(
          'requests2022.parquet',
          datasets.parquet.hfYtd2022,
          4,
        );

        await newDb.registerFileURL(
          'requests2021.parquet',
          datasets.parquet.hfYtd2021,
          4,
        );

        await newDb.registerFileURL(
          'requests2020.parquet',
          datasets.parquet.hfYtd2020,
          4,
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

  // This useEffect specifically handle dynamic table name generation
  // separated from the previous useEffect that handles db initialization and teardown
  useEffect(() => {
    if (startDate) {
      const year = moment(startDate).year();
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
