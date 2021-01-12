import React, { useState, useContext } from "react";
import PropTypes from "proptypes";

import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import IconButton from "@material-ui/core/IconButton";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CollapseMUI from "@material-ui/core/Collapse";

const Context = React.createContext({ expanded: false });

const SelectorBox = ({
  onToggle,
  children,
  expanded: initial,
  arrowHidden,
}) => {
  const [expanded, setExpanded] = useState(initial);

  const toggleCollapse = () => {
    onToggle && onToggle();
    setExpanded((prevState) => !prevState);
  };
  const renderDisplay = () => {
    const element = children.find((child) => child.type.name === "Display");
    return (
      <CardHeader
        disableTypography
        classes={{
          root: classes.header,
          action: classes.headerAction,
        }}
        title={element}
        {...(!arrowHidden
          ? {
              action: (
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
              ),
            }
          : {})}
      />
    );
  };
  const renderCollapse = () => {
    const element = children.find((child) => child.type.name === "Collapse");
    return element;
  };
  return (
    <Context.Provider value={{ expanded }}>
      <Card >
        {renderDisplay()}
        {renderCollapse()}
      </Card>
    </Context.Provider>
  );
};

SelectorBox.propTypes = {
  onToggle: PropTypes.func,
  expanded: PropTypes.bool,
};
SelectorBox.defaultProps = {
  onToggle: undefined,
  expanded: false,
};

SelectorBox.Display = Display;
SelectorBox.Collapse = Collapse;

function Display({ children }) {
  return <div>{children}</div>;
}

function Collapse({ children }) {
  const { expanded } = useContext(Context);

  return (
    <CollapseMUI in={expanded}>
      <CardContent >{children}</CardContent>
    </CollapseMUI>
  );
}

export default SelectorBox;
