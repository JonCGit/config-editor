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

  handleFeatFlagChange = value => {
    console.log(value, 'Selected config');
    this.setState({ selectedConfig: value });
  };

  handleEnvChange = input => {
    console.log(input.name, 'Selected Env');
    this.setState({ loading: true });
    this.state.repository.getContents(
      input.name.toLowerCase(), 'config.json', false, (err, contents) => {
        this.setState({
          env: JSON.parse(atob(contents.content)),
          loading: false,
        });
      }
    );
  };

  updateConfig = configData => {
    const base64json = require('base64json');

    // This data variable is just dummy data, use the config data input once it is setup
    let data = {
      "name":"Prod",
      "configGroups":[
        {
          "groupName":"Offer Configs",
          "configs":[
            {
              "configValue":"Free Chick-Fil-A Breakfast Item",
              "configType":"string",
              "configItemId":"crn.offerTitle"
            },
            {
              "configValue":"Enjoy one of these breakfast items on us! Offer expires 12/31/2019.",
              "configType":"string",
              "configItemId":"crn.offerMessage"
            },
            {
              "configValue":"http://www.cfacdn.com/img/order/menu/Mobile/Entrees/Parent/bts_mog_offer.png",
              "configType":"imageUrl",
              "configItemId":"crn.offerImage"
            }
          ]
        }
      ]
    };

    let encoded = base64json.stringify(data, null, 2);
    let options = {
      encode: false
    };

    // TODO: replace the branch name and commit message with user inputs
    this.state.repository.writeFile('prod', 'config.json', encoded, 'test commit 64', options, (err, contents) => {
      console.log(contents, 'branch data after write');
    });
  };

  featFlagCallback(newConfig, oldValue) {
    if (oldValue) {
      this.setState((prevState) => {
        const indexOfOldValue = prevState.selectedConfig.configValue.indexOf(oldValue);
        prevState.selectedConfig.configValue.splice(indexOfOldValue, 1);
        prevState.selectedConfig.configValue.push(newConfig);
        return {
          selectedConfig: prevState.selectedConfig,
        };
      });
    } else {
      this.setState((prevState) => {
        prevState.selectedConfig.configValue.push(newConfig);
        return {
          selectedConfig: prevState.selectedConfig,
        };
      });
    }
  }

  render() {
    return (
      <div className="page">
        <EnvSearch handleEnvChange={this.handleEnvChange} />
        <div className="row">
          <div className="env-window">
            <EnvWindow handleFeatFlagChange={this.handleFeatFlagChange}
              env={this.state.env} selectedConfig={this.state.selectedConfig}
              loading={this.state.loading} />
          </div>
          <div className="env-window">
            <FeatFlagWindow callbackFromFeatFlag={this.featFlagCallback}
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
