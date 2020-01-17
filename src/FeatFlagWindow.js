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
      selectedConfigValue: '',
      type: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.myCallback = this.myCallback.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    this.removeCallBack = this.removeCallBack.bind(this);
  }

  togglePopup(type) {
    if (type === 'isAdd') {
      this.setState({
          showPopup: !this.state.showPopup,
          type: type,
          selectedConfigValue: ''
      });
    } else {
      this.setState({
          showPopup: !this.state.showPopup,
          type: type
      });
    }
  }

  handleChange(changeEvent) {
    this.setState({
      selectedConfigValue: changeEvent.target.value,
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

  myCallback(dataFromPopUp) {
    if (this.state.selectedConfigValue && this.props.selectedConfig.configType === 'locationList') {
      this.props.callbackFromFeatFlag(dataFromPopUp, this.state.selectedConfigValue, 'isArray');
      this.setState({
        selectedConfigValue: '',
      });
    } else if (this.state.selectedConfigValue && this.props.selectedConfig.configType !== 'locationList') {
      this.props.callbackFromFeatFlag(dataFromPopUp, this.state.selectedConfigValue, 'isNotArray');
      this.setState({
        selectedConfigValue: '',
      });
    } else {
      this.props.callbackFromFeatFlag(dataFromPopUp, null, null);
    }
  }

  removeCallBack(selectedValue) {
    this.props.getSelectedRemovedValue(selectedValue);
    this.setState({
      selectedConfigValue: '',
    });
  }

  render() {
    const valueOptions = (
      <FormControl component="fieldset">
        <RadioGroup value={this.state.selectedConfigValue} onChange={this.handleChange}>
          {this.props.selectedConfig.configValue ?
              this.renderSwitch() : null
          }
        </RadioGroup>
      </FormControl>

    );
    return (
      <div className="display-window">
        {this.state.showPopup
          ? <PopUp selectedConfigValue={this.state.selectedConfigValue} configType={this.props.selectedConfig.configType} type={this.state.type}
          callbackFromParent={this.myCallback} removedValueFromPopup={this.removeCallBack}
          closePopup={() => this.togglePopup('close')}/> : null
        }
        <div className="window-title">
          {this.props.selectedConfig.configItemId ?
            this.props.selectedConfig.configItemId :
            'Selected Config Values'}
        </div>
        <div className="selected-container">
          <div className="help-text">
            {this.props.selectedConfig.configItemId ? '' : 'Select a config to edit the values'}
          </div>
          <div className="value-container">{valueOptions}</div>
          <div className="button-container">
            <button
              disabled={this.props.selectedConfig.configType !== 'locationList'}
              className="button" onClick={() => this.togglePopup('isAdd')}>Add</button>
            <button
              disabled={!this.props.selectedConfig.configValue || !this.state.selectedConfigValue}
              className="button" onClick={() => this.togglePopup('isEdit')}>Edit</button>
            <button
              disabled={!this.props.selectedConfig.configValue || !this.state.selectedConfigValue || this.props.selectedConfig.configType !== 'locationList'}
              className="button" onClick={() => this.togglePopup('isRemove')}>Remove</button>
          </div>
        </div>
      </div>
    );
  }
}

export default FeatFlagWindow;
