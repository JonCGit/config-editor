import React from 'react';
import './index.css';
import ConfigJson from './config.json';
import PropTypes from 'prop-types';
import Img from 'react-image';

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
  }

  render() {
    // const logo = () =>
    //   <Img src="CFA_CSymbols/CFA_CSymbol_Circle_Red_CMYK.png" />;
    return (
      <div className="row">
        <div><Img src="CFA_CSymbols/CFA_CSymbol_Circle_Red_CMYK.png" /></div>
        <div>
          <select onChange={this.handleChange}>
            {ConfigJson.map((env, index) =>
              <option key={index} value={index}>{env.name}</option>
            )}
          </select>
        </div>
      </div>
    );
  }
}

export default EnvSearch;
