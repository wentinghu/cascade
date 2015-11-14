import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {title: "New Procedure"}
  }
  render() { 
    return (
      <div>
        <input type="text" value={this.state.title} />
      </div>
    )
  }
}

React.render(<App/>, document.getElementById('app'));
