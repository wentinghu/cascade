import React from 'react/addons';
import Operation from './operations.jsx';
import Editor from './editor.jsx'
import {
  Add,
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
  Power,
  Proc
} from './Operation.js';

var _= require('lodash');
var storage = localStorage;

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      procedures: storage.length !== 0 ? this.parseProcs(storage.getItem("procs")) : {Test: [new Value(), new Value(), new Add(), new Apply()]},
      editing: null
    };
  } 

  getClassName(name) {
    var size = this.state.procedures[name].length;  
    if(this.state.procedures[name][size - 1].name == "apply"){
      return "subroutine";
    }else{
      return "function";
    }
  }

  save(newTitle, operations, oldTitle){
    var duplicate = _.clone(this.state.procedures);
    duplicate[newTitle] = operations;
    console.log("AFTER");
    console.log(operations);
    if(oldTitle != ""){
      console.log("THIS SHOULDNT BE HAPPENING");
      delete duplicate[oldTitle];
    }
    this.setState({procedures: duplicate});
    this.saveProcs(duplicate);
  }

  confirmDelete(proc){
    var agree=confirm("Are you sure you want to delete this file?");
    if (agree)
         this.removeProcedure(proc);
  }

  removeProcedure(proc){
    var duplicate = _.clone(this.state.procedures);
    delete duplicate[proc];
    this.setState({procedures: duplicate});
    this.saveProcs(duplicate);
  }

  saveProcs(procs) {
    var stripped = {};
    for (var name in procs) {
      stripped[name] = procs[name].map((op) => op.serialize());
    }
    storage.setItem("procs", JSON.stringify(stripped));
  }

  parseProcs(str) {
    var stripped = JSON.parse(str);
    var procs = {};
    for (var name in stripped) {
      procs[name] = stripped[name].map((op) => {
        switch (op.className) {
          case "proc":
            return new Proc(op.name, ()=>this.state.procedures[op.name], ()=>this.getClassName(op.name));
          case "add":
            return new Add();
          case "subtract":
            return new Sub();
          case "multiply":
            return new Mult();
          case "divide":
            return new Div();
          case "insert":
            return new Insert();
          case "range to":
            return new RangeTo();
          case "range until":
            return new RangeUntil();
          case "map":
            return new Map();
          case "sum":
            return new Sum();
          case "product":
            return new Product();
          case "power":
            return new Power();
          case "apply":
            return new Apply();
          case "value":
            var v = new Value();
            v.value = op.value;
            return v;
          default:
            alert(`Unknown class name: ${op.className}`);
        }
      });
    }
    return procs;
  }

  loadProcedure(proc){
    this.setState({editing: proc});
  }

  returnToProcedures(){
    this.setState({editing: null});
  }

  createNewProc(){
    var i = 1;
    for(i = 1; this.state.procedures["New Procedure" + i]; i++){
    }
    this.setState({editing: "New Procedure" + i});
  }

  getProcs() {
    return this.state.procedures;
  }

  render() { 
    if(this.state.editing){
        return (
          <div>
            <Editor 
              procs={() => this.getProcs()}
              getClassName={(name) => this.getClassName(name)}
              procedure={this.state.editing}
              operations={this.state.procedures[this.state.editing]}
              save={(a, b, c) => this.save(a,b, c)}
              renameProcedure = {(a, b) => this.renameProcedure(a, b)}
            />
            <button
              className="backButton" 
              onClick={() => this.returnToProcedures()}
            >
              <i className="fa fa-arrow-left"></i>
            </button>
          </div>
        )
    }else{
      return(
        <div className="app">
          <div className="header">
            <h1>cascade</h1>
          </div>
          <div className="procedures">
          <div className="procedureswrapper">
            <ReactCSSTransitionGroup transitionName='opTransition' transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
              {_.map(this.state.procedures, (proc, name) => {
                return <div className="procedure"><button className="procedureName" onClick={() => this.loadProcedure(name)}>{name}</button><button className="delete" onClick={() => this.confirmDelete(name)}><i className="fa fa-times"></i></button></div>
              })}
            </ReactCSSTransitionGroup>
          </div>
          </div>
          <div className="buttons">
            <button onClick={() => this.createNewProc()}><i className="fa fa-plus"></i></button>
          </div>
        </div>
      )
    }
  }
}

React.render(<App/>, document.getElementById('app'));
