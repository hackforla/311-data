import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'proptypes';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import CollapseMUI from '@mui/material/Collapse';
import makeStyles from '@mui/styles/makeStyles';

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
  },
}));

const Context = React.createContext({ expanded: false });

function SelectorBox({
  onToggle,
  children,
  expanded: initial,
  arrowHidden,
}) {
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
              size="large"
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
}

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
