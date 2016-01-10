import React from 'react/addons';
var _ = require('lodash');

export default class Operation extends React.Component {
  constructor(props) {
    super(props);
    if(props.operation.name == "value"){
      this.state = {
        value: props.operation.value
      }
    }
  }

  valueChanged(e){
    this.setState({value: e.target.value});
    this.props.operation.value = e.target.value;
  }

  render() { 
    var valDiv;
    if(this.props.operation.name == "value") {
      valDiv = <input type="text" value={this.state.value} onChange={(e)=>this.valueChanged(e)}/>
    } else {
      console.log(this.props.operation);
      valDiv = <h3>{this.props.operation.name}</h3>
    }
    var type = this.props.operation.type || this.props.operation.getType();
    console.log(type, this.props.operation.type || this.props.operation.getType());
    return (
      <div className="operationwrapper">
        <div className={`operation ${type}`}>
          <div className="type">{type}</div>
          <div className="value">{valDiv}</div>
          <button onClick={this.props.remove}><i className="fa fa-times"></i></button>
        </div>
        <i className="arrow fa fa-long-arrow-down"></i>
      </div>
      
    )
  }
}
