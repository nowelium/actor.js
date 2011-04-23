var Foo = function (){};
Foo.prototype = new Actor();
Foo.prototype.act = function (actor){
  actor.loop(actor.react(function (message){
    console.log(message.msg);
    actor.reply(message.msg);
  }));
};

var foo = new Foo();
foo.start();
foo['!']({msg: 'msg1'});
var f = foo['!!']({msg: 'msg2'}, function (returnValue){
  return returnValue + ', partial';
});
f(function(result){
  console.log(result);
  foo.stop();
});
