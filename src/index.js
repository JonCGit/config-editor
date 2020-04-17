import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import RepoSearch from './RepoSearch';
import EnvSearch from './EnvSearch.js';
import EnvWindow from './EnvWindow.js';
import FeatFlagWindow from './FeatFlagWindow.js';
import GitHub from 'github-api';

/** April 17, 2020
* This SHOULD load properties from the placeholder file config.properties.
* It uses an npm package called dot-properties: https://github.com/eemeli/dot-properties
* Currently, this block does not work, as fs (File Server) does not seem to be
* useable on client-side. A different method of reading in a .properties file would be needed.
*
* However, if .properties files can be read successfully from GitHub,
* then the commented-out block will not be needed and can be removed.
* In this case, the dot-properties package will still be needed.
**/
const { parse, parseLines, stringify } = require('dot-properties');

// const fs = require('fs');
// const propFile = fs.readFile('./config.properties', 'utf8');
// const propObj = parse(propFile);
// console.log('.properties contents: ' + stringify(propObj));

//TODO: Make this cleaner, maybe its own file?
//Or maybe error message should be hardcoded in EnvWindow
const errJson = JSON.parse('{"name": "Error","configGroups":[{"groupName": "No repo found!","configs": [{"configValue": "","configType": "string","configItemId": "No repo was returned from GitHub."}]}]}');

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repository: null,
      selectedFile: '',
      repoFiles: [],
      env: null,
      selectedConfig: {
        configValue: null,
      },
      loading: true,
    };
    this.featFlagCallback = this.featFlagCallback.bind(this);
    this.selectedRemovedValue = this.selectedRemovedValue.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  componentDidMount() {
    let gh = new GitHub({
      username: 'JonCGit',
      password: 'Hackathon123',
    });
    const repo = gh.getRepo('JonCGit', 'config-project');
    repo.getContents('development', './', false, (error, response) => {
      if (error) {
        console.log(error);
        this.setState({
          env: errJson,
          loading: false,
        });
      } else {
        var fileNames = [];
        response.forEach((file, i) => {
          fileNames.push(file.name);
        });
        console.log(fileNames);
        let selectedFile = response[0].name;
        repo.getContents('development', selectedFile, false, (err, contents) => {
          this.setState({
            repoFiles: fileNames,
            selectedFile: selectedFile,
            repository: repo,
            env: JSON.parse(atob(contents.content)),
            loading: false,
          });
        });
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (typeof this.state.repository === 'undefined') {
      // TODO: Handle no repo returned from API. This console.log() is a placeholder
      console.log('No repo found');
    } else {
      if (prevState.selectedFile !== this.state.selectedFile) {
        // TODO: Error Handle in case of malformed filename
        let beginExtension = this.state.selectedFile.lastIndexOf('.');
        var fileExtension = this.state.selectedFile.substring(beginExtension + 1);

        // TODO: List accepted File Types in ./config.json filter accepted file types
        if (fileExtension.toLowerCase() === 'json') {
          this.state.repository.getContents('development', this.state.selectedFile, false, (error, contents) => {
            this.setState({
              env: JSON.parse(atob(contents.content)),
              loading: false,
            });
          });
        } else if (fileExtension.toLowerCase() === 'properties') {
          // TODO: Rework this using parser (at top of file) to handle .properties files from GitHub
          this.state.repository.getContents('development', this.state.selectedFile, false, (error, contents) => {
            this.setState({
              env: JSON.parse(atob(contents.content)),
              loading: false,
            });
          });
        }
      }
    }
  }

  handleFileChange = (input) => {
    console.log(input, 'Selected File');
    this.setState((state) => {
      return {
        selectedFile: input,
        loading: true,
      };
    });
  };

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
    //console.log(input.name, 'Selected Env');
    this.setState({ loading: true, selectedConfig: {} });
    if (this.state.repository) {
      this.state.repository.getContents(
        input.name.toLowerCase(), 'config.json', false, (err, contents) => {
          this.setState({
            env: JSON.parse(atob(contents.content)),
            loading: false,
          });
        }
      );
    } else {
      //TODO: when applicable, replace JSON string error message placeholder with
      // call to parsed object from config.properties
      this.setState({
        //env: JSON.parse('{"name": "Error","configGroups":[{"groupName": "Error","configs": [{"configValue": "No repo found!!","configType": "string","configItemId": "No repo found!"}]}]}'),
        //env: propObj, //this is the parsed object from config.properties
        env: errJson,
        loading: false,
      });
    }
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

  selectedRemovedValue(selected, commitMsg) {
    this.setState((prevState) => {
      const indexOfSelectedValue = prevState.selectedConfig.configValue.indexOf(selected);
      prevState.selectedConfig.configValue.splice(indexOfSelectedValue, 1);
      return {
        selectedConfig: prevState.selectedConfig,
      };
    }, () => {
      this.updateConfig(this.state.env, commitMsg);
    });
  }

  render() {
    return (
      <div className="page">
        <div className="row">
          <RepoSearch handleFileChange={this.handleFileChange} repoFiles={this.state.repoFiles} />
          <EnvSearch handleEnvChange={this.handleEnvChange} />
        </div>
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
