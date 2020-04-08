/* eslint-disable react/no-array-index-key */

import React from 'react';
import PropTypes from 'proptypes';
import {
  Document,
  Page,
  Image,
  View,
  Text,
  pdf,
} from '@react-pdf/renderer';
import COLORS from '@styles/COLORS';

const styles = {
  page: {
    flexDirection: 'column',
    backgroundColor: COLORS.BACKGROUND,
    paddingVertical: 40,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  image: {
    width: '100%',
  },
  pageNumbers: {
    fontSize: 10,
    color: COLORS.BRAND.MAIN,
    marginBottom: 15,
  },
};

const PdfTemplate = ({
  images,
  title,
}) => (
  <Document title={title}>
    { images.map((image, idx) => (
      <Page key={idx} size="A4" style={styles.page}>
        <View style={styles.content}>
          <Image
            key={idx}
            src={image}
            style={styles.image}
          />
        </View>
        { images.length > 1 && (
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

PdfTemplate.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string,
};

PdfTemplate.defaultProps = {
  title: undefined,
};

export default function imageToPdf({ images, title }) {
  return pdf(
    <PdfTemplate
      images={images}
      title={title}
    />,
  ).toBlob();
}
