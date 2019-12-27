import React from 'react';
import './index.css';
import { IoIosClose } from 'react-icons/io';

class PopUp extends React.Component {
  render() {
    return (
      <div className='popup'>
        <div className='popup_inner'>
        <div className="popup-header">
          Add Product <IoIosClose className="close-icon" onClick={this.props.closePopup} />
        </div>
        </div>
      </div>
    );
  }
}

export default PopUp;
