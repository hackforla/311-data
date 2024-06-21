import React, { useState } from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
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
import TypeSelector from '@components/main/Desktop/TypeSelector';
import StatusSelector from '@components/main/Desktop/StatusSelector';
import CouncilSelector from '@components/main/Desktop/CouncilSelector';
import ShareableLinkCreator from '@components/main/Desktop/ShareableLinkCreator';
import ExportButton from '@components/main/Desktop/ExportButton';

// import GearButton from '@components/common/GearButton';
// import clsx from 'clsx';

import sharedStyles from '@theme/styles';

const useStyles = makeStyles(theme => ({
  card: {
    width: 325,
    backgroundColor: theme.palette.primary.main,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
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
  content: {
    padding: '6px 14px',
  },
}));

// const FilterMenu = ({ toggleMenu }) => { //toggleMenu used with GearButton
function FilterMenu({ resetMap, resetAddressSearch }) {
  const [expanded, setExpanded] = useState(true);
  const classes = useStyles();
  const sharedClasses = sharedStyles();

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
            {/* <GearButton aria-label="toggle map menu" onClick={toggleMenu} /> */}
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
        <CardContent className={classes.content}>
          <div className={classes.selectorWrapper}>
            <CouncilSelector
              resetMap={resetMap}
              resetAddressSearch={resetAddressSearch}
            />
          </div>
          <div className={classes.selectorWrapper}>
            <DateSelector range />
          </div>
          <div className={classes.selectorWrapper}>
            <TypeSelector />
          </div>
          <div className={classes.selectorWrapper}>
            <StatusSelector />
          </div>
          <div className={classes.selectorWrapper}>
            <ShareableLinkCreator />
          </div>
          <div className={classes.selectorWrapper}>
            <ExportButton />
          </div>
        </CardContent>
      </Collapse>
    </Card>
  );
}

const mapDispatchToProps = dispatch => ({
  toggleMenu: () => dispatch(reduxToggleMenu()),
});

export default connect(null, mapDispatchToProps)(FilterMenu);

FilterMenu.defaultProps = {
  resetMap: () => {},
  resetAddressSearch: () => {},
};

FilterMenu.propTypes = {
  resetMap: PropTypes.func,
  resetAddressSearch: PropTypes.func,
  // toggleMenu: PropTypes.func.isRequired,
};
