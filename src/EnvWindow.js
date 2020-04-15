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

  renderTable() {
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
    if (this.props.fileType === "json"){
      const table = (
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
      );
      return table;
    } else if (this.props.fileType === "properties") {
      const table = Object.keys(this.props.env).map((varKey, index) => {
        return (
          <DataTable
            key={index}
            title={varKey}
            columns={[{name: varKey, sortable: false, selector: "selectorKey"}]}
            data={[{selectorKey: varKey}]}
            customStyles={customStyles}
            defaultSortField="selectorKey"
            highlightOnHover
            pointerOnHover
            onRowClicked={console.log("implement on click!")}
            onSelectedRowsChange={console.log("implement me!")}
            conditionalRowStyles={conditionalRowStyles}
          />
        );
      })
      return table;
    }
    return <div> Sorry, an error occurred </div>;
  }

  render() {
    return (
      <div className="display-window">
        {this.props.loading && <CircularProgress />}
        <div>
          {(this.props.fileType === "json") ? <div className="window-title">{this.props.env.name}</div> : <div className="window-title"> Development </div>}

          <div className="window-title"> {this.renderTable()} </div>
        </div>
      </div>
    );
  }
}

export default EnvWindow;
