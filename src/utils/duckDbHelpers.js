import { createObjFromArrays } from '@utils';

// MetatableData
const getTableSchema = table => {
  if (!!table?.schema?.fields === false) {
    return undefined;
  }
  const pairs = table.schema.fields.map(f => [f.name, f.type.toString()]);
  return Object.fromEntries(pairs);
};

const getTableHeaders = table => {
  if (!!table?.schema?.fields === false) {
    return undefined;
  }
  const tableHeaders = table.schema.fields.map(f => f.name);
  return tableHeaders;
};

// Records Count
const getTableCount = table => {
  if (!!table === false) {
    return undefined;
  }
  return table.toArray().length;
};

const getTableData = table => {
  if (!!table === false) {
    return undefined;
  }

  let currentRow = [];
  let currentRowAsObj = {};
  const tableData = [];
  const tableHeaders = getTableHeaders(table);
  const nRows = getTableCount(table);

  // Loop through each row and create a javascript object
  // using tableHeaders for the key values for each corresponding value in
  // the current table row
  for (let i = 0; i < nRows; i += 1) {
    currentRow = table.get(i).toArray();
    currentRowAsObj = createObjFromArrays({
      keyArray: tableHeaders,
      valArray: currentRow,
    });
    tableData.push(currentRowAsObj);
  }

  return tableData;
};

export default {
  getTableCount,
  getTableData,
  getTableHeaders,
  getTableSchema,
};
