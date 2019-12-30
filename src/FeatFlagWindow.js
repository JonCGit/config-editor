import React from 'react';
import './index.css';
import PopUp from './PopUp.js';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

class FeatFlagWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup,
    });
  }

  handleChange(changeEvent) {
    this.setState({
      value: changeEvent.target.value,
    });
  }

  renderSwitch() {
    const arrayOrString = this.props.selectedConfig.configValue;
    if (Array.isArray(arrayOrString)) {
      return this.props.selectedConfig.configValue.map(options =>
        <FormControlLabel
          key={options}
          value={options}
          control={<Radio color="primary" />}
          label={options}
        />
      );
    } else {
      return (
        <FormControlLabel
          key={this.props.selectedConfig.configValue}
          value={this.props.selectedConfig.configValue}
          control={<Radio color="primary" />}
          label={this.props.selectedConfig.configValue}
        />
      );
    }
  }

  render() {
    const valueOptions = (
      <FormControl component="fieldset">
        <RadioGroup value={this.state.value} onChange={this.handleChange}>
          {this.props.selectedConfig.configValue ?
              this.renderSwitch() : null
          }
        </RadioGroup>
      </FormControl>

    );
    return (
      <div>
        {this.state.showPopup ?
          <PopUp value={this.state.value} closePopup={this.togglePopup.bind(this)}/>
          : null
        }
        <div className="selected-container">
        <h2 className="title">Feature Flag</h2>
        <h4 className="inner-title">Values</h4>
        <div className="value-container">
          {valueOptions}
        </div>
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
