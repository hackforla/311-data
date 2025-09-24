import React from 'react';
import PropTypes from 'prop-types';
import {
  styled,
  Box,
  Icon,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import Close from '@assets/close.svg';
import Warning from '@assets/warning-error.svg';
import useStyles from './useStyles';

const StyledBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '30%',
  backgroundColor: '#29404F',
  padding: theme.spacing(3),
  boxShadow: theme.shadows[5],
  textAlign: 'center',
  maxWidth: '317px',
  maxHeight: '220px',
  borderRadius: '10px',
}));

function ExportFailure({ onClose }) {
  const classes = useStyles();

  return (
    <Stack direction="row">
      <StyledBox sx={{ pt: 1 }}>
        <Box>
          <IconButton
            disableRipple
            onClick={onClose}
            sx={{
              mr: '-10px', ml: 'auto', display: 'block', p: 0,
            }}
          >
            <Icon sx={{ fontSize: 12 }}>
              <img src={Close} alt="close icon" className={classes.imageIcon} />
            </Icon>
          </IconButton>
        </Box>
        <Box sx={{ mt: '-5px' }}>
          <Icon fontSize="large" sx={{ fontSize: 54 }}>
            <img src={Warning} alt="warning icon" className={classes.imageIcon} />
          </Icon>
          <Typography>
            Oops! Something
            <br />
            went wrong. Please try
            <br />
            again later.
          </Typography>
        </Box>
      </StyledBox>
    </Stack>
  );
}

export default ExportFailure;

ExportFailure.propTypes = {
  onClose: PropTypes.func.isRequired,
};
