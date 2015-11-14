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
	  valDiv = <input type="text" value={this.state.value} onChange={this.valueChanged}/>
	} else {
	  valDiv = <h3>{this.props.name}</h3>
	}
    return (
      <div className="operation">
      	<div className={`type ${this.props.type}`}>{this.props.type}</div>
      	<div className="value">{valDiv}</div>
        <i className="arrow fa fa-arrow-down"></i>
      </div>
    )
  }
}
