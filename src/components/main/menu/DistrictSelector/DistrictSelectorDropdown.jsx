import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import propTypes from 'proptypes';

import { updateComparisonList } from '@reducers/comparisonFilters';

import {
  COUNCILS,
  CITY_COUNCILS,
} from '@components/common/CONSTANTS';
import Checkbox from '@components/common/Checkbox';

const DistrictSelectorDropdown = ({
  district,
  set,
  updateCompList,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [districtList, setDistrictList] = useState(null);
  const [filteredDistrictList, setFilteredDistrictList] = useState(null);
  const [selectedDistrictList, setSelectedDistrictList] = useState(null);

  useEffect(() => {
    const createDistrictSelectedList = () => {
      let list = [];

      switch (district) {
        case 'nc':
          list = COUNCILS.map(d => d.name);
          break;
        case 'cc':
          list = CITY_COUNCILS.map(d => d.name);
          break;
        default:
          break;
      }

      list.reduce((acc, council) => {
        acc[council] = false;
        return acc;
      }, { all: false });
    };

    const getDistrictList = () => {
      let list;

      switch (district) {
        case 'nc':
          list = COUNCILS.map(d => d.name);
          break;
        case 'cc':
          list = CITY_COUNCILS.map(d => d.name);
          break;
        default:
          list = null;
          break;
      }

      setFilteredDistrictList(list);
      setDistrictList(list);
      setSelectedDistrictList(list ? list.reduce((acc, council) => {
        acc[council] = false;
        return acc;
      }, { all: false }) : null);
    };

    getDistrictList();
    createDistrictSelectedList();
  }, [district]);

  const selectRowStyle = {
    margin: '0',
  };

  const selectRowTextStyle = {
    width: '280px',
  };

  const checkboxStyleFix = {
    padding: '10px',
    margin: '0',
  };

  const handleSearch = e => {
    const term = e.target.value;
    const searchFilter = new RegExp(term, 'i');
    const searchList = districtList.filter(council => searchFilter.test(council));
    setFilteredDistrictList(searchList);
    setSearchValue(e.target.value);
  };

  const handleSelectCouncil = council => {
    const newSelectedDistrictList = { ...selectedDistrictList };

    switch (council) {
      case 'all': {
        let value = true;

        if (newSelectedDistrictList.all) {
          newSelectedDistrictList.all = false;
          value = false;
        }

        Object.keys(newSelectedDistrictList).forEach(c => {
          newSelectedDistrictList[c] = value;
        });
        break;
      }
      default:
        newSelectedDistrictList.all = false;
        newSelectedDistrictList[council] = !newSelectedDistrictList[council];
        break;
    }

    const newNCList = Object.keys(newSelectedDistrictList).filter(c => newSelectedDistrictList[c] && c !== 'all');

    setSelectedDistrictList(newSelectedDistrictList);
    updateCompList(set, newNCList);
  };

  return (
    <div className="nc-selector" style={{ width: '349px' }}>
      <br />
      <div className="nc-seach-list-wrapper">
        <div className="nc-search">
          <div className="field">
            <div className="control has-icons-right">
              <input
                className="input"
                type="text"
                placeholder="Search"
                style={{
                  border: '1px solid #999999',
                  borderRadius: '3px',
                  boxSizing: 'border-box',

                }}
                value={searchValue}
                onChange={handleSearch}
              />
              <span className="icon is-small is-right">
                <i className="fas fa-search" />
              </span>
            </div>
          </div>
        </div>

        <div
          className="nc-list"
          style={{
            height: '231px',
            overflowX: 'hidden',
            msOverflowY: 'scroll',
            padding: '10px 23px 10px 10px',
            border: '1px solid #999999',
            borderRadius: '3px',
            boxSizing: 'border-box',
          }}
        >
          <div className="level" style={selectRowStyle}>
            <div className="level-left">
              <div className="level-item">
                <p className="is-size-6" style={selectRowTextStyle}>
                  SELECT ALL
                </p>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                <Checkbox
                  id="nc-select-all"
                  size="small"
                  handleClick={() => handleSelectCouncil('all')}
                  checked={selectedDistrictList?.all ?? false}
                  style={checkboxStyleFix}
                />
              </div>
            </div>
          </div>

          {filteredDistrictList && filteredDistrictList.map(council => (
            <div key={council} className="comparison-council level" style={selectRowStyle}>
              <div className="level-left">
                <div className="level-item">
                  <p className="is-size-6" style={selectRowTextStyle}>
                    {council}
                  </p>
                </div>
              </div>
              <div className="level-right">
                <div className="level-item">
                  <Checkbox
                    id={`nc-select-${council}`}
                    size="small"
                    handleClick={() => handleSelectCouncil(council)}
                    checked={selectedDistrictList?.[council] ?? false}
                    style={checkboxStyleFix}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  updateCompList: (set, list) => dispatch(updateComparisonList(set, list)),
});

DistrictSelectorDropdown.propTypes = {
  district: propTypes.string.isRequired,
  set: propTypes.string.isRequired,
  updateCompList: propTypes.func,
};

DistrictSelectorDropdown.defaultProps = {
  updateCompList: () => null,
};

export default connect(null, mapDispatchToProps)(DistrictSelectorDropdown);
