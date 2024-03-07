import { makeStyles, createStyles } from '@material-ui/core/styles';
import fonts from '@theme/fonts';

// Define common styles as makeStyles hook.
const sharedStyles = makeStyles(theme => createStyles({
  // Desktop Menu
  headerTitle: {
    ...theme.typography.h5,
    fontFamily: fonts.family.oswald,
    fontWeight: fonts.weight.semiBold,
    letterSpacing: '2px',
    color: theme.palette.text.cyan,
  },
}));

export default sharedStyles;
