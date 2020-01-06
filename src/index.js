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
        configValue: null
      },
      loading: true
    };
    this.featFlagCallback = this.featFlagCallback.bind(this);

    const gh = new GitHub();
    const repo = gh.getRepo('JonCGit', 'config-project');

    repo.getContents('development', 'config.json', false, (err, contents) => {
      this.setState({
        repository: repo,
        env: JSON.parse(atob(contents.content)),
        loading: false
      });
    });
  }

  handleFeatFlagChange = value => {
    console.log(value, 'Selected config');
    this.setState({ selectedConfig: value });
  };

  handleEnvChange = input => {
    console.log(input.name, 'Selected Env');
    this.setState({ loading: true });
    this.state.repository.getContents(input.name.toLowerCase(), 'config.json', false, (err, contents) => {
      this.setState({
        env: JSON.parse(atob(contents.content)),
        loading: false
      });
    });
  };

  featFlagCallback(newConfig, oldValue) {
    if(oldValue) {
      this.setState((prevState) => {
        const indexOfOldValue = prevState.selectedConfig.configValue.indexOf(oldValue);
        prevState.selectedConfig.configValue.splice(indexOfOldValue, 1);
        return {
          selectedConfig: prevState.selectedConfig.configValue.push(newConfig)
        }
      });
    } else {
      this.setState((prevState) => {
        return {
          selectedConfig: prevState.selectedConfig.configValue.push(newConfig)
        }
      });
    }
  }

  render() {
    return (
      <div className="page">
        <EnvSearch handleEnvChange={this.handleEnvChange} />
        <div className="row">
          <div className="env-window">
            <EnvWindow handleFeatFlagChange={this.handleFeatFlagChange} env={this.state.env} loading={this.state.loading} />
          </div>
          <div className="env-window">
            <FeatFlagWindow callbackFromFeatFlag={this.featFlagCallback} selectedConfig={this.state.selectedConfig}/>
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
