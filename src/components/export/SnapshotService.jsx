/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */

import React from 'react';
import Criteria from '@components/chartExtras/Criteria';
import Legend from '@components/chartExtras/Legend';
import ComparisonCriteria from '@components/chartExtras/ComparisonCriteria';
import ComparisonLegend from '@components/chartExtras/ComparisonLegend';
import { elementToImage } from './utils';

/* ////////////////// TEMPLATES ///////////////// */

const templates = {
  ChartImage: ({ children }) => (
    <div className="export-template chart-image">
      { children }
    </div>
  ),
  VisPage: ({ children }) => (
    <div className="export-template">
      <Criteria />
      <Legend />
      { children }
    </div>
  ),
  VisPageNoLegend: ({ children }) => (
    <div className="export-template">
      <Criteria />
      { children }
    </div>
  ),
  ComparisonPage: ({ children }) => (
    <div className="export-template">
      <ComparisonCriteria />
      <ComparisonLegend />
      { children }
    </div>
  ),
  ComparisonPageNoLegend: ({ children }) => (
    <div className="export-template">
      <ComparisonCriteria />
      { children }
    </div>
  ),
};

/* /////////////////// SERVICE /////////////////// */
/*
  This service converts DOM elements into images so they can
  be exported (or injected into PDFs and then exported). The `link`
  and `register` methods set up the service, and the `snap` method
  does the actual work.
*/
const SnapshotService = (() => {
  let renderer = null;
  let components = {};

  return {
    // connect the renderer (below)
    link: _renderer => {
      renderer = _renderer;
    },
    // save components you need to take snapshots of
    register: _components => {
      components = {
        ...components,
        ..._components,
      };
    },
    snap: ({ componentName, templateName, options }) => (
      renderer.snap({
        Component: components[componentName],
        Template: templates[templateName],
        options,
      })
    ),
  };
})();

export default SnapshotService;

/* /////////////////// RENDERER /////////////////// */
/*
  The renderer supports the service by rendering arbitrary content
  in an off-screen div. The `snap` method runs through a list of
  selectors and takes a snapshot of each corresponding DOM element.
*/
export class SnapshotRenderer extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();
    this.state = { Content: null };
    SnapshotService.link(this);
  }

  snap = async ({ Component, Template, options = {} }) => {
    const Content = (() => {
      if (Component && Template) {
        return (
          <Template>
            <Component />
          </Template>
        );
      }
      if (Component) return <Component />;
      if (Template) return <Template />;
      return null;
    })();

    this.setState({ Content });
    const snapshot = await elementToImage(this.ref.current, options);
    this.setState({ Content: null });
    return snapshot;
  }

  render() {
    const { Content } = this.state;

    if (!Content) return null;

    return (
      <div ref={this.ref} className="snapshot-renderer">
        { Content }
      </div>
    );
  }
}
