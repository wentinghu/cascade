import React from 'react';
import Operation from './operations.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "New Procedure",
      operations: [{type: "with", name: "value", value: 2}, {type: "do", name: "value", value: 2}]
    }
  }
  render() { 
    return (
      <div className="app">
        <input className="title" type="text" value={this.state.title} />
        <div className="operations">
          {this.state.operations.map((operation) => <Operation type={operation.type} name={operation.name} value={operation.value} />)}
        </div>
        <div className="buttons">
          <button onClick={() => alert("MAKE THIS")}><i className="fa fa-plus"></i></button>
          <button onClick={() => alert("MAKE THIS")} className="run"><i className="fa fa-play"></i></button>
        </div>
      </div>
    )
  }
}

React.render(<App/>, document.getElementById('app'));
