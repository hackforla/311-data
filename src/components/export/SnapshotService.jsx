import React from 'react';
import { elementToBlob, canvasToBlob } from './utils';

/* ////////////// SERVICE //////////////// */

const SnapshotService = (() => {
  let renderer = null;
  let components = {};

  return {
    init: _renderer => {
      renderer = _renderer;
    },
    register: _components => {
      components = {
        ...components,
        ..._components,
      };
    },
    snap: ({ component, selectors, options }) => (
      renderer.snap(components[component], selectors, options)
    ),
  };
})();

export default SnapshotService;

/* /////////////// RENDERER /////////////// */

export class SnapshotRenderer extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();
    this.state = {
      Content: null,
    };
    SnapshotService.init(this);
  }

  snap = async (Content, selectors = [], options) => {
    this.setState({ Content });

    const snapshots = await Promise.all(selectors.map(selector => {
      const targetEl = this.ref.current.querySelector(selector);
      return targetEl instanceof HTMLCanvasElement
        ? canvasToBlob(targetEl, options)
        : elementToBlob(targetEl, options);
    }));

    this.setState({ Content: null });

    return snapshots;
  };

  render() {
    const { Content } = this.state;

    if (!Content) return null;

    return (
      <div ref={this.ref} className="export-renderer">
        <Content />
      </div>
    );
  }
}
