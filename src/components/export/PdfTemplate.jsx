/* eslint-disable react/no-array-index-key */

import React from 'react';
import PropTypes from 'proptypes';
import {
  Document,
  Page,
  Image,
  View,
  Text,
} from '@react-pdf/renderer';
import COLORS from '@styles/COLORS';

const styles = {
  page: {
    flexDirection: 'column',
    backgroundColor: COLORS.BACKGROUND,
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  section: {
    width: '100%',
    marginTop: 20,
  },
  pageNumbers: {
    fontSize: 10,
    color: COLORS.BRAND.MAIN,
    marginBottom: 15,
  },
};

const PdfTemplate = ({
  pages,
  title,
}) => (
  <Document title={title}>
    { pages.map((page, idx) => (
      <Page key={idx} size="A4" style={styles.page}>
        <View style={styles.content}>
          { page.map((section, idx2) => (
            <Image
              key={idx2}
              src={section.img}
              style={[styles.section, section.style]}
            />
          ))}
        </View>
        { pages.length > 1 && (
          <Text
            fixed
            style={styles.pageNumbers}
            render={({ pageNumber, totalPages }) => (
              `Page ${pageNumber} of ${totalPages}`
            )}
          />
        )}
      </Page>
    ))}
  </Document>
);

export default PdfTemplate;

PdfTemplate.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({
    img: PropTypes.string, // an object url
    styles: PropTypes.shape({}),
  }))).isRequired,
  title: PropTypes.string,
};

PdfTemplate.defaultProps = {
  title: undefined,
};
