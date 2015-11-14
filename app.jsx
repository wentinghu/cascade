import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "New Procedure",
      operations: []
    }
  }
  render() { 
    return (
      <div>
        <input type="text" value={this.state.title} />
        <div className="operations">
          {this.state.operations.map((operation) => <Operation settings={operation} />)}
        </div>
        <button onClick={() => alert("MAKE THIS")}>+</button>
        <button onClick={() => alert("MAKE THIS")}>+</button>
      </div>
    )
  }
}

React.render(<App/>, document.getElementById('app'));
