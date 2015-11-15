import React from 'react/addons';
import Operation from './operations.jsx';


var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var types = {
  add: "do",
  sub: "do",
  reduce: "do",
  apply: "apply"
};

var lastID = 0;
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "New Procedure",
      operations: [],
      menuOpen: false
    }
    this.scroll = false;
  }

  handleChange(e){
    this.setState({title: e.target.value});
  }

  addToList(valueName){
    this.setState({menuOpen: false});
    var newArray = this.state.operations.slice();
    newArray.push({type: types[valueName] || "with", name: valueName, key: ++lastID});
    this.setState({operations: newArray});
    this.scroll = true;
    this.scrollElement();
    setTimeout(()=>this.setScrollFalse(), 500);
  }

  removeOperation(i){
    console.log(i);
    var newArray = this.state.operations.slice();
    newArray.splice(i, 1);
    this.setState({operations: newArray});
  }

  setScrollFalse() {
    this.scroll = false;
  }

  scrollElement() {
  //store a this ref, and
    var _this = this;
    //wait for a paint to do scrolly stuff
    var animation = () => {
      var node = document.body;
      if (node !== undefined) {
        //and scroll them!
        node.scrollTop = node.scrollHeight;
      }
      if(this.scroll == true){
        window.requestAnimationFrame(animation);
      }
    }
    window.requestAnimationFrame(animation);
  }


  render() { 
    return (
      <div className="app">
        <input className="title" type="text" value={this.state.title} onChange={(e)=>this.handleChange(e)}/>
          <div className="operations" id="operations">
            <ReactCSSTransitionGroup transitionName='opTransition' transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
              {this.state.operations.map((operation, i) => <Operation key={operation.key} type={operation.type} name={operation.name} remove={() => this.removeOperation(i)}/>)}
            </ReactCSSTransitionGroup>
          </div>
        <div className="options">
          <div className="buttons">
            <button onClick={() => this.setState({menuOpen: true})}><i className="fa fa-plus"></i></button>
            <button onClick={() => alert("MAKE THIS")} className="run"><i className="fa fa-play"></i></button>
          </div>
          <div className={`menu ${this.state.menuOpen ? "open": ""}`}>
            <button className="do" onClick={() => this.addToList("add")}>ADD</button>
            <button className="do" onClick={() => this.addToList("sub")}>SUBTRACT</button>
            <button className="do" onClick={() => this.addToList("reduce")}>REDUCE</button>
            <button className="with" onClick={() => this.addToList("value")}>VALUE</button>
            <button className="apply" onClick={() => this.addToList("apply")}>APPLY</button>
          </div>
        </div>
      </div>
    )
  }
}

React.render(<App/>, document.getElementById('app'));
