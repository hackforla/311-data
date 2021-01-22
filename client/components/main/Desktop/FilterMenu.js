import React, { useState } from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { toggleMenu as reduxToggleMenu } from '@reducers/ui';
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import GearButton from '@components/common/GearButton';
import RequestTypeSelector from '@components/main/Desktop/RequestTypeSelector';

const useStyles = makeStyles(theme => ({
  card: {
    width: 325,
    backgroundColor: theme.palette.primary.main,
    position: 'absolute',
    left: 35,
    top: 75,
    borderRadius: theme.borderRadius.md,
    zIndex: 2000,
  },
  header: {
    color: theme.palette.text.cyan,
    padding: theme.gaps.xs,
    paddingRight: 0,
  },
  headerAction: {
    margin: 'auto',
  },
  headerTitle: {
    marginLeft: theme.gaps.xs,
    fontSize: 20,
    fontWeight: 600,
    letterSpacing: '2px',
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
  subheader: {
    font: theme.typography.b2,
    marginBottom: '10px',
    color: theme.palette.secondary.light,
  },
}));

const FilterMenu = ({ toggleMenu }) => {
  const [expanded, setExpanded] = useState(false);
  const classes = useStyles();

  // TODO: add basic/advanced toggle switch
  return (
    <Card className={classes.card}>
      <CardHeader
        classes={{
          root: classes.header,
          action: classes.headerAction,
        }}
        title={(
          <>
            <GearButton aria-label="toggle map menu" onClick={toggleMenu} />
            <Typography className={classes.headerTitle} component="span">
              FILTERS
            </Typography>
          </>
        )}
        action={(
          <IconButton
            className={classes.button}
            aria-label="toggle filter menu"
            onClick={() => setExpanded(prevExpanded => !prevExpanded)}
            disableFocusRipple
            disableRipple
          >
            {expanded ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          </IconButton>
        )}
      />
      <Collapse in={expanded}>
        <CardContent>
          <div className={classes.subheader}>Request Types</div>
          <RequestTypeSelector />
        </CardContent>
      </Collapse>
    </Card>
  );
};

const mapDispatchToProps = dispatch => ({
  toggleMenu: () => dispatch(reduxToggleMenu()),
});

export default connect(null, mapDispatchToProps)(FilterMenu);

FilterMenu.propTypes = {
  toggleMenu: PropTypes.func.isRequired,
};
