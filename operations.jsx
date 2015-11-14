import React from 'react';

export default class Operation extends React.Component {
  constructor(props) {
    super(props);
  }
  render() { 
  	var valDiv;
	if(this.props.name == "value") {
	  valDiv = <div className="value"><input type="text" value={this.props.value} /></div>
	} else {
	  valDiv = <h3>{this.props.name}</h3>
	}
    return (
      <div className="operations">
      	<div className="type"></div>
      	{valDiv}
      </div>
    )
  }
}