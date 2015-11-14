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

  handleChange(e){
    this.setState({title: e.target.value})
  }

  render() { 
    return (
      <div className="app">
        <input className="title" type="text" value={this.state.title} onChange={this.handleChange}/>
        <div className="operations">
          {this.state.operations.map((operation) => <Operation type={operation.type} name={operation.name}/>)}
        </div>
        <button onClick={() => alert("MAKE THIS")}><i className="fa fa-plus"></i></button>
        <button onClick={() => alert("MAKE THIS")}><i className="fa fa-play"></i></button>
      </div>
    )
  }
}

React.render(<App/>, document.getElementById('app'));
