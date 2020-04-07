import React, { useState } from 'react';
import PropTypes from 'proptypes';
import Button from '@components/common/Button';

const CollapsibleList = ({
  items,
  buttonId,
  delimiter,
  maxShown,
  ifEmpty,
}) => {
  const [showAll, setShowAll] = useState(false);

  const shownItems = showAll ? items : items.slice(0, maxShown);
  const itemsText = shownItems.length > 0
    ? shownItems.join(delimiter)
    : ifEmpty;

  return (
    <>
      <span>{ itemsText }</span>
      { items.length > maxShown && (
        <span>
          <span>{ showAll ? '' : '...' }</span>
          <Button
            id={buttonId}
            className="show-more-toggle-btn"
            label={showAll ? '(show less)' : '(show more)'}
            handleClick={() => setShowAll(!showAll)}
          />
        </span>
      )}
    </>
  );
};

export default CollapsibleList;

CollapsibleList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  buttonId: PropTypes.string.isRequired,
  delimiter: PropTypes.string,
  maxShown: PropTypes.number,
  ifEmpty: PropTypes.string,
};

CollapsibleList.defaultProps = {
  delimiter: '; ',
  maxShown: Infinity,
  ifEmpty: null,
};
