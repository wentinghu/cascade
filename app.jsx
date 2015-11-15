import React from 'react/addons';
import Operation from './operations.jsx';


var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var types = {
  add: "do",
  sub: "do",
  reduce: "do"
};

var lastID = 0;
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "New Procedure",
      operations: []
    }
  }

  handleChange(e){
    this.setState({title: e.target.value});
  }

  addToList(valueName){
    var newArray = this.state.operations.slice();
    newArray.push({type: types[valueName] || "with", name: valueName, key: ++lastID});
    this.setState({operations: newArray});
  }

  removeOperation(i){
    console.log(i);
    var newArray = this.state.operations.slice();
    newArray.splice(i, 1);
    this.setState({operations: newArray});
  }

  render() { 
    return (
      <div className="app">
        <input className="title" type="text" value={this.state.title} onChange={this.handleChange}/>
          <div className="operations" key="operations">
            <ReactCSSTransitionGroup transitionName='opTransition' transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
              {this.state.operations.map((operation, i) => <Operation key={operation.key} type={operation.type} name={operation.name} remove={() => this.removeOperation(i)}/>)}
            </ReactCSSTransitionGroup>
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
