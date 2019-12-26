import React from 'react';
import ReactDOM from 'react-dom';
import DataTable from 'react-data-table-component';
import './index.css';
import ConfigJson from './config.json';

class EnvSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      env: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.handleEnvChange(ConfigJson[event.target.value]);
    this.setState({ env: ConfigJson[event.target.value] });
  }

  render() {
    return (
      <select onChange={this.handleChange}>
        {ConfigJson.map((env, index) =>
          <option key={index} value={index}>{env.name}</option>
        )}
      </select>
    );
  }
}

export default EnvSearch;
