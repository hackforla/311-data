import React from 'react';
import {Treemap} from 'react-vis';
import Legend from './Legend.js';
import HoverInfo from './HoverInfo.js';
import Filters from './Filters.js';
import "./Styles/TreeMapVis.scss"
import {getZoomedCallVolume, getBroadCallVolume} from '../../Util/DataService.js';

class TreeMapVis extends React.Component {
  constructor(props){
    super(props);
    this.state = {targetYear: 2016,
                  startMonth:1,
                  endMonth:2,
                  width:"0",
                  height:"0",
                  dataset: {},
                  zoomed: false,
                  selectedNC:"",
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
    this.props.loadingChanged(true);
    getBroadCallVolume(this.state.targetYear,
                       this.state.startMonth,
                       this.state.endMonth,
                       (dataset) => {
                         this.props.loadingChanged(false);
                          this.setState({
                            dataset: dataset
                          });
                        });
  };

  handleNCZoom = x => {
    this.props.loadingChanged(true);
    getZoomedCallVolume(x,
                       this.state.targetYear,
                       this.state.startMonth,
                       this.state.endMonth,
                       (dataset) =>{
                         this.props.loadingChanged(false);
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
          selectedNC:'',
          hoveredItem: '',
          callVolume: '' });
        this.getBaseTree()
      } else {
        this.handleNCZoom(x.data.title);
        this.setState({
          selectedNC: x.data.title,
          hoveredItem: '',
          callVolume: '' });
      }
  };

  handleNodeHover = x => {
    this.setState({hoveredItem: x.data.title, callVolume: x.data.size});
  };

  handleYearChange = x => {
    const year = x.target.value;
    console.log(`Year changed to ${year}`);
    this.setState({targetYear: year});
    if (this.state.zoomed){
      this.handleNCZoom(this.state.selectedNC)
    } else{
      this.getBaseTree()
    }
  };

  handlerSliderChange = x => {
    console.log(x);
  }

  handleStartMonthChange = x => {
    const month = x.target.value
    console.log(`Start month changed to ${month}`);
    this.setState({startMonth: month});
    if (this.state.zoomed){
      this.handleNCZoom(this.state.selectedNC)
    } else{
      this.getBaseTree()
    }
  };

  handleEndMonthChange = x => {
    const month = x.target.value
    console.log(`End month changed to ${month}`);
    this.setState({endMonth: month});
    if (this.state.zoomed){
      this.handleNCZoom(this.state.selectedNC)
    } else{
      this.getBaseTree()
    }
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
          height={this.state.height / 2}
          onLeafClick={this.handleNodeClick}
          onLeafMouseOver={ this.handleNodeHover }
          data={this.state.dataset}/>
        <HoverInfo
          dataTitle={this.state.hoveredItem}
          dataCount={this.state.callVolume}/>
        <Legend />
        <Filters yearChange={this.handleYearChange}
                 sMonthChange={this.handleStartMonthChange}
                 eMonthChange={this.handleEndMonthChange}
                 targetYear={this.state.targetYear}
                 sMonth={this.state.startMonth}
                 eMonth={this.state.endMonth}/>
      </div>
    );
  }
}

export default TreeMapVis;
