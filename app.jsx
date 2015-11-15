import React from 'react/addons';
import Operation from './operations.jsx';
import Editor from './editor.jsx'
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

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      procedures: [{name: "Test", operations:[new Add(), new Sub(), new Apply()]}],
      editing: null
    };
  } 

  handleChange(e){
    this.setState({title: e.target.value});
  }

  confirmDelete(proc){
    var agree=confirm("Are you sure you want to delete this file?");
    if (agree)
         this.removeProcedure(proc);
  }

  removeProcedure(proc){
    this.setState({procedures: this.state.procedures.filter((e) => e != proc)});
  }

  loadProcedure(proc){
    this.setState({editing: proc});
  }

  returnToProcedures(){
    this.setState({editing: null});
  }

  render() { 
    if(this.state.editing){
        return <div><Editor procedure={this.state.editing}/><button onClick={() => this.returnToProcedures()}>Back</button></div>
    }else{
      return(
        <div className="app">
          <h1>cascade</h1>
          <div className="procedures">
            <ReactCSSTransitionGroup transitionName='opTransition' transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
              {this.state.procedures.map((proc) => <div className="procedure"><button onClick={() => this.loadProcedure(proc)}>{proc.name}</button><button onClick={() => this.confirmDelete(proc)}>remove</button></div>)}
            </ReactCSSTransitionGroup>
          </div>
          <div className="buttons">
            <button onClick={() => this.createNewProc({menuOpen: true})}><i className="fa fa-plus"></i></button>
          </div>
        </div>
      )
    }
  }
}

React.render(<App/>, document.getElementById('app'));
