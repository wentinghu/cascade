import React from 'react/addons';
import Operation from './operations.jsx';
import {Add, Sub, Value, Apply} from './Operation.js';


var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "New Procedure",
      operations: [],
      lastResult: null,
      errors: null,
      menuOpen: false
    }
  }

  computeResult() {
    var [output, e] = this.state.operations.reduce((last, operation) => {
      var [stack, errors] = last;
      var [newStack, newErrors] = operation.run(stack);
      return [newStack, errors.concat(newErrors)];
    }, [[], []]);

    var res;
    if (e.length > 0) {
      this.setState({errors: e});
      return;
    } else if (output.length == 0) {
      res = "Nothing";
    } else if (output.length == 1) {
      res = output[0].toString ? output[0].toString() : `${output[0]}`;
    } else {
      res = `(${output.map((e) => e.toString ? e.toString() : e).join(", ")})`;
    }
    this.setState({lastResult: res});
  }

  handleChange(e){
    this.setState({title: e.target.value});
  }

  addToList(op){
    var el = <Operation key={op.id} ref={op.id} operation={op} remove={() => this.removeOperation(op)}/>;
    op.element = () => this.refs[op.id];
    op.state = this.refs[op.id];
    var newArray = this.state.operations.slice();
    newArray.push(op);
    this.setState({operations: newArray, lastResult: null, errors: null, menuOpen:false});
    this.scroll = true;
    this.scrollElement();
    setTimeout(()=>this.setScrollFalse(), 500);
  }

  removeOperation(op){
    this.setState({operations: this.state.operations.filter((e) => e != op)});
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
        <input className="title" type="text" value={this.state.title} onChange={this.handleChange}/>
        <div className="operations" id="operations">
          <ReactCSSTransitionGroup transitionName='opTransition' transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
              {this.state.operations.map((op) => <Operation key={op.id} ref={op.id} operation={op} remove={() => this.removeOperation(op)}/>)}
            {(() => {
              if (this.state.errors) {
                return (<ul className="errors">
                  {this.state.errors.map((e) => <li>{e}</li>)}
                </ul>);
              } else if (this.state.lastResult) {
                return <div className="result">{this.state.lastResult}</div>;
              } else {
                return false;
              }
            })()}
          </ReactCSSTransitionGroup>
        </div>
        <div className="options">
          <div className="buttons">
            <button onClick={() => this.setState({menuOpen: true})}><i className="fa fa-plus"></i></button>
            <button onClick={() => this.computeResult()} className="run"><i className="fa fa-play"></i></button>
          </div>
          <div className={`menu ${this.state.menuOpen ? "open": ""}`}>
            <button onClick={() => this.addToList(new Add())}>ADD</button>
            <button onClick={() => this.addToList(new Sub())}>SUBTRACT</button>
            <button onClick={() => this.addToList(new Value())}>VALUE</button>
            <button onClick={() => this.addToList(new Apply())}>APPLY</button>
          </div>
        </div>
      </div>
    )
  }
}

React.render(<App/>, document.getElementById('app'));
