import { makeStyles, createStyles } from '@material-ui/core/styles';

// Define standard layout spacing and export as makeStyles hook.
const sharedLayout = makeStyles(theme => createStyles({
  // Top margins
  marginTopLarge: {
    marginTop: theme.spacing(5),
  },
  marginTopMedium: {
    marginTop: theme.spacing(3),
  },
  marginTopSmall: {
    marginTop: theme.spacing(1),
  },

  // Bottom margins
  marginBottomLarge: {
    marginBottom: theme.spacing(5),
  },
  marginBottomMedium: {
    marginBottom: theme.spacing(3),
  },
  marginBottomSmall: {
    marginBottom: theme.spacing(1),
  },
}));

export default sharedLayout;
