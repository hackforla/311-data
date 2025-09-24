import React, { useState } from 'react';
import PropTypes from 'proptypes';
import { IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';

const useStyles = makeStyles(theme => ({
  gearIcon: {
    color: theme.palette.text.dark,
    background: '#29404F',
    borderRadius: '12px',
    height: '33px',
    width: '33px',
    padding: '6px',
  },
  button: {
    padding: '0',
  },
}));

function GearButton({
  onClick,
}) {
  const { gearIcon, button } = useStyles();
  const [pressed, setPressed] = useState(false);

  const onKeyDown = e => {
    e.preventDefault();
    if (e.key === ' '
        || e.key === 'Enter'
        || e.key === 'Spacebar'
    ) {
      setPressed(!pressed);
      onClick();
    }
  };

  const toggleClick = () => {
    setPressed(!pressed);
    onClick();
  };

  return (
    <IconButton
      className={button}
      onClick={toggleClick}
      onKeyDown={onKeyDown}
      role="button"
      aria-pressed={pressed}
      aria-label="Toggle Sidebar"
      disableFocusRipple
      disableRipple
      size="large"
    >
      <SettingsSharpIcon className={gearIcon} />
    </IconButton>
  );
}

GearButton.propTypes = {
  onClick: PropTypes.func,
};
GearButton.defaultProps = {
  onClick: undefined,
};

export default GearButton;
