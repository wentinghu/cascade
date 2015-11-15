import React from 'react/addons';
import Operation from './operations.jsx';
import {
  Add,
  Sub,
  Value,
  RangeTo,
  RangeUntil,
  Apply,
  Map
} from './Operation.js';


var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var lastID = 0;
export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.procedure || "New Procedure",
      operations: [],
      lastResult: null,
      errors: null,
      menuOpen: false
    }
    this.scroll = false;
  }

  componentWillMount(){
    if(this.props.operations){
      var newArray = this.state.operations.slice();
      this.props.operations.forEach((op) => {
        var el = <Operation key={op.id} ref={op.id} operation={op} remove={() => this.removeOperation(op)}/>;
        op.element = () => this.refs[op.id];
        this.setState({operations: newArray, lastResult: null, errors: null, menuOpen:false});
        newArray.push(op);
      });
      this.setState({operations: newArray, lastResult: null, errors: null, menuOpen:false});
    }
  }

  computeResult() {
    var [output, e] = this.state.operations.reduce((last, operation) => {
      var [stack, errors] = last;
      var [newStack, newErrors] = operation.run(stack);
      return [newStack, errors.concat(newErrors)];
    }, [[], []]);

    this.scroll = true;
    this.scrollElement();
    setTimeout(()=>this.setScrollFalse(), 500);

    var res;
    if (e.length > 0) {
      this.setState({errors: e});
      return;
    } else if (output.length == 0) {
      res = "Nothing";
    } else if (output.length == 1) {
      res = output[0].makeString ? output[0].makeString() : `${output[0]}`;
    } else {
      res = `(${output.map((e) => e.makeString ? e.makeString() : e).join(", ")})`;
    }
    this.setState({lastResult: res});
  }

  stringify(e) {
    if (e instanceof Array) {
      return `[${e.join(", ")}]`;
    } else {
      return `${Math.round(e*1000)/1000}`;
    }
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
    this.props.save(this.state.title, newArray);
  }

  removeOperation(op){
<<<<<<< HEAD
    this.setState({operations: this.state.operations.filter((e) => e != op)});
    this.props.save(this.state.title, this.state.operations);
=======
    this.setState({operations: this.state.operations.filter((e) => e != op), lastResult: null});
>>>>>>> origin/master
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
        <div className="operations">
          <ReactCSSTransitionGroup transitionName='opTransition' transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
              {this.state.operations.map((op) => <Operation key={op.id} ref={op.id} operation={op} remove={() => this.removeOperation(op)}/>)}
            {(() => {
              if (this.state.errors) {
                return (<ul key="errors" className="errors">
                  {this.state.errors.map((e) => <li>{e}</li>)}
                </ul>);
              } else if (this.state.lastResult) {
                return <div key="result" className="operationwrapper"><div className="result">{this.state.lastResult}</div></div>;
              } else {
                return false;
              }
            })()}
          </ReactCSSTransitionGroup>
        </div>
        <div className="options">
          <div className={`buttons ${this.state.menuOpen ? "menuOpen": ""}`}>
            <button onClick={() => this.setState({menuOpen: !this.state.menuOpen})} className="openMenu"><i className={`fa fa-${this.state.menuOpen ? "minus" : "plus"}`}></i></button>
            <button onClick={() => this.computeResult()} className="run"><i className="fa fa-play"></i></button>
          </div>
          <div className={`menu ${this.state.menuOpen ? "open": ""}`}>
            <div className="column full">
              <button className="with" onClick={() => this.addToList(new Value())}>VALUE</button>
              <button className="apply" onClick={() => this.addToList(new Apply())}>APPLY</button>
            </div>
            <div className="column">
              <button className="do" onClick={() => this.addToList(new Add())}>ADD</button>
              <button className="do" onClick={() => this.addToList(new Sub())}>SUBTRACT</button>
              <button className="do" onClick={() => this.addToList(new RangeTo())}>RANGE TO</button>
              <button className="do" onClick={() => this.addToList(new RangeUntil())}>RANGE UNTIL</button>
              <button className="do" onClick={() => this.addToList(new Map())}>MAP</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
