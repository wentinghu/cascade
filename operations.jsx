import React from 'react/addons';

export default class Operation extends React.Component {
  constructor(props) {
    super(props);
    if(props.operation.name == "value"){
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
    if(this.props.operation.name == "value") {
      valDiv = <input type="text" value={this.state.value} onChange={this.valueChanged}/>
    } else {
      valDiv = <h3>{this.props.operation.name}</h3>
    }
    return (
      <div className="operationwrapper">
        <div className="operation">
          <div className={`type ${this.props.operation.type}`}>{this.props.operation.type}</div>
          <div className="value">{valDiv}</div>
          <button onClick={this.props.remove}>REMOVE</button>
        </div>
        <i className="arrow fa fa-long-arrow-down"></i>
      </div>
      
    )
  }
}
