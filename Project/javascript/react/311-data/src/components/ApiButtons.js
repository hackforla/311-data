import React from 'react';

const server = "http://localhost:5000";

class ApiButtons extends React.Component {

  handleHealthClick = () => {
    this.fetchRequest(server + "/healthcheck");
  };

  handleJsonClick = () => {
    this.fetchRequest(server + "/getjson");
  };

  handleDataframeClick = () => {
    var dataframeConfig = {data_id:"ndkd-k878"};
    fetch(server + "/dataframe", {
      method: "POST",
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataframeConfig)
    })
    .then((resp) => resp.json())
    .then(function(data) {
      console.log(data);
    })
    .catch(function(error) {
      console.log(error);
    });
  };

  fetchRequest = (url) => {
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
      console.log(data);
    })
    .catch(function(error) {
      console.log(error);
    });
  };


  render() {
    return (
      <div>
      <button onClick={this.handleHealthClick}>
        Healthcheck
      </button>
      <br/>
      <button onClick={this.handleJsonClick}>
        getjson
      </button>
      <br/>
      <button onClick={this.handleDataframeClick}>
        Dataframe
      </button>
      </div>
    );
  }
}

export default ApiButtons;
