import React from 'react';
import PropTypes from 'prop-types';
import {
  styled,
  Box,
  Icon,
  Stack,
  Typography,
} from '@mui/material';
import DownloadCircle from '@assets/download-circle.svg';
import CheckCircle from '@assets/round-check-circle.svg';
import LoadingDots from '@assets/loading dots.svg';
import useStyles from './useStyles';

const StyledBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '80px',
  backgroundColor: theme.palette.primary.main,
  boxShadow: theme.shadows[5],
  textAlign: 'center',
  maxWidth: '450px',
  maxHeight: '65px',
  borderRadius: '8px',
}));

function ExportDownload({ dialogType }) {
  const downloadingMessage = 'Data downloading';
  const downloadSuccessMessage = 'Data exported successfully!';
  const classes = useStyles();
  const { imageIcon } = classes;

  return (
    <StyledBox sx={{ px: '40px', py: '12px' }}>
      <Stack direction="row">
        {(dialogType === 'downloading') && (
          <>
            <Icon sx={{ fontSize: '20px', mr: 1, alignSelf: 'center' }}>
              <img src={DownloadCircle} alt="download circle icon" className={imageIcon} />
            </Icon>
            <Typography fontSize="16px">
              {downloadingMessage}
            </Typography>
            <Icon
              sx={{
                fontSize: '16px', mt: 'auto', pr: '16px',
              }}
            >
              <img src={LoadingDots} alt="loading dots" className={imageIcon} />
            </Icon>
          </>
        )}
        {(dialogType === 'success') && (
          <>
            <Icon sx={{ fontSize: '20px', mr: 1, alignSelf: 'center' }}>
              <img src={CheckCircle} alt="download success icon" className={imageIcon} />
            </Icon>
            <Typography fontSize="16px">
              {downloadSuccessMessage}
            </Typography>
          </>
        )}
      </Stack>
    </StyledBox>
  );
}

export default ExportDownload;

ExportDownload.propTypes = {
  dialogType: PropTypes.string.isRequired,
};
