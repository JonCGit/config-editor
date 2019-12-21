import React from 'react';
import ReactDOM from 'react-dom';
import DataTable from 'react-data-table-component';
import './index.css';
import ConfigJson from './config.json';
import PopUp from './PopUp.js';

class FeatFlagWindow extends React.Component {
  constructor(props) {
    super(props);
    console.log(props, 'props');
    this.state = {};
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup,
    });
  }

  render() {
    return (
      <div>
        {this.state.showPopup ?
          <PopUp text='Close Me' closePopup={this.togglePopup.bind(this)}/>
          : null
        }
        <div className = "selected-container">
        <h2 className="title">Feature Flag</h2>
        <h4 className="inner-title">Values</h4>
        <div className="button-container">
          <button className="button" onClick={this.togglePopup.bind(this)}>Add</button>
          <button className="button">Edit</button>
          <button className="button">Remove</button>
        </div>
        </div>
      </div>
    );
  }
}

export default FeatFlagWindow;
