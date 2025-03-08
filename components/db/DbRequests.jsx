const createRequestsTable = async ({conn, setDbStartTime}, setState) => {
  setState({ isTableLoading: true });

  // define the requests table if it doesn't already exist
  const createSQL = `
    CREATE TABLE IF NOT EXISTS requests (
      SRNumber VARCHAR,
      CreatedDate DATETIME,
      UpdatedDate DATETIME,
      ActionTaken VARCHAR,
      Owner VARCHAR,
      RequestType VARCHAR,
      Status VARCHAR,
      RequestSource VARCHAR,
      CreatedByUserOrganization VARCHAR,
      MobileOS VARCHAR,
      Anonymous VARCHAR,
      AssignTo VARCHAR,
      ServiceDate DATETIME,
      ClosedDate DATETIME,
      AddressVerified VARCHAR,
      ApproximateAddress VARCHAR,
      Address VARCHAR,
      HouseNumber VARCHAR,
      Direction VARCHAR,
      StreetName VARCHAR,
      Suffix VARCHAR,
      ZipCode VARCHAR,
      Latitude DECIMAL(8),
      Longitude DECIMAL(8),
      Location VARCHAR,
      TBMPage VARCHAR,
      TBMColumn VARCHAR,
      TBMRow VARCHAR,
      APC VARCHAR,
      CD VARCHAR,
      CDMember VARCHAR,
      NC VARCHAR,
      NCName VARCHAR,
      PolicePrecinct VARCHAR,
    )
  `;

  const startTime = performance.now();
  setDbStartTime(startTime);

    try {
      await conn.query(createSQL);
      const endTime = performance.now();
      console.log(`Dataset registration & table creation (by year) time: ${Math.floor(endTime - startTime)} ms.`);
    } catch (error) {
      console.error("Error in creating table or registering dataset:", error);
    } finally {
      setState({ isTableLoading: false });
    }
};

/**
 * `fetchData` is a placeholder function to request data when given a set of filter params. e.g: date range(s), SR type, SR status, NC.
 * once fleshed out, it will replace the `setData` function in `components/Map/index.jsx` and will be the accessor method for fetching data from external sources (e.g. Socrata, Huggingface)
 *
 * Fetches data from DuckDB using provided filters.
 *
 * @param {Object} conn - The DuckDB connection instance.
 * @param {Object} filters - An object containing any or none of the following filter parameters:
 *    - startDate: (string) Start of date range (YYYY-MM-DD)
 *    - endDate: (string) End of date range (YYYY-MM-DD)
 *    - requestType: (string) Filter by request type
 *    - status: (string) Filter by status
 *    - ncName: (string) Filter by neighborhood council (NC)
 *
 * Example Usage:
 * fetchData({ conn }, { startDate: "2023-01-01", endDate: "2023-12-31", requestType: "Graffiti" });
 */
  const fetchData = async ({ conn }, filters = {}) => {
    try {
      // Step 1: Log table structure as proof of concept
      console.log("Fetching table schema...");
      const schemaResult = await conn.query("DESCRIBE requests");
      console.log(schemaResult.toString());

      // Step 2: Construct SQL Query with Filters
      let query = "SELECT * FROM requests WHERE 1=1"; // `1=1` allows appending conditions dynamically

      if (filters.startDate) {
        query += ` AND CreatedDate >= '${filters.startDate}'`;
      }
      if (filters.endDate) {
        query += ` AND CreatedDate <= '${filters.endDate}'`;
      }
      if (filters.requestType) {
        query += ` AND RequestType = '${filters.requestType}'`;
      }
      if (filters.status) {
        query += ` AND Status = '${filters.status}'`;
      }
      if (filters.ncName) {
        query += ` AND NCName = '${filters.ncName}'`;
      }

      console.log("Executing query:", query);

      // Step 3: Run Query
      const result = await conn.query(query);

      // Step 4: Convert Results to JSON
      const data = result.toArray(); // Converts ArrowTable to JSON-like array
      console.log("Fetched Data:", data);

      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

export { createRequestsTable, fetchData };
