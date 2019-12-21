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
    super();
    this.state = {
      env: ConfigJson[0]
    };
  }

   handleFeatFlagChange = value => {
      console.log(value, 'selected Env');
      this.setState({ evn: value });
  };

  render() {
    const handleEnvChange = input => {
      console.log(input, 'selected Env 100');
      this.setState({ env: input });
    };

    return (
      <div className="page">
        <EnvSearch handleEnvChange={handleEnvChange} />
        <div className="row">
          <div className="env-window">
            <EnvWindow handleFeatFlagChange={this.handleFeatFlagChange} env={this.state.env} />
          </div>
          <div className="env-window">
            <FeatFlagWindow selected={this.state}/>
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
