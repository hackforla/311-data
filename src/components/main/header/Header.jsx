import React from 'react';
import hackLogo from '../../../assets/hack_for_la_logo.svg';
import my311Logo from '../../../assets/myla_311logo.jpg';

const Header = () => (
  <section className="hero">
    <div className="container hero-body">
      <div className="columns">
        <div className="column">
          <img src={hackLogo} />
        </div>
        <div className="column">
          This is a pilot project of Hack for LA
          in partnership with LA Department
          of Neighborhood Empowerment and
          Neighborhood Council Volunteers.
        </div>
        <div className="column">
          <p className="title">
            BETA
          </p>
        </div>
        <div className="column">
          <img src={my311Logo} width="140" height="140" />
        </div>
      </div>
    </div>
  </section>
);

export default Header;
