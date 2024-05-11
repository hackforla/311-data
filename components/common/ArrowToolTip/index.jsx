import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import React from 'react';

const ArrowToolTip = ({iconStyle, children}) => {

  const StyledToolTip = styled(({ className }) => (
    <Tooltip
      placement="top-end"
      arrow
      classes={{ popper: className }}
      title={(children)}
    >
      <InfoOutlinedIcon
        className={iconStyle}
        fontSize="inherit"
      />
    </Tooltip>
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      '&::before': {
        backgroundColor: theme.palette.common.white,
      },
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black,
      marginLeft: '-4px',
      maxWidth: '275px',
      padding: '5px',
      boxShadow: `
        0 4px 4px 0 rgba(0, 0, 0, 0.25), 
        0 8px 10px 0 rgba(0, 0, 0, 0.14), 
        0 3px 14px 0 rgba(0, 0, 0, 0.12)
      `,
    },
  }));

  return <StyledToolTip/>;
};

export default ArrowToolTip;
ArrowToolTip.propTypes = {
  children: PropTypes.node.isRequired,
}