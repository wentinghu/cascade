var _ = require('lodash');

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
    this.expects = this.constructor.expects;
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

export class Proc extends Operation {
  constructor(name, get) {
    super();
    this.name = name;
    this.get = get;
    this.type = "do user";
  }
  run(input) {
    var output = input.slice();
    var procs = this.get();
    procs.forEach((p) => p.run(output));
    return [output, []];
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
Func.helpString = function(){
  return `Function(${this.expects.map((e) => e.makeString()).join(', ')})`;
}


export class Add extends Func {
  constructor() {
    super();
    //this.expects = [NUM, NUM];
    this.name="add";
  } 
  evaluate(stack) {
    stack.push(stack.pop() + stack.pop());
  }
}
Add.expects = [NUM, NUM];
Add.label = "add";

export class Sub extends Func {
  constructor() {
    super();
    //this.expects = [NUM, NUM];
    this.name="subtract";
  } 
  evaluate(stack) {
    stack.push(stack.pop() - stack.pop());
  } 
}
Sub.expects = [NUM, NUM];
Sub.label = "subtract";

export class Mult extends Func {
  constructor(){
    super();
    //this.expects = [NUM, NUM];
    this.name="multiply";
  }
  evaluate(stack) {
    stack.push(stack.pop() * stack.pop());
  }
}
Mult.expects = [NUM, NUM];
Mult.label = "multiply";

export class Div extends Func {
  constructor(){
    super();
    //this.expects = [NUM, NUM];
    this.name="divide";
  }
  evaluate(stack) {
    var divisor = stack.pop();
    var dividend = stack.pop();
    stack.push(dividend / divisor);
  }
}
Div.expects = [NUM, NUM];
Div.label = "divide";


export class Insert extends Func {
  constructor() {
    super();
    //this.expects = [FUNC];
    this.name="insert";
  }
  evaluate(stack){
    var toInsert = stack.pop();
    var array = stack.pop();
    var newArray = array.slice();
    newArray.push(toInsert);
    stack.push(newArray);
  }
}
Insert.expects = [FUNC];
Insert.label = "insert";

export class RangeTo extends Func {
  constructor() {
    super();
    //this.expects = [NUM, NUM];
    this.name="range to";
  }
  evaluate(stack) {
    var high = stack.pop();
    var low = stack.pop();
    stack.push(range(low, high).join().split(',').map((x,i) => low + i));
  }
}
RangeTo.expects = [NUM, NUM];
RangeTo.label = "range to";

export class RangeUntil extends Func {
  constructor() {
    super();
    //this.expects = [NUM, NUM];
    this.name="range until";
  }
  evaluate(stack) {
    var high = stack.pop();
    var low = stack.pop();
    stack.push(range(low, high-1).join().split(',').map((x,i) => low + i));
  }
}
RangeUntil.expects = [NUM, NUM];
RangeUntil.label = "range until";

export class Map extends Func {
  constructor() {
    super();
    this.name="map";
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
Map.expects = [FUNC];
Map.label = "map";

export class Sum extends Func {
  constructor() {
    super();
    //this.expects = [FUNC];
    this.name="sum";
  }
  evaluate(stack) {
    var array = stack.pop();
    var sum = 0;
    for(var i = 0; i < array.length; i++){
      sum += array[i];
    }
    stack.push(sum);

  }
}
Sum.expects = [FUNC];
Sum.label = "sum";

export class Product extends Func {
  constructor() {
    super();
    //this.expects = [FUNC];
    this.name="product";
  }
  evaluate(stack) {
    var array = stack.pop();
    var product = 1;
    for(var i = 0; i < array.length; i++){
      product *= array[i];
    }
    stack.push(product);

  }
}
Product.expects = [FUNC];
Product.label = "product";

export class Power extends Func {
  constructor() {
    super();
    //this.expects = [FUNC];
    this.name="power";
  }
  evaluate(stack) {
    var exp = stack.pop();
    var base = stack.pop();
    
    stack.push(Math.pow(base, exp));

  }
}
Power.expects = [FUNC];
Power.label = "power";


export class Apply extends Operation {
  constructor() {
    super();
    //this.expects = [FUNC];
    this.type = "apply";
    this.name = "apply"
  }
  run(input) {
    var output = input.slice();
    output.pop().evaluate(output);
    return [output, []];
  }
}
Apply.expects = [FUNC];
Apply.label = "apply";

export class Value extends Operation {
  constructor() {
    super();
    this.type = "with";
    this.name="value";
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
Value.label = "value";
