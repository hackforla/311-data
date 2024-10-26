import * as React from 'react';
import { styled } from '@mui/material/styles';
// import Button from '@mui/material/Button';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

export default function ZoomTooltip() {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const HtmlTooltip = styled(({ className, ...props }) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#29404f',
      color: 'white',
      maxWidth: 300,
      fontSize: theme.typography.pxToRem(10),
      border: '1px solid #29404f',
    },
  }));
  return (
    <HtmlTooltip
      open={open}
      onClose={handleClose}
      onOpen={handleOpen}
      placement="top-end"
      arrow
      title={(
        <div>
          <Typography color="inherit">
            <strong>
              Zoom features are limited while locked into a
              neighborhood council.
            </strong>
            <br />
            To reset zoom features, please exit by clicking out of the
            selected area.
          </Typography>
        </div>
      )}
    >
      {/* <Button>-</Button> */}
    </HtmlTooltip>
  );
}
