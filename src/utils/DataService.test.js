import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';

// vi.mock is hoisted above imports by Vitest, so DataService.js will
// receive the mocked ddbh when it imports it at module load time.
vi.mock('@utils/duckDbHelpers.js', () => ({
  default: { getTableData: vi.fn() },
}));

import {
  FIELD_MAP,
  normalize,
  getSocrataDataResources,
  getServiceRequestSocrata,
  getServiceRequestHF,
} from '@utils/DataService';
import ddbh from '@utils/duckDbHelpers.js';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const RAW_2025 = {
  srnumber:                  '1-234567890A',
  createddate:               '2025-01-15T00:00:00.000',
  closeddate:                '2025-02-01T00:00:00.000',
  updateddate:               '2025-01-20T00:00:00.000',
  requesttype:               'Bulky Items',
  status:                    'Closed',
  requestsource:             'Mobile App',
  owner:                     'Bureau of Sanitation',
  assignto:                  'BSS',
  createdbyuserorganization: 'MyLA311',
  actiontaken:               'Service Provided',
  address:                   '123 Main St',
  housenumber:               '123',
  direction:                 'N',
  streetname:                'MAIN',
  suffix:                    'ST',
  zipcode:                   '90012',
  latitude:                  '34.0537',
  longitude:                 '-118.2427',
  location:                  { type: 'Point', coordinates: [-118.2427, 34.0537] },
  nc:                        '28',
  ncname:                    'Downtown Los Angeles',
  cd:                        '14',
  cdmember:                  'Kevin de León',
  apc:                       'Central',
  policeprecinct:            'Central',
  tbmpage:                   '634',
  tbmcolumn:                 'J',
  tbmrow:                    '3',
  anonymous:                 'N',
  mobileos:                  'iOS',
  servicedate:               '2025-01-16T00:00:00.000',
  addressverified:           'Verified',
  approximateaddress:        'N',
};

const RAW_2026 = {
  casenumber:                    'CASE-2026-001',
  createddate:                   '2026-03-01T00:00:00.000',
  closeddate:                    '2026-03-15T00:00:00.000',
  systemmodstamp:                '2026-03-10T00:00:00.000',
  type:                          'Graffiti Removal',
  status:                        'Closed',
  origin:                        'Web',
  department_name__c:            'Bureau of Street Services',
  assigned_to__c:                'BSS-Graffiti',
  created_by_user_organization:  'LA311',
  resolution_code__c:            'Service Rendered',
  locator_gis_returned_address:  '456 Elm Ave',
  locator_sr_house_number_:      '456',
  locator_direction_suffix:      'S',
  locator_sr_street_name__c:     'ELM',
  locator_service_request_suffix:'AVE',
  zipcode__c:                    '90029',
  geolocation__latitude__s:      '34.0912',
  geolocation__longitude__s:     '-118.3108',
  locator_sr_neigborhood_council:'11',
  locator_sr_neigborhood_council_1:'Hollywood',
  locator_council_district:      '13',
  locator_sr_council_district:   "Mitch O'Farrell",
  locator_sr_area_planning:      'Hollywood',
  locator_sr_community_police:   'Hollywood',
  locator_sr_tb_map_grid_page:   '593',
  locator_sr_tb_column__c:       'G',
  locator_sr_tb_row__c:          '5',
  reported_anonymously__c:       true,
};

// ---------------------------------------------------------------------------
// FIELD_MAP structure
// ---------------------------------------------------------------------------

describe('FIELD_MAP', () => {
  test('has exactly two contracts', () => {
    expect(Object.keys(FIELD_MAP).sort()).toEqual(['2025andEarlier', '2026']);
  });

  // Fields that must be present in both contracts
  const SHARED_KEYS = [
    'service_request_id',
    'created_at', 'updated_at',
    'status', 'request_type', 'request_source', 'department',
    'assigned_group', 'created_by_organization', 'resolution_code',
    'address_full', 'address_house_number', 'address_direction',
    'address_street_name', 'address_street_suffix',
    'zipcode', 'latitude', 'longitude', 'geometry_point',
    'neighborhood_council_id', 'neighborhood_council_name',
    'council_district_number', 'council_district_member',
    'area_planning_commission', 'police_precinct',
    'tbm_page', 'tbm_column', 'tbm_row',
    'is_anonymous',
    'mobileos', 'servicedate', 'addressverified', 'approximateaddress',
  ];

  test.each(SHARED_KEYS)('both contracts contain key "%s"', (key) => {
    expect(FIELD_MAP['2025andEarlier']).toHaveProperty(key);
    expect(FIELD_MAP['2026']).toHaveProperty(key);
  });

  describe('2025andEarlier contract', () => {
    const c = FIELD_MAP['2025andEarlier'];

    test('has no null source fields', () => {
      const nulled = Object.entries(c).filter(([, v]) => v === null).map(([k]) => k);
      expect(nulled).toEqual([]);
    });

    test('maps identifier and date fields', () => {
      expect(c.service_request_id).toBe('srnumber');
      expect(c.created_at).toBe('createddate');
      expect(c.updated_at).toBe('updateddate');
    });

    test('maps request metadata fields', () => {
      expect(c.request_type).toBe('requesttype');
      expect(c.request_source).toBe('requestsource');
      expect(c.department).toBe('owner');
      expect(c.assigned_group).toBe('assignto');
      expect(c.created_by_organization).toBe('createdbyuserorganization');
      expect(c.resolution_code).toBe('actiontaken');
      expect(c.is_anonymous).toBe('anonymous');
    });

    test('maps location fields', () => {
      expect(c.address_full).toBe('address');
      expect(c.address_house_number).toBe('housenumber');
      expect(c.address_direction).toBe('direction');
      expect(c.address_street_name).toBe('streetname');
      expect(c.address_street_suffix).toBe('suffix');
      expect(c.zipcode).toBe('zipcode');
      expect(c.latitude).toBe('latitude');
      expect(c.longitude).toBe('longitude');
      expect(c.geometry_point).toBe('location');
    });

    test('maps geography fields', () => {
      expect(c.neighborhood_council_id).toBe('nc');
      expect(c.neighborhood_council_name).toBe('ncname');
      expect(c.council_district_number).toBe('cd');
      expect(c.council_district_member).toBe('cdmember');
      expect(c.area_planning_commission).toBe('apc');
      expect(c.police_precinct).toBe('policeprecinct');
    });

    test('maps Thomas Bros grid fields', () => {
      expect(c.tbm_page).toBe('tbmpage');
      expect(c.tbm_column).toBe('tbmcolumn');
      expect(c.tbm_row).toBe('tbmrow');
    });

    test('maps legacy-only fields', () => {
      expect(c.mobileos).toBe('mobileos');
      expect(c.servicedate).toBe('servicedate');
      expect(c.addressverified).toBe('addressverified');
      expect(c.approximateaddress).toBe('approximateaddress');
    });
  });

  describe('2026 contract', () => {
    const c = FIELD_MAP['2026'];

    test('marks fields removed in 2026 as null', () => {
      expect(c.mobileos).toBeNull();
      expect(c.servicedate).toBeNull();
      expect(c.addressverified).toBeNull();
      expect(c.approximateaddress).toBeNull();
    });

    test('maps identifier and date fields to Salesforce names', () => {
      expect(c.service_request_id).toBe('casenumber');
      expect(c.created_at).toBe('createddate');
      expect(c.closed_at).toBe('closeddate');
      expect(c.updated_at).toBe('systemmodstamp');
    });

    test('maps request metadata fields to Salesforce names', () => {
      expect(c.request_type).toBe('type');
      expect(c.request_source).toBe('origin');
      expect(c.department).toBe('department_name__c');
      expect(c.assigned_group).toBe('assigned_to__c');
      expect(c.created_by_organization).toBe('created_by_user_organization');
      expect(c.resolution_code).toBe('resolution_code__c');
      expect(c.is_anonymous).toBe('reported_anonymously__c');
    });

    test('maps location fields to Salesforce/locator names', () => {
      expect(c.address_full).toBe('locator_gis_returned_address');
      expect(c.address_house_number).toBe('locator_sr_house_number_');
      expect(c.address_direction).toBe('locator_direction_suffix');
      expect(c.address_street_name).toBe('locator_sr_street_name__c');
      expect(c.address_street_suffix).toBe('locator_service_request_suffix');
      expect(c.zipcode).toBe('zipcode__c');
      expect(c.latitude).toBe('geolocation__latitude__s');
      expect(c.longitude).toBe('geolocation__longitude__s');
    });

    test('maps geography fields to locator names', () => {
      expect(c.neighborhood_council_id).toBe('locator_sr_neigborhood_council');
      expect(c.neighborhood_council_name).toBe('locator_sr_neigborhood_council_1');
      expect(c.council_district_number).toBe('locator_council_district');
      expect(c.council_district_member).toBe('locator_sr_council_district');
      expect(c.area_planning_commission).toBe('locator_sr_area_planning');
      expect(c.police_precinct).toBe('locator_sr_community_police');
    });

    test('maps Thomas Bros grid fields to locator names', () => {
      expect(c.tbm_page).toBe('locator_sr_tb_map_grid_page');
      expect(c.tbm_column).toBe('locator_sr_tb_column__c');
      expect(c.tbm_row).toBe('locator_sr_tb_row__c');
    });
  });
});

// ---------------------------------------------------------------------------
// normalize()
// ---------------------------------------------------------------------------

describe('normalize', () => {
  test('returns a function', () => {
    expect(typeof normalize(2025)).toBe('function');
    expect(typeof normalize(2026)).toBe('function');
  });

  describe('contract selection', () => {
    test('year 2025 uses 2025andEarlier contract', () => {
      const result = normalize(2025)({ srnumber: 'SR-001' });
      expect(result.service_request_id).toBe('SR-001');
    });

    test('year 2024 uses 2025andEarlier contract', () => {
      const result = normalize(2024)({ srnumber: 'SR-002' });
      expect(result.service_request_id).toBe('SR-002');
    });

    test('year 2019 uses 2025andEarlier contract', () => {
      const result = normalize(2019)({ srnumber: 'SR-003' });
      expect(result.service_request_id).toBe('SR-003');
    });

    test('year 2026 uses 2026 contract', () => {
      const result = normalize(2026)({ casenumber: 'CASE-001' });
      expect(result.service_request_id).toBe('CASE-001');
    });

    test('year 2027 also uses 2026 contract', () => {
      const result = normalize(2027)({ casenumber: 'CASE-002' });
      expect(result.service_request_id).toBe('CASE-002');
    });

    test('accepts a string year', () => {
      const result = normalize('2026')({ casenumber: 'CASE-STR' });
      expect(result.service_request_id).toBe('CASE-STR');
    });
  });

  describe('2025andEarlier normalization', () => {
    const norm = normalize(2025);

    test('maps all 2025andEarlier source fields to internal keys', () => {
      const r = norm(RAW_2025);
      expect(r.service_request_id).toBe('1-234567890A');
      expect(r.created_at).toBe(RAW_2025.createddate);
      expect(r.updated_at).toBe(RAW_2025.updateddate);
      expect(r.request_type).toBe('Bulky Items');
      expect(r.status).toBe('Closed');
      expect(r.request_source).toBe('Mobile App');
      expect(r.department).toBe('Bureau of Sanitation');
      expect(r.assigned_group).toBe('BSS');
      expect(r.created_by_organization).toBe('MyLA311');
      expect(r.resolution_code).toBe('Service Provided');
      expect(r.address_full).toBe('123 Main St');
      expect(r.address_house_number).toBe('123');
      expect(r.address_direction).toBe('N');
      expect(r.address_street_name).toBe('MAIN');
      expect(r.address_street_suffix).toBe('ST');
      expect(r.zipcode).toBe('90012');
      expect(r.latitude).toBe('34.0537');
      expect(r.longitude).toBe('-118.2427');
      expect(r.geometry_point).toEqual({ type: 'Point', coordinates: [-118.2427, 34.0537] });
      expect(r.neighborhood_council_id).toBe('28');
      expect(r.neighborhood_council_name).toBe('Downtown Los Angeles');
      expect(r.council_district_number).toBe('14');
      expect(r.council_district_member).toBe('Kevin de León');
      expect(r.area_planning_commission).toBe('Central');
      expect(r.police_precinct).toBe('Central');
      expect(r.tbm_page).toBe('634');
      expect(r.tbm_column).toBe('J');
      expect(r.tbm_row).toBe('3');
      expect(r.is_anonymous).toBe('N');
      expect(r.mobileos).toBe('iOS');
      expect(r.servicedate).toBe(RAW_2025.servicedate);
      expect(r.addressverified).toBe('Verified');
      expect(r.approximateaddress).toBe('N');
    });

    test('output keys are internal schema keys, not raw source names', () => {
      const r = norm(RAW_2025);
      expect(r).toHaveProperty('service_request_id');
      expect(r).toHaveProperty('request_type');
      expect(r).not.toHaveProperty('srnumber');
      expect(r).not.toHaveProperty('requesttype');
      expect(r).not.toHaveProperty('owner');
      expect(r).not.toHaveProperty('ncname');
    });

    test('output contains exactly the keys in the 2025andEarlier contract', () => {
      const r = norm(RAW_2025);
      const expectedKeys = Object.keys(FIELD_MAP['2025andEarlier']).sort();
      const actualKeys = Object.keys(r).sort();
      expect(actualKeys).toEqual(expectedKeys);
    });

    test('missing source field in record yields null', () => {
      const r = norm({});
      expect(r.service_request_id).toBeNull();
      expect(r.latitude).toBeNull();
      expect(r.neighborhood_council_name).toBeNull();
    });

    test('undefined source field value yields null (not undefined)', () => {
      const r = norm({ srnumber: undefined });
      expect(r.service_request_id).toBeNull();
    });
  });

  describe('2026 normalization', () => {
    const norm = normalize(2026);

    test('maps all 2026 source fields to internal keys', () => {
      const r = norm(RAW_2026);
      expect(r.service_request_id).toBe('CASE-2026-001');
      expect(r.created_at).toBe(RAW_2026.createddate);
      expect(r.closed_at).toBe(RAW_2026.closeddate);
      expect(r.updated_at).toBe(RAW_2026.systemmodstamp);
      expect(r.request_type).toBe('Graffiti Removal');
      expect(r.status).toBe('Closed');
      expect(r.request_source).toBe('Web');
      expect(r.department).toBe('Bureau of Street Services');
      expect(r.assigned_group).toBe('BSS-Graffiti');
      expect(r.created_by_organization).toBe('LA311');
      expect(r.resolution_code).toBe('Service Rendered');
      expect(r.address_full).toBe('456 Elm Ave');
      expect(r.address_house_number).toBe('456');
      expect(r.address_direction).toBe('S');
      expect(r.address_street_name).toBe('ELM');
      expect(r.address_street_suffix).toBe('AVE');
      expect(r.zipcode).toBe('90029');
      expect(r.latitude).toBe('34.0912');
      expect(r.longitude).toBe('-118.3108');
      expect(r.neighborhood_council_id).toBe('11');
      expect(r.neighborhood_council_name).toBe('Hollywood');
      expect(r.council_district_number).toBe('13');
      expect(r.council_district_member).toBe("Mitch O'Farrell");
      expect(r.area_planning_commission).toBe('Hollywood');
      expect(r.police_precinct).toBe('Hollywood');
      expect(r.tbm_page).toBe('593');
      expect(r.tbm_column).toBe('G');
      expect(r.tbm_row).toBe('5');
      expect(r.is_anonymous).toBe(true);
    });

    test('removed fields are null in output', () => {
      const r = norm(RAW_2026);
      expect(r.mobileos).toBeNull();
      expect(r.servicedate).toBeNull();
      expect(r.addressverified).toBeNull();
      expect(r.approximateaddress).toBeNull();
    });

    test('output keys are internal schema keys, not Salesforce source names', () => {
      const r = norm(RAW_2026);
      expect(r).toHaveProperty('service_request_id');
      expect(r).toHaveProperty('request_type');
      expect(r).not.toHaveProperty('casenumber');
      expect(r).not.toHaveProperty('type');
      expect(r).not.toHaveProperty('department_name__c');
      expect(r).not.toHaveProperty('reported_anonymously__c');
    });

    test('output contains exactly the keys in the 2026 contract', () => {
      const r = norm(RAW_2026);
      const expectedKeys = Object.keys(FIELD_MAP['2026']).sort();
      const actualKeys = Object.keys(r).sort();
      expect(actualKeys).toEqual(expectedKeys);
    });

    test('missing source field in record yields null', () => {
      const r = norm({});
      expect(r.service_request_id).toBeNull();
      expect(r.latitude).toBeNull();
      // null-mapped fields also null
      expect(r.mobileos).toBeNull();
    });
  });
});

// ---------------------------------------------------------------------------
// getSocrataDataResources()
// ---------------------------------------------------------------------------

describe('getSocrataDataResources', () => {
  test('returns all expected year-to-resource-ID mappings', () => {
    const resources = getSocrataDataResources();
    expect(resources[2026]).toBe('2cy6-i7zn');
    expect(resources[2025]).toBe('h73f-gn57');
    expect(resources[2024]).toBe('b7dx-7gc3');
    expect(resources[2019]).toBe('pvft-t768');
    expect(resources[2018]).toBe('h65r-yf5i');
    expect(resources[2017]).toBe('d4vt-q4t5');
    expect(resources[2016]).toBe('ndkd-k878');
    expect(resources[2015]).toBe('ms7h-a45h');
  });
});

// ---------------------------------------------------------------------------
// getServiceRequestSocrata()
// ---------------------------------------------------------------------------

describe('getServiceRequestSocrata', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-19'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  test('fetches from the correct 2026 Socrata endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: () => Promise.resolve([RAW_2026]),
    });
    vi.stubGlobal('fetch', fetchMock);

    await getServiceRequestSocrata();

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      'https://data.lacity.org/resource/2cy6-i7zn.json'
    );
  });

  test('returns records normalized to internal schema keys', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: () => Promise.resolve([RAW_2026]),
    }));

    const result = await getServiceRequestSocrata();

    expect(result).toHaveLength(1);
    const r = result[0];
    expect(r.service_request_id).toBe('CASE-2026-001');
    expect(r.request_type).toBe('Graffiti Removal');
    expect(r.latitude).toBe('34.0912');
    expect(r.longitude).toBe('-118.3108');
    expect(r.neighborhood_council_name).toBe('Hollywood');
    expect(r.department).toBe('Bureau of Street Services');
    // Removed fields should be null
    expect(r.mobileos).toBeNull();
    expect(r.servicedate).toBeNull();
  });

  test('normalizes multiple records', async () => {
    const second = { ...RAW_2026, casenumber: 'CASE-2026-002', type: 'Bulky Items' };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: () => Promise.resolve([RAW_2026, second]),
    }));

    const result = await getServiceRequestSocrata();

    expect(result).toHaveLength(2);
    expect(result[0].service_request_id).toBe('CASE-2026-001');
    expect(result[1].service_request_id).toBe('CASE-2026-002');
    expect(result[1].request_type).toBe('Bulky Items');
  });

  test('returns undefined and logs error when fetch rejects', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await getServiceRequestSocrata();

    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching service requests:',
      expect.any(Error)
    );
  });
});

// ---------------------------------------------------------------------------
// getServiceRequestHF()
// ---------------------------------------------------------------------------

describe('getServiceRequestHF', () => {
  const MOCK_ROWS = [
    { SRNumber: 'SR-001', RequestType: 'Bulky Items', Latitude: '34.05', Longitude: '-118.24' },
  ];

  let connMock;

  beforeEach(() => {
    connMock = vi.fn().mockResolvedValue({ schema: {}, batches: [] }); // minimal Arrow-table-like object
    vi.mocked(ddbh.getTableData).mockReturnValue(MOCK_ROWS);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('SQL generation — same year', () => {
    test('queries a single table when start and end are in the same year', async () => {
      await getServiceRequestHF(connMock, '2025-01-01', '2025-03-31');
      const sql = connMock.mock.calls[0][0];
      expect(sql).toMatch(/FROM requests_2025/);
      expect(sql).toMatch(/BETWEEN '2025-01-01' AND '2025-03-31'/);
      expect(sql).not.toMatch(/UNION ALL/);
    });

    test('does not reference any other year table for same-year range', async () => {
      await getServiceRequestHF(connMock, '2026-06-01', '2026-08-31');
      const sql = connMock.mock.calls[0][0];
      expect(sql).toMatch(/FROM requests_2026/);
      expect(sql).not.toMatch(/requests_2025/);
    });
  });

  describe('SQL generation — cross-year', () => {
    test('generates a UNION ALL query when dates span two years', async () => {
      await getServiceRequestHF(connMock, '2024-10-01', '2025-03-31');
      const sql = connMock.mock.calls[0][0];
      expect(sql).toMatch(/UNION ALL/i);
      expect(sql).toMatch(/FROM requests_2024/);
      expect(sql).toMatch(/FROM requests_2025/);
    });

    test('uses end-of-year boundary for the start year', async () => {
      await getServiceRequestHF(connMock, '2024-10-01', '2025-03-31');
      const sql = connMock.mock.calls[0][0];
      // moment('2024-10-01').endOf('year') → 2024-12-31
      expect(sql).toMatch(/BETWEEN '2024-10-01' AND '2024-12-31'/);
    });

    test('uses start-of-year boundary for the end year', async () => {
      await getServiceRequestHF(connMock, '2024-10-01', '2025-03-31');
      const sql = connMock.mock.calls[0][0];
      // moment('2025-03-31').startOf('year') → 2025-01-01
      expect(sql).toMatch(/BETWEEN '2025-01-01' AND '2025-03-31'/);
    });
  });

  test('passes the Arrow table result to ddbh.getTableData', async () => {
    const arrowTable = { schema: {}, batches: ['mock'] };
    connMock.mockResolvedValue(arrowTable);

    await getServiceRequestHF(connMock, '2025-01-01', '2025-01-31');

    expect(ddbh.getTableData).toHaveBeenCalledOnce();
    expect(ddbh.getTableData).toHaveBeenCalledWith(arrowTable);
  });

  test('returns the rows from ddbh.getTableData', async () => {
    const result = await getServiceRequestHF(connMock, '2025-01-01', '2025-01-31');
    expect(result).toEqual(MOCK_ROWS);
  });

  test('returns undefined and logs error when conn rejects', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    connMock.mockRejectedValue(new Error('DB connection failed'));

    const result = await getServiceRequestHF(connMock, '2025-01-01', '2025-01-31');

    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error during database query execution:',
      expect.any(Error)
    );
  });
});
