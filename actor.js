Function.prototype.bind = function(obj){
  var __method__ = this;
  var __args__ = Array.prototype.slice.call(arguments);
  __args__.shift(); // obj
  return function (){
    var args = Array.prototype.slice.call(arguments);
    return __method__.apply(obj, __args__.concat(args));
  };
};

Function.prototype.curry = function (){
  var __method__ = this;
  var __args__ = Array.prototype.slice.call(arguments);
  return function (){
    var args = Array.prototype.slice.call(arguments);
    return __method__.apply(this, __args__.concat(args));
  };
};

var GlobalActor = new function (){
  var call = function(callback){
    setTimeout(callback, 0);
  };

  var Queue = function (){};
  Queue.prototype.enqueue = function (callback){
    call(callback);
  };

  var AbstractActor = function(){
    this.queue = new Queue();
  };
  AbstractActor.prototype.act = function (){
    throw new Error('override actor');
  };
  AbstractActor.prototype.start = function (){
    this.queue.enqueue((function (){
      this.act.call(this, this);
    }).bind(this));
  };
  AbstractActor.prototype.stop = function (){
    this.queue.enqueue = function (){
      // nop
    };
  };
  this.AbstractActor = AbstractActor;
};

var Actor = function (){
  this.messages = [];
};
Actor.MESSAGE_BANG = 1;
Actor.MESSAGE_BANGBANG = 2;
Actor.MESSAGE_BANGQMARK = 3;
Actor.prototype = new GlobalActor.AbstractActor();
Actor.prototype.loop = function(callback){
  var self = this;
  var loop = function (){
    try {
      callback.apply(self);
      self.queue.enqueue(loop);
    } catch(e) {
      console.error(e);
    }
  };
  self.queue.enqueue(loop);
};
Actor.prototype.performMessage = function(callback){
  // clear reply
  this.reply = function (){};
  // dequeue message
  var message = this.messages.shift();

  switch(message.type){
  case Actor.MESSAGE_BANG:
    // no reply
    return callback.call(this, message.parameter, message.sender);
  case Actor.MESSAGE_BANGBANG:
    // reply async
    this.reply = function(value){
      var partialFunction = message.partialFunction;
      if(!partialFunction){
        partialFunction = function(k){return k};
      }
      var partialResult = partialFunction(value);
      var future = message.future;
      this.queue.enqueue(future.callback.curry(partialResult));
    };
    return callback.call(this, message.parameter, message.sender);
  case Actor.MESSAGE_BANGQMARK:
    throw new Error('not yet supported');
  }
};
Actor.prototype.react = function(callback){
  var self = this;
  return function (){
    if(0 < self.messages.length){
      self.performMessage.apply(self, [callback]);
    }
  };
};
Actor.prototype.receive = function(callback){
  throw new Error('not yet supported');
};
Actor.prototype['!'] = function (_parameter, _sender){
  this.messages.push({
    type: Actor.MESSAGE_BANG,
    parameter: _parameter,
    sender: _sender,
    partialFunction: null,
    future: null
  });
};
Actor.prototype['!!'] = function(_parameter, _partialFunction, _sender){
  var __future__ = function(callback){
    arguments.callee.callback = callback;
  };
  __future__.callback = null;

  this.messages.push({
    type: Actor.MESSAGE_BANGBANG,
    parameter: _parameter,
    sender: _sender,
    partialFunction: _partialFunction,
    future: __future__
  });
  return __future__;
};
Actor.prototype['!?'] = function(parameter){
  throw new Error('not yet supported');
};
