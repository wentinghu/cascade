import React from 'react';
import Operation from './operations.jsx';

var types = {
  add: "do",
  sub: "do",
  reduce: "do"
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "New Procedure",
      operations: [{type: "with", name: "value", value: 2}, {type: "do", name: "value", value: 2}]
    }
  }

  handleChange(e){
    this.setState({title: e.target.value});
  }

  addToList(valueName){
    var newArray = this.state.operations.slice();
    newArray.push({type: types[valueName] || "with", name: valueName});
    this.setState({operations: newArray});
  }

  render() { 
    return (
      <div className="app">
        <input className="title" type="text" value={this.state.title} onChange={this.handleChange}/>
        <div className="operations">
          {this.state.operations.map((operation) => <Operation type={operation.type} name={operation.name}/>)}
        </div>
        <div className="buttons">
          <button onClick={() => alert("MAKE THIS")}><i className="fa fa-plus"></i></button>
          <button onClick={() => alert("MAKE THIS")} className="run"><i className="fa fa-play"></i></button>
        </div>
        <div className="menu">
          <button onClick={() => this.addToList("add")}>ADD</button>
          <button onClick={() => this.addToList("sub")}>SUBTRACT</button>
          <button onClick={() => this.addToList("reduce")}>REDUCE</button>
          <button onClick={() => this.addToList("value")}>VALUE</button>
        </div>
      </div>
    )
  }
}

React.render(<App/>, document.getElementById('app'));
