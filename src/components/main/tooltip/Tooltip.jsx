import React from 'react';
import ReactTooltip from 'react-tooltip';
import Icon from '../../common/Icon';

const Tooltip = () => (
  <div className="tooltip">
    <ReactTooltip
      id="react-tooltip"
      effect="solid"
      getContent={data => {
        if (!data) return null;
        let { text, title } = JSON.parse(data);
        if (!text && !title) return null;

        return (
          <div className="tooltip-content">
            { title &&
              <div className="has-text-weight-bold is-size-6">
                <Icon
                  id="react-tooltip-icon"
                  icon="info-circle"
                  size="small"
                  style={{ marginRight: '6px' }}
                />
                { title }
              </div>
            }
            { text &&
              <div className="tooltip-text is-size-6">
                { text }
              </div>
            }
          </div>
        );
      }}
    />
  </div>
);

export default Tooltip;
