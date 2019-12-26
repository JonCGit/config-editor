import React from 'react';
import ReactDOM from 'react-dom';
import DataTable from 'react-data-table-component';
import './index.css';
import ConfigJson from './config.json';
import EnvSearch from './EnvSearch.js';
import EnvWindow from './EnvWindow.js';
import FeatFlagWindow from './FeatFlagWindow.js';

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      env: ConfigJson[0],
      selectedConfig: {
        configValue: null,
      },
    };
  }

  handleFeatFlagChange = value => {
    console.log(value, 'Selected config');
    this.setState({ selectedConfig: value });
  };

  handleEnvChange = input => {
    console.log(input, 'selected Env 100');
    this.setState({ env: input });
  };

  render() {
    return (
      <div className="page">
        <EnvSearch handleEnvChange={this.handleEnvChange} />
        <div className="row">
          <div className="env-window">
            <EnvWindow handleFeatFlagChange={this.handleFeatFlagChange} env={this.state.env} />
          </div>
          <div className="env-window">
            <FeatFlagWindow selectedConfig={this.state.selectedConfig}/>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
