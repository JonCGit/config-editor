import React from 'react';
import './index.css';
import { IoIosClose } from 'react-icons/io';

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
    let errors = this.state.errors;
    switch (name) {
      case 'add-value':
        errors.checkValue = value.length < 5 ? 'Full Name must be 5 characters long!' : '';
        break;
      default:
        break;
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
                  <input type="text" name="add-value" className="input-field"
                    noValidate onChange={this.handleChange}/>
                  {errors.checkValue.length > 0 &&
                    <span className='error'>{errors.checkValue}</span>}
                </label>
                <input disabled={!this.state.value} type="submit"
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
                  <input type="text" name="edit-value" defaultValue={this.props.selectedConfigValue}
                    className="input-field" noValidate onChange={this.handleChange}/>
                  {errors.checkValue.length > 0 &&
                    <span className='error'>{errors.checkValue}</span>}
                </label>
                <input disabled={!this.state.value} type="submit"
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
              <button className="button" onClick={this.onRemoveValueClicked}>Yes</button>
              <button className="button" onClick={this.props.closePopup}>No</button>
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
