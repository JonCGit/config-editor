import React from 'react';
import ReactDOM from 'react-dom';
import DataTable from 'react-data-table-component';
import './index.css';
import ConfigJson from './config.json';
import FeatFlagWindow from "./FeatFlagWindow";

const columns = [
  {
    name: 'Config Id',
    selector: 'configItemId',
    sortable: false,
  },
];

const customStyles = {
  headRow: {
    style: {},
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

class EnvWindow extends React.Component {
  constructor(props) {
    super(props);
    console.log(props, 'from env win');
    this.state = {
        selected: {}
      };
    this.handleFeatFlagChange = this.handleFeatFlagChange.bind(this);
  }

  handleFeatFlagChange(value) {
    this.props.handleFeatFlagChange(value);
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
                onRowClicked={this.handleFeatFlagChange}
                onSelectedRowsChange={this.handleFeatFlagChange}
              />
            )}
          </div>
      </div>
    );
  }
}

export default EnvWindow;
