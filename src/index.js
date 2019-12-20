import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ConfigJson from './config.json';

class EnvSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      env: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.handleEnvChange(event.target.value);
    this.setState({ env: event.target.value });
  }

  render() {
    let envOpts = [<option value='' key='0' label='Choose an environment...' />];
    envOpts.push(ConfigJson.map((env, i) =>
      <option value={env.name.toLowerCase()} key={i + 1} label={env.name} />
    ));

    return <select value={this.state.env} onChange={this.handleChange}>{envOpts}</select>;
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
    var envWindowBody;
    let env = this.props.env;
    if (env === '') {
      envWindowBody = <h4>No config to display.</h4>;
    } else {
      let envJSON = ConfigJson.filter(function (el) {
        return el.name.toLowerCase() === env;
      })[0];

      envWindowBody = [<h4>Config groups:</h4>];
      envWindowBody.push(envJSON.configGroups.map((cg, i) =>
        <div className='group'>{cg.groupName}</div>
      ));
    }

    return (
      <div className='env-display'>
        <div>Below this line of text,the config will be displayed in some capacity.</div>
        {envWindowBody}
      </div>
    );
  }
}

class FeatFlagWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className='env-display'>
        <div>This text is over here on the right</div>
        <div>This is more text on the right</div>
        <div>Pay no attention to the lack of actual content here</div>
      </div>
    );
  }
}

class Page extends React.Component {
  constructor(props) {
    super();
    this.state = {
      env: '',
    };
  }

  render() {
    const handleEnvChange = input => {
      this.setState({ env: input });
    };

    return (
      <div className='page'>
        <EnvSearch handleEnvChange={handleEnvChange} />
        <div className='row'>
          <div className='env-window'>
            <EnvWindow env={this.state.env} />
          </div>
          <div className='env-window'>
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
