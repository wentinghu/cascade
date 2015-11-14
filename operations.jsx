import React from 'react';

export default class Operation extends React.Component {
  constructor(props) {
    super(props);
    if(props.name == "value"){
    	this.state = {
    		value: 1
    	}
    }
  }

  valueChanged(e){
    this.setState({value: e.target.value})
  }

  render() { 
  	var valDiv;
	if(this.props.name == "value") {
	  valDiv = <div className="value"><input type="text" value={this.state.value} onChange={this.valueChanged}/></div>
	} else {
	  valDiv = <h3>{this.props.name}</h3>
	}
    return (
      <div className={`operation ${this.props.type}`}>
      	<div className="type"></div>
      	{valDiv}
      </div>
    )
  }
}
