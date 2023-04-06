// Component based on components/common/SelectorBox that connects to redux store
// and toggles open and closed based on state.ui.boundaries.isOpen state variable
import React, { useContext, useEffect } from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { toggleBoundaries, showBoundaries, closeBoundaries } from '@reducers/ui';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Box from '@material-ui/core/Box';
import CollapseMUI from '@material-ui/core/Collapse';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: theme.palette.primary.main,
    boxShadow: 'none',
  },
  header: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.text.primary,
    padding: theme.gaps.xs,
    paddingLeft: theme.gaps.sm,
    marginBottom: 2,
    borderRadius: theme.borderRadius.sm,
  },
  content: {
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.palette.primary.dark,
    padding: theme.gaps.sm,
  },
  headerAction: {
    margin: 'auto',
  },
  button: {
    padding: '0 0 0 5px',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    '& svg': {
      fontSize: 30,
      paddingRight: 0,
      '&  path': {
        fill: theme.palette.primary.focus,
      },
    },
  },
}));

const Context = React.createContext({ isOpen: false });

const BoundariesSection = ({
  onToggle,
  children,
  expanded: initial,
  arrowHidden,
  isOpen,
  dispatchToggleBoundaries,
  dispatchShowBoundaries,
  dispatchCloseBoundaries,
}) => {
  const classes = useStyles();

  useEffect(() => {
    if (!!initial === false) {
      dispatchCloseBoundaries();
    } else {
      dispatchShowBoundaries();
    }
  }, [dispatchCloseBoundaries, dispatchShowBoundaries, initial]);

  const toggleCollapse = () => {
    if (onToggle) onToggle();
    dispatchToggleBoundaries();
  };

  const renderDisplay = () => {
    const element = children.find(child => child.type.displayName === 'Display');

    return (
      <CardHeader
        disableTypography
        classes={{
          root: classes.header,
          action: classes.headerAction,
        }}
        title={element}
        action={
          !arrowHidden ? (
            <IconButton
              id="boundaries"
              className={classes.button}
              aria-label="toggle filter menu"
              onClick={toggleCollapse}
              disableFocusRipple
              disableRipple
            >
              {/* {expanded ? ( */}
              {isOpen ? (
                <ArrowDropUpIcon className={classes.button} />
              ) : (
                <ArrowDropDownIcon className={classes.button} />
              )}
            </IconButton>
          ) : null
        }
      />
    );
  };

  const renderCollapse = () => {
    const element = children.find(child => child.type.displayName === 'Collapse');
    return element;
  };

  return (
    <Context.Provider value={{ isOpen, classes }}>
      <Card className={classes.card}>
        {renderDisplay()}
        {renderCollapse()}
      </Card>
    </Context.Provider>
  );
};

BoundariesSection.propTypes = {
  onToggle: PropTypes.func,
  expanded: PropTypes.bool,
  isOpen: PropTypes.bool,
  arrowHidden: PropTypes.bool,
  children: PropTypes.node,
  dispatchToggleBoundaries: PropTypes.func,
  dispatchShowBoundaries: PropTypes.func,
  dispatchCloseBoundaries: PropTypes.func,
};

BoundariesSection.defaultProps = {
  onToggle: undefined,
  arrowHidden: false,
  expanded: false,
  isOpen: false,
  children: null,
  dispatchToggleBoundaries: undefined,
  dispatchShowBoundaries: undefined,
  dispatchCloseBoundaries: undefined,
};

function Display({ children }) {
  return <div>{children}</div>;
}

Display.displayName = 'Display';
Display.propTypes = {
  children: PropTypes.node,
};

Display.defaultProps = {
  children: null,
};

function Collapse({ children }) {
  const { isOpen, classes } = useContext(Context);

  return (
    <CollapseMUI in={isOpen}>
      <Box className={classes.content}>{children}</Box>
    </CollapseMUI>
  );
}

Collapse.displayName = 'Collapse';
Collapse.propTypes = {
  children: PropTypes.node,
};

Collapse.defaultProps = {
  children: null,
};

BoundariesSection.Display = Display;
BoundariesSection.Collapse = Collapse;

const mapStateToProps = state => ({
  isOpen: state.ui.boundaries.isOpen,
});

const mapDispatchToProps = dispatch => ({
  dispatchToggleBoundaries: () => dispatch(toggleBoundaries()),
  dispatchShowBoundaries: () => dispatch(showBoundaries()),
  dispatchCloseBoundaries: () => dispatch(closeBoundaries()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BoundariesSection);
