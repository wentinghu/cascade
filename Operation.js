var lastID = 0;

var NUM = {
  toString: () => "Num"
}

var FUNC = {
  toString: () => "Function"
}

var ANY = {
  toString: () => "*"
}


class Operation {
  constructor() {
    this.id = ++lastID;
  }
  get element() {
    return this._element;
  }
  set element(el) {
    this._element = el;
  }
  run(input) {
    return [input, "This is not implemented yet :("];
  }
}

class Func extends Operation {
  constructor() {
    super();
    this.type = "do";
  }
  run(input) {
    var output = input.slice();
    output.push(this);
    return [output, []];
  }
  toString() {
    return `(${this.expects.map((e) => e.toString()).join(', ')})` +
      " => " +
      `(${this.returns.map((e) => e.toString()).join(', ')})`;
  }
}

export class Add extends Func {
  constructor() {
    super();
    this.expects = [NUM, NUM];
    this.returns = [NUM];
    this.name = "add";
  } 
  evaluate(stack) {
    stack.push(stack.pop() + stack.pop());
  }
}

export class Sub extends Func {
  constructor() {
    super();
    this.expects = [NUM, NUM];
    this.returns = [NUM];
    this.name = "subtract";
  } 
  evaluate(stack) {
    stack.push(stack.pop() - stack.pop());
  } 
}

export class Apply extends Operation {
  constructor() {
    super();
    this.expects = [FUNC];
    this.returns = [ANY];
    this.type = "apply";
  }
  run(input) {
    var output = input.slice();
    output.pop().evaluate(output);
    return [output, []];
  }
}

export class Value extends Operation {
  constructor() {
    super();
    this.type = "with";
    this.name = "value";
  } 
  toString() {
    return `${this.element.state.value}`;
  }
  run(input) {
    var output = input.slice();
    output.push(this.element().state.value);
    return [output, []];
  }
}
