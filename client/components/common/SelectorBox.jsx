import React, { useState, useContext } from "react";
import PropTypes from "proptypes";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CollapseMUI from "@material-ui/core/Collapse";

const Context = React.createContext({ expanded: false });

const SelectorBox = ({
  onToggle,
  children,
  expanded: initial,
}) => {
  const [expanded, setExpanded] = useState(initial);

  const toggleCollapse = () => {
    onToggle && onToggle();
    setExpanded((prevState) => !prevState);
  };

  const renderCollapse = () => {
    const element = children.find((child) => child.type.name === "Collapse");
    return element;
  };
  
  return (
    <Context.Provider value={{ expanded }}>
      <Card>
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

SelectorBox.Collapse = Collapse;

function Collapse({ children }) {
  const { expanded } = useContext(Context);

  return (
    <CollapseMUI in={expanded}>
      <CardContent >{children}</CardContent>
    </CollapseMUI>
  );
}

export default SelectorBox;
