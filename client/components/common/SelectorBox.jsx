import React, { useState, useContext, useEffect } from 'react';
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

const Context = React.createContext({ expanded: false });

const SelectorBox = ({
  onToggle,
  children,
  expanded: initial,
  arrowHidden,
}) => {
  const [expanded, setExpanded] = useState(initial);
  const classes = useStyles();

  useEffect(() => {
    setExpanded(initial);
  }, [initial]);

  const toggleCollapse = () => {
    if (onToggle) onToggle();
    setExpanded(prevState => !prevState);
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
    const element = children.find(child => child.type.displayName === 'Collapse');
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

Display.displayName = 'Display';
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

Collapse.displayName = 'Collapse';
Collapse.propTypes = {
  children: PropTypes.node,
};

Collapse.defaultProps = {
  children: null,
};

SelectorBox.Display = Display;
SelectorBox.Collapse = Collapse;

export default SelectorBox;
