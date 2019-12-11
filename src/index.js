import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ConfigJson from './config.json';

class EnvSearch extends React.Component {
  constructor(props) {
    super();
    this.state = {
      environments: ['Test', 'Prod', 'QA'],
    };
  }

  render() {
    let envOpts = [<option value='0' label='Choose an environment...' />];
    ConfigJson.map((env, i) => {
      envOpts.push(<option value={i + 1} label={env.name} />);
    });

    return <select>{envOpts}</select>;
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
        <div>Yo dawg this is text with a dropdown picker above it</div>
        <div>This box gon' be the environment window with the config 'n' all that</div>
      </div>

      // <div>{ConfigJson.map((env, index) => {
      //   return <div>{env.config.location_id}</div>;
      // })}</div>
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
      <div className="env-display">
        <div>This text is over here on the right</div>
        <div>This is more text on the right</div>
        <div>Pay no attention to the lack of actual content here</div>
      </div>
    );
  }
}

class Page extends React.Component {
  render() {
    return (
      <div className="page">
        <EnvSearch />
        <div className="row">
          <div className="env-window">
            <EnvWindow />
          </div>
          <div className="env-window">
            <FeatFlagWindow />
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
