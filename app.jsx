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
      <div>
        <input type="text" value={this.state.title} />
        <div className="operations">
          {this.state.operations.map((operation) => <Operation type={operation.type} name={operation.name} value={operation.value} />)}
        </div>
        <button onClick={() => alert("MAKE THIS")}>+</button>
        <button onClick={() => alert("MAKE THIS")}>+</button>
      </div>
    )
  }
}

React.render(<App/>, document.getElementById('app'));
