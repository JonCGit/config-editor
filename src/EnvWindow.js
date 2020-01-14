import React from 'react';
import DataTable from 'react-data-table-component';
import './index.css';
import CircularProgress from '@material-ui/core/CircularProgress';

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

// TODO: make this a function component
class EnvWindow extends React.Component {
  constructor(props) {
    super(props);
    this.handleFeatFlagChange = this.handleFeatFlagChange.bind(this);
  }

  handleFeatFlagChange(value) {
    this.props.handleFeatFlagChange(value);
  }

  render() {
    const conditionalRowStyles = [
      {
        when: row => row === this.props.selectedConfig,
        style: {
          backgroundColor: 'rgb(230, 244, 244)',
          borderBottomColor: '#FFFFFF',
          borderRadius: '25px',
          outline: '1px solid #FFFFFF',
        },
      },
    ];

    return (
      <div className="display-window">
        {this.props.loading &&
          <CircularProgress />
        }
        {!this.props.loading &&
          <div>
            <div className="window-title">{this.props.env.name}</div>
            <div className="env-window-body">
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
                  conditionalRowStyles={conditionalRowStyles}
                />
              )}
              </div>
          </div>
        }
      </div>
    );
  }
}

export default EnvWindow;
