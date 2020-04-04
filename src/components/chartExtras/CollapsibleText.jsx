import React, { useState } from 'react';
import PropTypes from 'proptypes';
import Button from '@components/common/Button';

const CollapsibleText = ({
  items,
  buttonId,
  delimiter,
  maxToShow,
}) => {
  const [showAll, setShowAll] = useState(false);

  const shownItems = showAll ? items : items.slice(0, maxToShow);
  const itemsText = shownItems.join(delimiter);

  return (
    <>
      <span>{ itemsText }</span>
      { items.length > maxToShow && (
        <span>
          <span>{ showAll ? '' : '...' }</span>
          <Button
            id={buttonId}
            label={showAll ? '(show less)' : '(show more)'}
            handleClick={() => setShowAll(!showAll)}
          />
        </span>
      )}
    </>
  );
};

export default CollapsibleText;

CollapsibleText.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  buttonId: PropTypes.string.isRequired,
  delimiter: PropTypes.string,
  maxToShow: PropTypes.number,
};

CollapsibleText.defaultProps = {
  delimiter: '; ',
  maxToShow: undefined,
};
