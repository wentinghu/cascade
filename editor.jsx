import React from 'react/addons';
import Operation from './operations.jsx';
import {
  Add,
  Proc,
  Sub,
  Mult,
  Div,
  Value,
  RangeTo,
  RangeUntil,
  Apply,
  Map,
  Insert,
  Sum,
  Product,
  Power
} from './Operation.js';
var defaultOperations = [Add, Sub, Mult, Div, RangeTo, RangeUntil, Map, Insert, Sum, Product, Power]
var _ = require("lodash");


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
    var [output, e] = _.flattenDeep(
      this.state.operations.map((operation) => {
        return operation.expand();
      })
    ).reduce((last, operation) => {
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
    this.props.save(e.target.value, this.state.operations, this.state.title);
  }

  addToList(op){
    var el = <Operation key={op.id} ref={op.id} operation={op} remove={() => this.removeOperation(op)}/>;
    op.element = () => this.refs[op.id];
    op.state = this.refs[op.id];
    var newArray = this.state.operations.slice();
    newArray.push(op);
    this.setState({operations: newArray, lastResult: null, errors: null, menuOpen:false});
    this.props.save(this.state.title, newArray, "");
    this.scroll = true;
    this.scrollElement();
    setTimeout(()=>this.setScrollFalse(), 500);
  }

  removeOperation(op){
    this.setState({operations: this.state.operations.filter((e) => e != op), lastResult: null});

    this.props.save(this.state.title, this.state.operations.filter((e) => e != op), "");
    this.setState({lastResult: null});
  }

  setScrollFalse() {
    this.scroll = false;
  }

  getClassName(name){
    var size = this.props.procs()[name].length;  
    console.log("LOOK AT THIS");
    if(this.props.procs()[name][size - 1].name == "apply"){
      return "subroutine";
    }else{
      return "function";
    }
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

  getProcedure(name) {
    return this.props.procs()[name];
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
              {_.map(
                _.pick(
                  this.props.procs(),
                  (v,k) => k != this.props.procedure
                ),
                (p,name) => {
                  return(
                    <button className={this.getClassName(name)} onClick={() => this.addToList(new Proc(name, ()=>this.getProcedure(name), ()=>this.getClassName(name)))}>
                      {name.toUpperCase()}
                    </button>
                  );
                }
              )}
            </div>
            <div className="column">
              {defaultOperations.map((op) => {
                return(
                  <button className="do" onClick={() => this.addToList(new op())}>
                    <div className="functionName">{op.label.toUpperCase()}</div>
                    <div>{op.helpString()}</div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
