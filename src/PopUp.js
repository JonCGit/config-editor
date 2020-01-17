import React from 'react';
import './index.css';
import { IoIosClose } from 'react-icons/io';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

class PopUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      errors: {
        checkValue: '',
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onRemoveValueClicked = this.onRemoveValueClicked.bind(this);
  }

  validateForm() {
    let valid = true;
    if (this.props.selectedConfigValue === this.state.value) {
      valid = false;
    }

    return valid;
  }

  handleChange(event) {
    const { name, value } = event.target;
    console.log(value, 'value');
    let errors = this.state.errors;
    if (this.props.configType === 'locationList') {
      switch (name) {
        case 'add-value':
          if (value.length < 5) {
            errors.checkValue = 'Location number must be 5 characters long!';
          } else if (value.length > 5) {
            errors.checkValue = 'Location number can not be more than 5 characters long!';
          } else {
            errors.checkValue = '';
          }

          break;
        case 'edit-value':
          if (value.length < 5) {
            errors.checkValue = 'Location number must be 5 characters long!';
          } else if (value.length > 5) {
            errors.checkValue = 'Location number can not be more than 5 characters long!';
          } else {
            errors.checkValue = '';
          }

          break;
        default:
          break;
      }
    } else {
      errors.checkValue = '';
    }

    this.setState({ errors, value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.callbackFromParent(this.state.value);
    if (this.state.value) {
      this.props.closePopup(false);
    }
  }

  onRemoveValueClicked() {
    this.props.removedValueFromPopup(this.props.selectedConfigValue);
    this.props.closePopup(false);
  }

  getInputByType() {
    if (this.props.configType === 'locationList' || this.props.configType === 'integer') {
      return (
        <input type="number" name="edit-value" defaultValue={this.props.selectedConfigValue} className="input-field" noValidate onChange={this.handleChange}/>
      );
    } else if (this.props.configType === 'boolean') {
      return (
        <RadioGroup style={{ flexDirection: 'row' }} name="boolean-value" defaultValue={this.props.selectedConfigValue} onChange={this.handleChange} className="boolean-radio">
          <Radio color="primary" className='popup-radio' style={{ flex: 1 }} value="True" />True
          <Radio color="primary" className='popup-radio' style={{ flex: 1 }} value="False" />False
        </RadioGroup>
      );
    } else {
      return (
        <input type="text" name="edit-value" defaultValue={this.props.selectedConfigValue} className="input-field" noValidate onChange={this.handleChange}/>
      );
    }
  }

  typeOfPopupOpen() {
    const { errors } = this.state;
    if (this.props.type === 'isAdd') {
      return (
        <div className='popup'>
          <div className='popup_inner'>
            <div className="popup-header">
              Add<IoIosClose className="close-icon" onClick={this.props.closePopup} />
            </div>
            <div className="add-value-field">
              <form onSubmit={this.handleSubmit} className="form-container" noValidate>
                <label className="field-label">
                  Enter Value:
                </label>
                <input type="number" name="add-value" className="input-field"
                  noValidate onChange={this.handleChange}/>
                {errors.checkValue.length > 0 &&
                  <span className='error'>{errors.checkValue}</span>}
                <input disabled={!this.state.value || errors.checkValue.length > 0} type="submit"
                  className="submit-button" value="Add"/>
              </form>
            </div>
          </div>
        </div>
      );
    } else if (this.props.type === 'isEdit') {
      return (
        <div className='popup'>
          <div className='popup_inner'>
            <div className="popup-header">
              Edit<IoIosClose className="close-icon" onClick={this.props.closePopup} />
            </div>
            <div className="add-value-field">
              <form onSubmit={this.handleSubmit} className="form-container" noValidate>
                <label className="field-label">
                  Edit Value:
                </label>
                {this.getInputByType()}
                  {errors.checkValue.length > 0 &&
                    <span className='error'>{errors.checkValue}</span>}
                <input disabled={!this.state.value || errors.checkValue.length > 0} type="submit"
                  className="submit-button" value="Edit"/>
              </form>
            </div>
          </div>
        </div>
      );
    } else if (this.props.type === 'isRemove') {
      return (
        <div className='popup'>
          <div className='popup_inner'>
            <div className="popup-header">
              Remove<IoIosClose className="close-icon" onClick={this.props.closePopup} />
            </div>
            <div className="remove-message">
                Are you sure you want to remove {this.props.selectedConfigValue}?
                <form className="form-container">
                  <label className="field-label">
                    Commit Message (Optional):
                    <input type="text" name="add-msg" className="commit-msg-field"
                      noValidate onChange={this.handleChange} />
                  </label>
                </form>
                <div className="row remove-buttons">
                  <button className="button" onClick={this.onRemoveValueClicked}>Yes</button>
                  <button className="button" onClick={this.props.closePopup}>No</button>
                </div>
              </div>
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      this.typeOfPopupOpen()
    );
  }
}

export default PopUp;
