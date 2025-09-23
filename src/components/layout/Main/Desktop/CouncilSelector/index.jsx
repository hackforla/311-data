import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import {
  updateNcId,
  updateSelectedCouncils,
  updateUnselectedCouncils,
} from '@reducers/filters';
import { closeBoundaries } from '@reducers/ui';
import { debounce } from '@utils';
import BoundariesSection from '@components/layout/Main/Desktop/BoundariesSection';
import SelectedCouncils from './SelectedCouncils';
import CouncilsList from './CouncilsList';

const useStyles = makeStyles(theme => ({
  header: {
    fontSize: '12.47px',
    fontWeight: theme.typography.fontWeightMedium,
    marginBottom: '8px',
  },
}));

// TODO: display loader while fetching councils

function CouncilSelector({
  councils,
  selected,
  unselected,
  dispatchUpdateNcId,
  dispatchUpdateSelectedCouncils,
  dispatchUpdateUnselectedCouncils,
  dispatchCloseBoundaries,
  resetMap,
  resetAddressSearch,
  hasError = false // Form Validation for blank map
}) {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatchUpdateUnselectedCouncils(councils);
  }, [councils, dispatchUpdateUnselectedCouncils]);

  const handleDelete = e => {
    // Clear out address search input
    resetAddressSearch();
    resetMap();
    //Clear district council search box field on deselect
    setSearchTerm('');
  };

  // Boundaries selection event handler
  // Selecting a neighborhood district will triger the handleSelect event
  // Allow single boundary to be selected.
  const handleSelect = e => {
    const selectedCouncilId = Number(e.target.value);
    if (!selected.some(({ councilId }) => councilId === selectedCouncilId)) {
      // Clear out address search input
      resetAddressSearch();

      const newSelectedCouncil = councils.find(
        ({ councilId }) => councilId === selectedCouncilId,
      );
      const newSelected = [newSelectedCouncil];
      dispatchUpdateSelectedCouncils(newSelected);
      dispatchUpdateUnselectedCouncils(councils);
      // dispatchUpdateNcId(selectedCouncilId); // Triggers zoom

      // Collapse boundaries section
      // dispatchCloseBoundaries();
    }
  };

  // Debounced event handlers
  const debouncedHandleSelect = debounce(handleSelect);
  const debouncedHandleDelete = debounce(handleDelete);

  return (
    <>
      <Typography className={classes.header} 
        style={{ color: hasError ? '#DE2800' : 'inherit' }}
      >
        Boundaries
      </Typography>
      <div style={{ border: hasError ? '1.3px solid #DE2800': undefined, borderRadius: '5px' }}>
      <BoundariesSection>
        <BoundariesSection.Display >
          <SelectedCouncils items={selected} onDelete={debouncedHandleDelete} />
        </BoundariesSection.Display>
        <BoundariesSection.Collapse>
          {unselected && (
            <CouncilsList items={unselected} onClick={debouncedHandleSelect}searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          )}
        </BoundariesSection.Collapse>
      </BoundariesSection>
      </div>
    </>
  );
}

const mapStateToProps = state => ({
  councils: state.metadata.councils,
  selected: state.filters.selected,
  unselected: state.filters.unselected,
});

const mapDispatchToProps = dispatch => ({
  dispatchUpdateNcId: councilId => dispatch(updateNcId(councilId)),
  dispatchUpdateSelectedCouncils: councils => dispatch(updateSelectedCouncils(councils)),
  dispatchUpdateUnselectedCouncils: councils => dispatch(updateUnselectedCouncils(councils)),
  dispatchCloseBoundaries: () => dispatch(closeBoundaries()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CouncilSelector);

CouncilSelector.defaultProps = {
  councils: [],
  selected: [],
  unselected: [],
  resetMap: () => {},
  resetAddressSearch: () => {},
  dispatchCloseBoundaries: undefined,
  hasError: false,
};

CouncilSelector.propTypes = {
  councils: PropTypes.arrayOf(PropTypes.shape({})),
  selected: PropTypes.arrayOf(PropTypes.shape({})),
  unselected: PropTypes.arrayOf(PropTypes.shape({})),
  dispatchUpdateNcId: PropTypes.func.isRequired,
  dispatchUpdateSelectedCouncils: PropTypes.func.isRequired,
  dispatchUpdateUnselectedCouncils: PropTypes.func.isRequired,
  resetMap: PropTypes.func,
  resetAddressSearch: PropTypes.func,
  dispatchCloseBoundaries: PropTypes.func,
  hasError: PropTypes.bool,
};
