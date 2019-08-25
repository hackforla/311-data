import React from 'react';
import {Treemap, DiscreteColorLegend} from 'react-vis';
import "./TreeMapVis.css"
import {getZoomedCallVolume, getBroadCallVolume} from '../Util/DataService.js';



import DataFrame from 'dataframe-js';
import { data, columns, Row } from 'dataframe-js';
// import {getBroadCallVolume} from '../Util/DataService.js';

const server = "http://localhost:5000";
class TreeMapVis extends React.Component {
  constructor(props){
    super(props);
    this.state = {dataset: {}, zoomed: false, hoveredItem: '', callVolume:''}
  }

  componentWillMount = () => {
    this.handlePopulateTreeClick();
  }

  handlePopulateTreeClick = () => {
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

  render() {
    return (
      <div className="TreeMapVis">
      <button onClick={this.handlePopulateTreeClick}>
        Populate Treemap
      </button>
      <br/>
      Item: {this.state.hoveredItem}
      <br/>
      Call Volume: {this.state.callVolume}
      <Treemap
        title={'My New Treemap'}
        animation
        colorType={'literal'}
        width={1550}
        height={800}
        onLeafClick={ x => {
            if (this.state.zoomed){
              this.setState({
                zoomed: false,
                hoveredItem: '',
                callVolume: '' })
              this.handlePopulateTreeClick()
            } else {
            this.handleNCZoom(x.data.title);
            this.setState({
              hoveredItem: '',
              callVolume: '' })
          }
          }
        }
        onLeafMouseOver={ x => {
          this.setState({hoveredItem: x.data.title, callVolume: x.data.size});
          }
        }
        data={this.state.dataset}
        />
      </div>
    );
  }
}

export default TreeMapVis;
