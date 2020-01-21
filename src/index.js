import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import EnvSearch from './EnvSearch.js';
import EnvWindow from './EnvWindow.js';
import FeatFlagWindow from './FeatFlagWindow.js';
import GitHub from 'github-api';

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repository: null,
      env: null,
      selectedConfig: {
        configValue: null,
      },
      loading: true,
    };
    this.featFlagCallback = this.featFlagCallback.bind(this);
    this.selectedRemovedValue = this.selectedRemovedValue.bind(this);

    let gh = new GitHub({
      username: 'JonCGit',
      password: 'Hackathon123',
    });
    const repo = gh.getRepo('JonCGit', 'config-project');

    repo.getContents('development', 'config.json', false, (err, contents) => {
      this.setState({
        repository: repo,
        env: JSON.parse(atob(contents.content)),
        loading: false,
      });
    });
  }

  updateConfig = (configData, commitMsg) => {
    console.log(configData, 'data');
    const base64json = require('base64json');

    // This data variable is just dummy data, use the config data input once it is setup
    let data = configData;

    let encoded = base64json.stringify(data, null, 2);
    let options = {
      encode: false,
    };

    // TODO: replace the branch name and commit message with user inputs
    this.state.repository.writeFile(
      configData.name.toLowerCase(), 'config.json', encoded, commitMsg, options, (err, contents) => {
        this.setState({ loading: true });
        this.state.repository.getContents(
            configData.name.toLowerCase(), 'config.json', false, (err, contents) => {
                this.setState({
                    env: JSON.parse(atob(contents.content)),
                    loading: false,
                });
            }
        );
      }
    );
  };

  handleFeatFlagChange = value => {
    this.setState({ selectedConfig: value });
  };

  handleEnvChange = input => {
    console.log(input.name, 'Selected Env');
    this.setState({ loading: true, selectedConfig: {}});
    this.state.repository.getContents(
      input.name.toLowerCase(), 'config.json', false, (err, contents) => {
        this.setState({
          env: JSON.parse(atob(contents.content)),
          loading: false,
        });
      }
    );
  };

  featFlagCallback(newConfig, commitMsg, oldValue, valueType) {
    if (valueType === 'isArray' && oldValue) {
      this.setState((prevState) => {
        const indexOfOldValue = prevState.selectedConfig.configValue.indexOf(oldValue);
        prevState.selectedConfig.configValue.splice(indexOfOldValue, 1, newConfig);
        return {
          selectedConfig: prevState.selectedConfig,
        };
      }, () => {
        this.updateConfig(this.state.env, commitMsg);
      });
    } else if (valueType === 'isNotArray') {
      this.setState((prevState) => {
        prevState.selectedConfig.configValue = newConfig;
        return {
          selectedConfig: prevState.selectedConfig,
        };
      }, () => {
        this.updateConfig(this.state.env, commitMsg);
      });
    } else {
      this.setState((prevState) => {
        prevState.selectedConfig.configValue.push(newConfig);
        return {
          selectedConfig: prevState.selectedConfig,
        };
      }, () => {
        this.updateConfig(this.state.env, commitMsg);
      });
    }
  }

  selectedRemovedValue(selected) {
    this.setState((prevState) => {
      const indexOfSelectedValue = prevState.selectedConfig.configValue.indexOf(selected);
      prevState.selectedConfig.configValue.splice(indexOfSelectedValue, 1);
      return {
        selectedConfig: prevState.selectedConfig,
      };
    }, () => {
      this.updateConfig(this.state.env);
    });
  }

  render() {
    return (
      <div className="page">
        <EnvSearch handleEnvChange={this.handleEnvChange} />
        <div className="row">
          <div className="env-window">
            <EnvWindow handleFeatFlagChange={this.handleFeatFlagChange} env={this.state.env}
              selectedConfig={this.state.selectedConfig} loading={this.state.loading} />
          </div>
          <div className="env-window">
            <FeatFlagWindow callbackFromFeatFlag={this.featFlagCallback}
              getSelectedRemovedValue={this.selectedRemovedValue}
              selectedConfig={this.state.selectedConfig}/>
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
