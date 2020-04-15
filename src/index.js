import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import RepoSearch from './RepoSearch';
import EnvSearch from './EnvSearch.js';
import EnvWindow from './EnvWindow.js';
import FeatFlagWindow from './FeatFlagWindow.js';
import GitHub from 'github-api';

import json from './configprop.json';
import { parse } from 'dot-properties';

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repository: null,
      selectedFile: "",
      repoFiles: [],
      fileType: "",
      env: null,
      selectedConfig: {
        configValue: null,
      },
      loading: true,
    };
    this.featFlagCallback = this.featFlagCallback.bind(this);
    this.selectedRemovedValue = this.selectedRemovedValue.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    console.log(parse("#Breakfast Configs\ncrn.allDayBreakfastLocations=00314,12348,00571,12389,12345,00347,02846,00001\ncrn.breakfastEndTime=10:30 AM"));
  }



  componentDidMount() {
    var fileNames = ["config.json", "config.properties"];
   this.setState({
     repoFiles: fileNames,
     selectedFile: fileNames[0],
     fileType: "json",
     env: json,
     loading: false
   });
    // let gh = new GitHub({
    //   username: 'JonCGit',
    //   password: 'Hackathon123',
    // });
    // const repo = gh.getRepo('JonCGit', 'config-project');
    // repo.getContents('development', './', false, (error, response) => {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     var fileNames = [];
    //     response.forEach((file, i) => {
    //       fileNames.push(file.name);
    //     });
    //     console.log(fileNames);
    //     let selectedFile = response[0].name;
    //     repo.getContents('development', selectedFile, false, (err, contents) => {
    //       this.setState({
    //         repoFiles: fileNames,
    //         selectedFile: selectedFile,
    //         repository: repo,
    //         env: JSON.parse(atob(contents.content)),
    //         loading: false,
    //       });
    //     });
    //   }
    // });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedFile !== this.state.selectedFile) {
      // TODO: Error Handle in case of malformed filename
      let beginExtension = this.state.selectedFile.lastIndexOf(".");
      var fileExtension = this.state.selectedFile.substring(beginExtension+1).toLowerCase();
      // TODO: List accepted File Types in ./config.json filter accepted file types
      if (fileExtension === "json") {
        this.setState({
          fileType: fileExtension,
          env: json,
          loading: false
        });
        // this.state.repository.getContents('development', this.state.selectedFile, false, (error, contents) => {
        //   this.setState({
        //     env: JSON.parse(atob(contents.content)),
        //     loading: false,
        //   });
        // });
      } else if (fileExtension === "properties"){
        var tempProps = parse("#Breakfast Configs\ncrn.allDayBreakfastLocations=00314,12348,00571,12389,12345,00347,02846,00001\ncrn.breakfastEndTime=10:30 AM");
        console.log(tempProps);
        this.setState({
          fileType: fileExtension,
          env: tempProps,
          loading: false
        });
      } else {
        // TODO: handle parsing of other file types
      }
    }
  }

  handleFileChange = (input) => {
    console.log(input, 'Selected File');
    this.setState({
        selectedFile: input,
        loading: true,
    });
  };

  updateConfig = (configData, commitMsg) => {
    console.log(configData, 'data');
    const base64json = require('base64json');

    // This data variable is just dummy data, use the config data input once it is setup
    let data = configData;
    console.log(data);
    console.log(this.state.selectedConfig);

    let encoded = base64json.stringify(data, null, 2);
    let options = {
      encode: false,
    };

    // TODO: replace the branch name and commit message with user inputs
    this.state.repository.writeFile (
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
    console.log("Setting up ConfigValue for first time");
    console.log("Before");
    console.log(this.state.selectedConfig);
    console.log(this.state.env);
    // this.setState({ selectedConfig: value });
    this.setState((prevState) => {
      return {selectedConfig:value};
    }, () => {
      console.log(this.state.env);
    });
  };

  handleEnvChange = input => {
    console.log(input.name, 'Selected Env');
    this.setState({ loading: true, selectedConfig: {}});
    this.state.repository.getContents(
      input.name.toLowerCase(), this.state.selectedFile, false, (err, contents) => {
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
        console.log(this.state.env);
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
              selectedConfig={this.state.selectedConfig} fileType={this.state.fileType}
              loading={this.state.loading} />
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
