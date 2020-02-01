import React, { useState } from 'react';
import Sidebar from 'react-sidebar';
import { connect } from 'react-redux';

const Menu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <>
      <Sidebar
        open={isSidebarOpen}
        sidebar={
          <div>
            THIS IS A TEST
            <button
              type="button"
              className="button is-primary"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              Show quickview
            </button>
          </div>
        }
        styles={{ sidebar: { background: 'white' } }}
      />
    </>
  );
};

// const mapStateToProps = state => ({});

export default connect(null, null)(Menu);
