import React from 'react';
import { canvasToImage, elementToImage } from './utils';

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
    // get images of the DOM elements represented by the given CSS selectors
    // within the given component. The accepted options are backgroundColor,
    // which add a backgroundColor to the images, and scale, which scales
    // the images.
    snap: ({ component, selectors, options }) => (
      renderer.snap(components[component], selectors, options)
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

  snap = async (Content, selectors = [], options) => {
    this.setState({ Content });

    const snapshots = await Promise.all(selectors.map(selector => {
      const targetEl = this.ref.current.querySelector(selector);
      return targetEl instanceof HTMLCanvasElement
        ? canvasToImage(targetEl, options)
        : elementToImage(targetEl, options);
    }));

    this.setState({ Content: null });

    return snapshots;
  };

  render() {
    const { Content } = this.state;

    if (!Content) return null;

    return (
      <div ref={this.ref} className="snapshot-renderer">
        <Content />
      </div>
    );
  }
}
