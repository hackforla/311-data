import React, { useState } from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import { triggerDisplayData } from '@reducers/data';
import makeStyles from '@mui/styles/makeStyles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import { toggleMenu as reduxToggleMenu } from '@reducers/ui';
import DateSelector from '@components/DateSelector/DateSelector';
import MapSearch from '../../../../features/Map/controls/MapSearch';
// import ShareableLinkCreator from '@components/main/Desktop/ShareableLinkCreator';
import TypeSelector from '@components/layout/Main/Desktop/TypeSelector';
import StatusSelector from '@components/layout/Main/Desktop/StatusSelector';
import CouncilSelector from '@components/layout/Main/Desktop/CouncilSelector';
import ExportButton from '@components/layout/Main/Desktop/Export/ExportButton';
import Button from '@mui/material/Button';

// import clsx from 'clsx';

import sharedStyles from '@theme/styles';

const useStyles = makeStyles(theme => ({
  card: {
    width: 325,
    backgroundColor: theme.palette.primary.main,
    borderTopLeftRadius: theme.borderRadius.md,
    borderTopRightRadius: theme.borderRadius.md,
    borderBottomLeftRadius: theme.borderRadius.md,
    borderBottomRightRadius: theme.borderRadius.md,
  },
  header: {
    // color: theme.palette.text.cyan,
    padding: theme.gaps.xs,
    paddingRight: 0,
  },
  headerAction: {
    margin: 'auto',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
  },
  headerMargin: {
    marginLeft: '10px', // to fill space of gear icon
  },
  button: {
    padding: theme.gaps.xs,
    paddingRight: 0,
    color: theme.palette.text.dark,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
    '& svg': {
      fontSize: 30,
    },
  },
  selectorWrapper: {
    marginBottom: theme.gaps.md,
  },
  displayButton: {
     width: 300,
     display: 'flex',
     alignItems: 'center',
     justifyContent: 'center',
     marginTop: 30,
     borderRadius: 5,
     padding: 3,
     backgroundColor: theme.palette.text.secondaryLight,
     color: 'black',
     text: 'black',
  },
  export: {
     display: 'flex',
     alignItems: 'center',
  },
  content: {
    padding: '6px 14px',
  },
}));

// const FilterMenu = ({ toggleMenu }) => { //toggleMenu used with GearButton
function FilterMenu({ resetMap, resetAddressSearch, map, geoFilterType, councils, onGeocoderResult, onChangeTab, onReset, canReset,
  // Redux connected components
  selectedCouncils, // Councils/Boundaries Form Values
  startDate, endDate, // Date Range Form Values
  selectedTypes, // Request Type Form Values
  requestStatus, // Request Status Form Values
}) {
  const [expanded, setExpanded] = useState(true);
  const classes = useStyles();
  const sharedClasses = sharedStyles();
  // Blank map implementation: form validation
  const [formErrors, setFormErrors] = useState({});
  const [formValid, setFormValid] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const dispatch = useDispatch();

  const handleGeocoderResult = ( result ) => {
    console.log("Filter menu received address selected:", result.place_name);
    setSelectedAddress(result.place_name);
  };

  const validateForm = () => {
    let newErrors = {};

    // Address Validation or Council Validation
    console.log('Selected Address: ' + selectedAddress);
    if (!selectedAddress && (!selectedCouncils || selectedCouncils.length === 0)) {
      newErrors.address = 'Please search by address or neighborhood';
      newErrors.councils = 'Please select a Neighborhood';
    }
    
    // Date Range Validation
    if (!startDate && !endDate) {
      newErrors.dates = 'Please select a date range';
    } else if (!startDate && endDate) {
      newErrors.dates = 'Please select a start date';
    } else if (startDate && !endDate) {
      newErrors.dates = 'Please select an end date';
    }
    console.log('startDate: ' + startDate);
    console.log('endDate: ' + endDate);

    // Request Type Validation
    const anyTypeSelected = Object.values(selectedTypes).some(val => val);
    if (!anyTypeSelected) {
      newErrors.types = 'Please select at least one type of request';
    }

    // Request Status Validation
    if (!requestStatus.open && !requestStatus.closed) {
      newErrors.status = 'Please select at least one request status';
    }

    setFormErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setFormValid(isValid);
    return isValid;
  };

  const handleDisplayData = () => {
    if (validateForm()) {
      console.log("Valid form — proceeds to display data");
      // trigger data fetch 
      dispatch(triggerDisplayData());
    } else {
      console.log("Invalid form", formErrors);
    }
    setSelectedAddress(null);
  };
  

  return (
    <Card className={classes.card}>
      <CardHeader
        disableTypography
        classes={{
          root: classes.header,
          action: classes.headerAction,
          content: classes.headerContent,
        }}
        title={(
          <div className={classes.headerContent}>
            <div className={classes.headerMargin}>
              <Typography className={sharedClasses.headerTitle} variant="h6">
                FILTERS
              </Typography>
            </div>
          </div>
        )}
        action={(
          <IconButton
            className={classes.button}
            aria-label="toggle filter menu"
            onClick={() => setExpanded(prevExpanded => !prevExpanded)}
            disableFocusRipple
            disableRipple
            size="large"
          >
            {expanded ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          </IconButton>
        )}
      />
      <Collapse in={expanded}>
        <CardContent className={classes.content} style={{ borderTop: `1px solid #7A5B21`, paddingBottom: '8px' }}>
          <div className={classes.selectorWrapper}>
            <div className={classes.selectorWrapper}>
               <MapSearch
                map={map}
                geoFilterType={geoFilterType}
                councils={councils}
                onGeocoderResult={handleGeocoderResult}
                onChangeTab={onChangeTab}
                onReset={onReset}
                canReset={canReset}
                hasError={formErrors.address ? true : false}
              />
              {formErrors.address && (<Typography style={{ color: '#DE2800' }} variant="body2">{formErrors.address}</Typography>)}
            </div>
            <div className={classes.selectorWrapper}>
              <CouncilSelector 
                resetMap={resetMap}
                resetAddressSearch={resetAddressSearch}
                hasError={formErrors.councils ? true : false}
              />
               {formErrors.councils && (<Typography style={{ color: '#DE2800' }} variant="body2">{formErrors.councils}</Typography>)}
            </div>
            <div className={classes.selectorWrapper}>
              <DateSelector range hasError={formErrors.dates ? true : false}/>
              {formErrors.dates && (<Typography style={{ color: '#DE2800' }} variant="body2">{formErrors.dates}</Typography>)}
            </div>
            <div className={classes.selectorWrapper}>
              <TypeSelector hasError={formErrors.types ? true : false}/>
              {formErrors.types && (<Typography style={{ color: '#DE2800' }} variant="body2">{formErrors.types}</Typography>)}
            </div>
            <div className={classes.selectorWrapper}>
              <StatusSelector hasError={formErrors.status ? true : false}/> 
              {formErrors.status && (<Typography style={{ color: '#DE2800' }} variant="body2"> {formErrors.status} </Typography>)}
            </div>
            <div className={classes.selectorWrapper}>
               <Button variant="text" className={classes.displayButton} onClick={handleDisplayData} color="inherit">Display Data</Button>
            </div>
            <div className={classes.selectorWrapper}>
              <ExportButton className={classes.export} disabled={formValid === false}/>
            </div>
          </div>
        </CardContent>
      </Collapse>
    </Card>
  );
}

// Child component props for form validation
const mapStateToProps = state => ({
  // Councils/Boundaries Form Values
  selectedCouncils: state.filters.selected,
  // Date Range Form Values
  startDate: state.filters.startDate,
  endDate: state.filters.endDate,
  // Request Type Form Values
  selectedTypes: state.filters.requestTypes,
  // Request Status Form Values
  requestStatus: state.filters.requestStatus
});

const mapDispatchToProps = dispatch => ({
  toggleMenu: () => dispatch(reduxToggleMenu()),
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterMenu);

FilterMenu.defaultProps = {
  resetMap: () => {},
  resetAddressSearch: () => {},
  map: null,
  geoFilterType: '',
  councils: [],
  onGeocoderResult: () => {},
  onChangeTab: () => {},
  onReset: () => {},
  canReset: false,
  // Councils/Boundaries Form Values
  selectedCouncils: null,
  // Date Range Form Values
  startDate: null,
  endDate: null,
  // Request Type Form Values
  selectedTypes: {},
  // Request Status Form Values
};

FilterMenu.propTypes = {
  resetMap: PropTypes.func,
  resetAddressSearch: PropTypes.func,
  toggleMenu: PropTypes.func.isRequired,
  map: PropTypes.shape({}),          
  geoFilterType: PropTypes.string,  
  councils: PropTypes.arrayOf(PropTypes.shape({})),      
  onGeocoderResult: PropTypes.func,
  onChangeTab: PropTypes.func,
  onReset: PropTypes.func,
  canReset: PropTypes.bool,
};
