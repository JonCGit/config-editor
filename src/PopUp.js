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
  }

  validateForm(errors) {
    let valid = true;
    Object.values(errors).forEach(
      (val) => val.length > 0 && (valid = false)
    );
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

  render() {
    const { errors } = this.state;
    return (
      !this.props.selectedConfigValue ?
      <div className='popup'>
        <div className='popup_inner'>
          <div className="popup-header">
            Add Product <IoIosClose className="close-icon" onClick={this.props.closePopup} />
          </div>
          <div className="add-value-field">
            <form onSubmit={this.handleSubmit} className="form-container" noValidate>
              <label className="field-label">
                Enter Value:
                <input type="text" name="add-value" className="input-field"
                  noValidate onChange={this.handleChange} />
                {errors.checkValue.length > 0 ?
                <span className='error'>{errors.checkValue}</span> :
                <span className='error-placeholder'></span>}
              </label>
              <label className="field-label">
                Enter Commit Message (Optional):
                <input type="text" name="add-msg" className="commit-msg-field"
                  noValidate onChange={this.handleChange} />
              </label>
              <input type="submit" className="submit-button" value="Add"/>
            </form>
          </div>
        </div>
      </div> :
      <div className='popup'>
        <div className='popup_inner'>
          <div className="popup-header">
            Edit Product <IoIosClose className="close-icon" onClick={this.props.closePopup} />
          </div>
          <div className="add-value-field">
            <form onSubmit={this.handleSubmit} className="form-container" noValidate>
              <label className="field-label">
                Edit Value:
                <input type="text" name="edit-value"
                  defaultValue={this.props.selectedConfigValue}
                  className="input-field" noValidate onChange={this.handleChange} />
                  {errors.checkValue.length > 0 ?
                  <span className='error'>{errors.checkValue}</span> :
                  <span className='error-placeholder'></span>}
                </label>
                <label className="field-label">
                  Enter Commit Message (Optional):
                  <input type="text" name="add-msg" className="commit-msg-field"
                    noValidate onChange={this.handleChange} />
                </label>
              <input type="submit" className="submit-button" value="Edit"/>
            </form>
          </div>
        </div>
      </div>

    );
  }
}

export default PopUp;
