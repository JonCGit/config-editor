import React from 'react';
import ReactDOM from 'react-dom';
import DataTable from 'react-data-table-component';
import './index.css';
import ConfigJson from './config.json';

const columns = [
  {
    name: 'Config Id',
    selector: 'configItemId',
    sortable: false
  }
];

const customStyles = {
  headRow: {
    style: {
    },
  },
  headCells: {
    style: {
      color: '#202124',
      fontSize: '14px',
    },
  },
  rows: {
    highlightOnHoverStyle: {
      backgroundColor: 'rgb(230, 244, 244)',
      borderBottomColor: '#FFFFFF',
      borderRadius: '25px',
      outline: '1px solid #FFFFFF',
    },
  },
  pagination: {
    style: {
      border: 'none',
    },
  },
};

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
    return <select onChange={this.handleChange}>
             {ConfigJson.map((env, index) =>
               <option key={index} value={index}>
                 {env.name}
               </option>
             )}
           </select>
  }
}

class EnvWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      configbody: '',
    };
  }

  render() {
    return (
      <div className="env-display">
        <div className="env-window-name">{this.props.env.name}</div>
          <div>
            {this.props.env.configGroups.map((group, index) =>
              <DataTable
                key={index}
                title={group.groupName}
                columns={columns}
                data={group.configs}
                customStyles={customStyles}
                defaultSortField="configItemId"
                highlightOnHover
                pointerOnHover
              />
            )}
          </div>
      </div>
    );
  }
}

class FeatFlagWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  togglePopup() {
    this.setState({
        showPopup: !this.state.showPopup
    });
  }

  render() {
    return (
      <div>
        {this.state.showPopup ?
            <PopUp
                text='Close Me'
                closePopup={this.togglePopup.bind(this)}
            />
            : null
        }
        <div className = "selected-container">
          <h2 className="title">Feature Flag</h2>
          <h4 className="inner-title">Values</h4>
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

class PopUp extends React.Component {
  render() {
    return (
      <div className='popup'>
        <div className='popup_inner'>
          <h1>{this.props.text}</h1>
          <button onClick={this.props.closePopup}>close me</button>
        </div>
      </div>
    );
  }
}

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
