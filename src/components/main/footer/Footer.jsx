import React from 'react';

const Footer = () => (
  <footer
    className="footer"
    style={{
      // position: 'fixed',
      bottom: '0',
      width: '100%',
    }}
  >
    <div className="content has-text-centered">
      <p>
        <strong>
          311 Data
        </strong>
        &nbsp;
        by
        &nbsp;
        <a href="https://www.hackforla.org/">
          Hack4LA
        </a>
        .
      </p>
    </div>
  </footer>
);

export default Footer;
