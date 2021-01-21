import React, { useState, useContext } from 'react';
import PropTypes from 'proptypes';

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
    padding: 5,
    paddingLeft: 10,
    fontSize: '1rem',
    marginBottom: 2,
    borderRadius: 5,
  },
  content: {
    borderRadius: 5,
    backgroundColor: theme.palette.primary.dark,
    padding: '10px 10px',
  },
  headerAction: {
    margin: 'auto',
  },
  headerTitle: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 600,
    letterSpacing: '2px',
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

const Context = React.createContext({ expanded: false });

const SelectorBox = ({
  onToggle,
  children,
  expanded: initial,
  arrowHidden,
}) => {
  const [expanded, setExpanded] = useState(initial);
  const classes = useStyles();

  const toggleCollapse = () => {
    if (onToggle) onToggle();
    setExpanded(prevState => !prevState);
  };
  const renderDisplay = () => {
    const element = children.find(child => child.type.name === 'Display');
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
              className={classes.button}
              aria-label="toggle filter menu"
              onClick={toggleCollapse}
              disableFocusRipple
              disableRipple
            >
              {expanded ? (
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
    const element = children.find(child => child.type.name === 'Collapse');
    return element;
  };
  return (
    <Context.Provider value={{ expanded, classes }}>
      <Card className={classes.card}>
        {renderDisplay()}
        {renderCollapse()}
      </Card>
    </Context.Provider>
  );
};

SelectorBox.propTypes = {
  onToggle: PropTypes.func,
  expanded: PropTypes.bool,
  arrowHidden: PropTypes.bool,
  children: PropTypes.node,
};

SelectorBox.defaultProps = {
  onToggle: undefined,
  arrowHidden: false,
  expanded: false,
  children: null,
};

function Display({ children }) {
  return <div>{children}</div>;
}

Display.propTypes = {
  children: PropTypes.node,
};

Display.defaultProps = {
  children: null,
};

function Collapse({ children }) {
  const { expanded, classes } = useContext(Context);

  return (
    <CollapseMUI in={expanded}>
      <Box className={classes.content}>{children}</Box>
    </CollapseMUI>
  );
}

Collapse.propTypes = {
  children: PropTypes.node,
};

Collapse.defaultProps = {
  children: null,
};

SelectorBox.Display = Display;
SelectorBox.Collapse = Collapse;

export default SelectorBox;
