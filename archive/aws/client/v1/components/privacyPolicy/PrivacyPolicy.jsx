import React from 'react';

const PrivacyPolicy = () => (
  <div className="privacy-policy-container">
    <h1 className="title has-text-centered is-size-1">Privacy policy</h1>
    <h3 className="has-text-centered">
      We respect your privacy, and recognize that we must maintain and use your information
      responsibly.
    </h3>

    {/* ---------- LEDE ---------- */}

    <section className="section lede">
      <p>
        {`311-data.org is a nonprofit website run by Hack for LA which is a brigade of Code for America Labs, Inc.
        ("Code for America", "we", "us", "our"). This Privacy Policy describes how we collect, use, and protect your
        personal information on our websites (Sites), including the `}
        <a href="https://311-data.org">311-Data Project Website</a>
        &nbsp;(&quot;311-data.org&quot;), and our&nbsp;
        <a href="https://hackforla.github.io/311-report">311 Report Generator Website</a>
        {` ("https://hackforla.github.io/311-report/") By submitting your personal information on our websites, you agree 
        to the terms in this Privacy Policy. If you do not agree with these terms, please do not use our websites.`}
      </p>
    </section>

    {/* ---------- OVERVIEW ---------- */}

    <section className="section overview ">
      <h2 className="has-text-left">Overview</h2>
      <ul className="list-bullets">
        <li>
          {`We collect information from you when you visit and take actions on our website. We use this information to provide
          the services you've requested.`}
        </li>
        <li>
          We use cookies (such as those stored by Google Analytics) to provide a better
          experience and improve our website.
        </li>
        <li>
          We will not knowingly disclose or sell your personal information to any third
          party, except as provided in this privacy policy.
        </li>
        <li>
          Protecting your personal information is extremely important to us and we take all
          reasonable measures to do so.
        </li>
      </ul>
    </section>

    {/* ---------- PERSONAL INFORMATION WE COLLECT ---------- */}

    <section className="section personal-information-we-collect">
      <h2 className="has-text-left">The personal information we collect</h2>
      <h3 className="has-text-weight-semibold">Visiting 311-data.org</h3>
      <ul>
        <li>
          We automatically collect and store data about your visit to 311-data.org:
          <ul className="sub-list">
            <li>
              Domain from which you access the Internet
            </li>
            <li>
              Operating system on your computer and information about the browser you used
              when visiting the site
            </li>
            <li>
              Date and time of your visit
            </li>
            <li>
              Pages you visited
            </li>
            <li>
              Address of the website that connects you to the Site
              (such as google.com or bing.com)
            </li>
            <li>
              The queries you make on our site. (E.G. last 6 months of data for bulky items)
            </li>
          </ul>
        </li>
        <li>
          None of the information we collect about you when you visit 311-data.org is personally
          identifiable unless you submit your contact information in the form on the Contact Us
          submit page.
        </li>
        <li>
          We use this non personally identifiable information to understand how the 311-data.org
          website is used, to improve the website, and to monitor usage for security purposes.
        </li>
        <li>
          We will not collect personal information from you without your knowledge and consent,
          except in a few limited circumstances as described in this policy.
        </li>
      </ul>

      <h3 className="has-text-weight-semibold">Filling in Webforms such as Contact Us</h3>
      <ul>
        <li>
          We use github to process requests from our contact us page.
        </li>
        <li>
          When you submit the contact us form, your personal data will be transferred to github
          and a ticket is created so someone from our team can get back to you.
        </li>
        <li>
          The personal data we collect when you sign up to our mailing list includes:
          <ul className="sub-list">
            <li>
              Your name
            </li>
            <li>
              Your email address
            </li>
            <li>
              Domain from which you access the Internet
            </li>
            <li>
              IP address
            </li>
            <li>
              Operating system on your computer and information about the browser you used when
              visiting the site
            </li>
            <li>
              Date and time when you submit the form
            </li>
            <li>
              Address of the page on our website, or the third-party website that connected you
              to sign-up form
            </li>
          </ul>
        </li>
        <li>
          {`We use the collected email addresses of our contact us form to respond to people's requests. 
          If you are interested in additional information about Hack for LA or Code for America, feel free to reach out.`}
        </li>
        <li>
          We use the personal data we collect to understand how people ask us questions and to
          improve the experience of doing so.
        </li>
      </ul>

      <h3 className="has-text-weight-semibold">Google Analytics</h3>
      <ul>
        <li>
          We use Google Analytics to understand how visitors use our site and to gather aggregate
          performance metrics.
        </li>
        <li>
          We’ve set up Google Analytics so that it doesn’t collect your full IP address.
        </li>
        <li>
          {`We don’t collect any personally identifiable information using Google Analytics, and we do not combine the information
          collected through Google Analytics with any personally identifiable information.`}
        </li>
        <li>
          {`Google Analytics places a cookie on your web browser to identify you as a unique user. This cookie cannot be used by anyone but Google.
          Google's ability to use and share information collected by Google Analytics about your visits to this site is restricted by the `}
          <a href="http://www.google.com/analytics/terms/us.html">Google Analytics Terms of Use</a>
          &nbsp;and the&nbsp;
          <a href="http://www.google.com/policies/privacy/">Google Privacy Policy</a>
          .
        </li>
      </ul>
    </section>

    {/* ---------- COOKIES AND OTHER TRACKING TECHNOLOGIES ---------- */}

    <section className="section cookies-and-other-tracking-technologies">
      <h2 className="has-text-left">Cookies and other tracking technologies</h2>
      <ul>
        <li>
          Cookies are small text files that websites place on the computers and mobile devices of
          people who visit those websites. Pixel tags (also called web beacons) are small blocks of
          code placed on websites and emails.
        </li>
        <li>
          We use cookies and other technologies like pixel tags to remember your preferences,
          enhance your online experience, and to gather data on how you use our Sites to improve
          the way we promote our content, programs, and events.
        </li>
        <li>
          Your use of our Sites indicates your consent to such use of Cookies.
        </li>
      </ul>

      <h3 className="has-text-weight-semibold">Third party service providers</h3>
      <p>
        We use third-party service providers to track and analyze statistical usage and volume
        information from our Site users. These third-party service providers use persistent
        Cookies to help us to improve the user experience, manage the content on our Sites, and
        analyze how users navigate and use the Sites.
      </p>
      <p>
        Third-party service providers we use include&nbsp;
        <a href="https://analytics.google.com/">Google Analytics</a>
        {', '}
        <a href="https://mixpanel.com/">Mixpanel</a>
        {', '}
        <a href="https://www.hotjar.com/">Hotjar</a>
        {', '}
        <a href="https://www.eventbrite.com/">Eventbrite</a>
        {', '}
        <a href="https://donorbox.org/">Donorbox</a>
        {', '}
        <a href="https://medium.com/">Medium</a>
        {', '}
        <a href="https://twitter.com/?lang=en">Twitter</a>
        {', '}
        <a href="https://www.facebook.com/">Facebook</a>
        {', '}
        <a href="https://www.linkedin.com/">LinkedIn</a>
        .
      </p>

      <h3 className="has-text-weight-semibold">How to opt-out of the use of cookies</h3>
      <p>
        Most browsers are initially set up to accept HTTP cookies. If you want to restrict or
        block the cookies that are set by our Site, or any other site, you can do so through your
        browser setting. The ‘Help’ function in your browser should explain how.
        Alternatively, you can visit&nbsp;
        <a href="http://www.aboutcookies.org">www.aboutcookies.org</a>
        {', '}
        which contains comprehensive information on how to do this on a wide variety of browsers.
        You will find general information about cookies and details on how to delete cookies from
        your machine.
      </p>
    </section>

    {/* ---------- AS REQUIRED BY LAW AND SIMILAR DISCLOSURES ---------- */}

    <section className="section as-required-by-law">
      <h2 className="has-text-left">As required by law and similar disclosures</h2>
      <ul>
        <li>
          We may access, preserve, and disclose your information if we believe doing so is required
          or appropriate to:
          <ul className="sub-list">
            <li>
              comply with law enforcement requests and legal process, such as a court order or
              subpoena;
            </li>
            <li>
              respond to your requests; or
            </li>
            <li>
              protect your, our, or others’ rights, property, or safety.
            </li>
          </ul>
        </li>
        <li>
          For the avoidance of doubt, the disclosure of your information may occur if you post any
          objectionable content on or through the Site.
        </li>
      </ul>
    </section>

    {/* ---------- MERGER, SALE, OR OTHER ASSET TRANSFERS ---------- */}

    <section className="section merger-sale-asset-transfers">
      <h2 className="has-text-left">Merger, sale, or other asset transfers</h2>
      <ul>
        <li>
          We may transfer your information to service providers, advisors, potential transactional
          partners, or other third parties in connection with the consideration, negotiation, or
          completion of a corporate transaction in which we are acquired by or merged with another
          company or we sell, liquidate, or transfer all or a portion of our assets. The use of your
          information following any of these events will be governed by the provisions of this
          Privacy Policy in effect at the time the applicable information was collected.
        </li>
      </ul>
    </section>

    {/* ---------- CONSENT ---------- */}

    <section className="section consent">
      <h2 className="has-text-left">Consent</h2>
      <ul>
        <li>
          We may also disclose information from you or about you or your devices with your
          permission.
        </li>
      </ul>
    </section>

    {/* ---------- CHILDREN'S PRIVACY ---------- */}

    <section className="section childrens-privacy">
      <h2 className="has-text-left">Children’s privacy</h2>
      <ul>
        <li>
          We do not knowingly collect, maintain, or use personal information from children under
          13 years of age, and no part of our Site is directed to children.
        </li>
        <li>
          If you learn that a child has provided us with personal information in violation of this
          Privacy Policy, then you may alert us at&nbsp;
          <a href="mailto:info@codeforamerica.org">info@codeforamerica.org</a>
          .
        </li>
      </ul>
    </section>

    {/* ---------- SECURITY ---------- */}

    <section className="section security">
      <h2 className="has-text-left">Security</h2>
      <ul>
        <li>
          We make reasonable efforts to protect your information by using physical and electronic
          safeguards designed to improve the security of the information we maintain. However, as
          our Services are hosted electronically, we can make no guarantees as to the security or
          privacy of your information.
        </li>
      </ul>
    </section>

    {/* ---------- RIGHT TO BE FORGOTTEN AND RECTIFICATION ---------- */}

    <section className="section right-to-be-forgotten">
      <h2 className="has-text-left">Right to be forgotten and rectification</h2>
      <ul>
        <li>
          You may request that we delete your personal data at any time. Requests can
          be submitted to&nbsp;
          <a href="mailto:privacy@codeforamerica.org">privacy@codeforamerica.org</a>
          .
        </li>
        <li>
          You may request that we make corrections to your personal data at any time. You may
          request that incomplete data be completed or that incorrect data be corrected. Requests
          can be submitted to&nbsp;
          <a href="mailto:privacy@codeforamerica.org">privacy@codeforamerica.org</a>
          .
        </li>
      </ul>
    </section>

    {/* ---------- CHANGES ---------- */}

    <section className="section changes">
      <h2 className="has-text-left">Changes</h2>
      <p>
        We may change this Privacy Policy from time to time. Please check this page frequently for
        updates as your continued use of this site after any changes in this Privacy Policy will
        constitute your acceptance of the changes.
      </p>
    </section>

    {/* ---------- EFFECTIVE DATE ---------- */}

    <section className="section effective-date">
      <h2 className="has-text-left">Effective Date</h2>
      <p>
        This version of the policy is effective&nbsp;
        <strong>July 29, 2019</strong>
        .
      </p>
    </section>

    {/* ---------- QUESTIONS ---------- */}

    <section className="section questions">
      <h2 className="has-text-left">Questions</h2>
      <p>
        If you have any questions, comments, concerns, or complaints related to our websites, please
        contact us by email at&nbsp;
        <a href="mailto:311-data@hackforla.org">311-data@hackforla.org</a>
        , by phone at&nbsp;
        <a href="tel:4158161286">(415) 816-1286</a>
        , or by mail at:
        <br />
        <br />
        Hack for LA
        <br />
        155 9th Street
        <br />
        San Francisco, CA 94103
        <br />
        <br />
        We will do our best to resolve the issue.
      </p>
    </section>
  </div>
);

export default PrivacyPolicy;
