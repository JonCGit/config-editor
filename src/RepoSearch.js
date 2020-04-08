import React from 'react';
import './index.css';

// Controlled Component, could be generalized and applied to both Search Components
function RepoSearch(props) {

    const handleChange = (event) => {
      props.handleFileChange(event.target.value);
    }

    return(
      <div className="pl-10">
        <div>
          Config File:
          <select className="option-select" onChange={handleChange}>
          {
            props.repoFiles.map( (fileName, index) => {
              return <option key={index} value={fileName}> {fileName} </option>
            })
          }
          </select>
        </div>
      </div>
    );
}

export default RepoSearch;
