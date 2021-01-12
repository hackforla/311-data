import React, { useState } from "react";
import Card from "@material-ui/core/Card";

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

  return (
    <Context.Provider value={{ expanded }}>
      <Card >
       {children}
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

export default SelectorBox;
