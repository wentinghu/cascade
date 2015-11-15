var lastID = 0;

var NUM = {
  makeString: () => "Num"
}

var NUMARRAY = {
  makeString: () => "Num[]"
}

var FUNC = {
  makeString: () => "Function"
}

var ANY = {
  makeString: () => "*"
}

var NONE = {
  makeString: () => "Void"
}

function range(low, high) {
  return new Array(Math.abs(high-low)+1).join().split(',')
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
  makeString() {
    return `Function(${this.expects.map((e) => e.makeString()).join(', ')})`;
  }
}

export class Add extends Func {
  constructor() {
    super();
    this.expects = [NUM, NUM];
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
    this.name = "subtract";
  } 
  evaluate(stack) {
    stack.push(stack.pop() - stack.pop());
  } 
}

export class RangeTo extends Func {
  constructor() {
    super();
    this.expects = [NUM, NUM];
    this.name = "range to";
  }
  evaluate(stack) {
    var high = stack.pop();
    var low = stack.pop();
    stack.push(range(low, high).join().split(',').map((x,i) => low + i));
  }
}

export class RangeUntil extends Func {
  constructor() {
    super();
    this.expects = [NUM, NUM];
    this.name = "range until";
  }
  evaluate(stack) {
    var high = stack.pop();
    var low = stack.pop();
    stack.push(range(low, high-1).join().split(',').map((x,i) => low + i));
  }
}

export class Map extends Func {
  constructor() {
    super();
    this.expects = [FUNC];
    this.name = "map";
  }
  evaluate(stack) {
    var fn = stack.pop();
    console.log(fn, stack);

    var replacement = stack[stack.length-fn.expects.length].map((x) => {
      var snapshot = stack.slice();
      snapshot.splice(stack.length-fn.expects.length, 1, x);
      fn.evaluate(snapshot);
      return snapshot.pop();
    });
    fn.expects.forEach(() => stack.pop());
    stack.push(replacement);
  }
}

export class Apply extends Operation {
  constructor() {
    super();
    this.expects = [FUNC];
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
  makeString() {
    return `${this.element.state.value}`;
  }
  run(input) {
    var output = input.slice();
    output.push(parseFloat(this.element().state.value));
    return [output, []];
  }
}
