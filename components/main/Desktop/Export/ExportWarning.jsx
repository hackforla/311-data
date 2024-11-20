import React from 'react';
import PropTypes from 'prop-types';
import {
  styled,
  Box,
  Button,
  Icon,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import Close from '@assets/close.svg';
import InfoAlert from '@assets/yellow_tips.svg';
import useStyles from './useStyles';

const StyledBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '30%',
  left: '45%',
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(4),
  boxShadow: theme.shadows[5],
  textAlign: 'center',
  maxWidth: '280px',
  maxHeight: '418px',
  borderRadius: '8px',
  whiteSpace: 'pre-wrap',
}));

function ExportWarning({ onClose, errorType }) {
  const classes = useStyles();

  return (
    <Stack direction="row">
      <StyledBox sx={{ pt: '2px' }}>
        <Box>
          <IconButton
            disableRipple
            onClick={onClose}
            sx={{ mr: '-25px', ml: 'auto', display: 'block' }}
          >
            <Icon sx={{ fontSize: 16 }}>
              <img src={Close} alt="close icon" className={classes.imageIcon} />
            </Icon>
          </IconButton>
        </Box>
        <Box sx={{ mt: '-15px' }}>
          <Icon sx={{ fontSize: 44 }}>
            <img src={InfoAlert} alt="info alert tooltip" className={classes.imageIcon} />
          </Icon>
          <Typography>
            {errorType}
          </Typography>
          <Button onClick={onClose} className={classes.warningButton}>
            OK
          </Button>
        </Box>
      </StyledBox>
    </Stack>
  );
}

export default ExportWarning;

ExportWarning.propTypes = {
  onClose: PropTypes.func.isRequired,
  errorType: PropTypes.string,
};

ExportWarning.defaultProps = {
  errorType: undefined,
};
