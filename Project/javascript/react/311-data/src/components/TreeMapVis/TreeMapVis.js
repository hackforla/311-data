import React from 'react';
import {Treemap} from 'react-vis';
import Legend from './Legend.js';
import HoverInfo from './HoverInfo.js';
import "./Styles/TreeMapVis.scss"
import {getZoomedCallVolume, getBroadCallVolume} from '../../Util/DataService.js';

class TreeMapVis extends React.Component {
  constructor(props){
    super(props);
    this.state = {width:"0",
                  height:"0",
                  dataset: {},
                  zoomed: false,
                  hoveredItem: '',
                  callVolume:''}
  }


  componentWillMount = () => {
    this.setState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    this.getBaseTree();
  }

  getBaseTree = () => {
    getBroadCallVolume((dataset) => {
      this.setState({
        dataset: dataset
      });
    });
  };

  handleNCZoom = x => {
    getZoomedCallVolume(x, (dataset) =>{
      console.log(dataset);
      this.setState({
        dataset: dataset,
        zoomed: true
      });
    });
  };

  handleNodeClick = x => {
      if (this.state.zoomed){
        this.setState({
          zoomed: false,
          hoveredItem: '',
          callVolume: '' });
        this.getBaseTree()
      } else {
        this.handleNCZoom(x.data.title);
        this.setState({
          hoveredItem: '',
          callVolume: '' });
      }
  };

  handleNodeHover = x => {
    this.setState({hoveredItem: x.data.title, callVolume: x.data.size});
  };

  render() {
    const animationProps = {
      damping: 9,
      stiffness: 300
    }

    return (
      <div className="TreeMapVis">
        <Treemap
          title={'My New Treemap'}
          animation={animationProps}
          colorType={'literal'}
          width={this.state.width}
          height={800}
          onLeafClick={this.handleNodeClick}
          onLeafMouseOver={ this.handleNodeHover }
          data={this.state.dataset}/>
        <HoverInfo
          dataTitle={this.state.hoveredItem}
          dataCount={this.state.callVolume}/>
        <Legend />
      </div>
    );
  }
}

export default TreeMapVis;
