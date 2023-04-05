import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  updateNcId,
  updateSelectedCouncils,
  updateUnselectedCouncils,
} from '@reducers/filters';
import {
  debounce,
  toggleBoundaries,
} from '@utils';
import { makeStyles } from '@material-ui/core/styles';
import not from '@utils/not';
import BoundariesSection from '../BoundariesSection';
import SelectedCouncils from './SelectedCouncils';
import CouncilsList from './CouncilsList';

const useStyles = makeStyles(theme => ({
  label: {
    display: 'inline-block',
    font: theme.typography.b2,
    marginBottom: '10px',
    color: theme.palette.secondary.light,
  },
}));

// TODO: display loader while fetching councils

const CouncilSelector = ({
  councils,
  selected,
  unselected,
  dispatchUpdateCouncilsFilter,
  dispatchUpdateSelectedCouncils,
  dispatchUpdateUnselectedCouncils,
  resetMap,
  resetAddressSearch,
}) => {
  const classes = useStyles();

  useEffect(() => {
    dispatchUpdateUnselectedCouncils(councils);
  }, [councils, dispatchUpdateUnselectedCouncils]);

  const handleDelete = e => {
    const deletedCouncilId = Number(e.currentTarget.dataset.id);
    const newSelected = selected.filter(({ councilId }) => councilId !== deletedCouncilId);
    const newUnselected = not(councils, newSelected, 'councilId');
    dispatchUpdateSelectedCouncils(newSelected);
    dispatchUpdateUnselectedCouncils(newUnselected);
    dispatchUpdateCouncilsFilter(deletedCouncilId);
    resetMap();
  };

  // Boundaries selection event handler
  // Selecting a neighborhood district will triger the handleSelect event
  // Allow single boundary to be selected.
  const handleSelect = e => {
    const selectedCouncilId = Number(e.target.value);
    if (!selected.some(({ councilId }) => councilId === selectedCouncilId)) {
      // Clear out Address Search input
      resetAddressSearch();

      const newSelectedCouncil = councils.find(({ councilId }) => councilId === selectedCouncilId);
      const newSelected = [newSelectedCouncil];
      dispatchUpdateSelectedCouncils(newSelected);
      dispatchUpdateUnselectedCouncils(councils);
      dispatchUpdateCouncilsFilter(selectedCouncilId);

      // Toggle to close Boundaries selector box
      toggleBoundaries();
    }
  };

  // Debounced event handlers
  const debouncedHandleSelect = debounce(handleSelect);
  const debouncedHandleDelete = debounce(handleDelete);

  return (
    <>
      <div className={classes.label}>Boundaries</div>
      <BoundariesSection>
        <BoundariesSection.Display>
          <SelectedCouncils
            items={selected}
            onDelete={debouncedHandleDelete}
          />
        </BoundariesSection.Display>
        <BoundariesSection.Collapse>
          {
            unselected
              && (
                <CouncilsList
                  items={unselected}
                  onClick={debouncedHandleSelect}
                />
              )
          }
        </BoundariesSection.Collapse>
      </BoundariesSection>
    </>
  );
};

const mapStateToProps = state => ({
  councils: state.metadata.councils,
  selected: state.filters.selected,
  unselected: state.filters.unselected,
});

const mapDispatchToProps = dispatch => ({
  dispatchUpdateCouncilsFilter: councilId => dispatch(updateNcId(councilId)),
  dispatchUpdateSelectedCouncils: councils => dispatch(updateSelectedCouncils(councils)),
  dispatchUpdateUnselectedCouncils: councils => dispatch(updateUnselectedCouncils(councils)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CouncilSelector);

CouncilSelector.defaultProps = {
  councils: [],
  selected: [],
  unselected: [],
  resetMap: () => {},
  resetAddressSearch: () => {},
};

CouncilSelector.propTypes = {
  councils: PropTypes.arrayOf(PropTypes.shape({})),
  selected: PropTypes.arrayOf(PropTypes.shape({})),
  unselected: PropTypes.arrayOf(PropTypes.shape({})),
  dispatchUpdateCouncilsFilter: PropTypes.func.isRequired,
  dispatchUpdateSelectedCouncils: PropTypes.func.isRequired,
  dispatchUpdateUnselectedCouncils: PropTypes.func.isRequired,
  resetMap: PropTypes.func,
  resetAddressSearch: PropTypes.func,
};
