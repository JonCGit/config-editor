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
      env: ConfigJson[0],
    };
  }

  render() {
    const handleEnvChange = input => {
      console.log(input, 'selected Env');
      this.setState({ env: input });
    };

    return (
      <div className="page">
        <EnvSearch handleEnvChange={handleEnvChange} />
        <div className="row">
          <div className="env-window">
            <EnvWindow env={this.state.env} />
          </div>
          <div className="env-window">
            <FeatFlagWindow env={this.state.env} />
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
