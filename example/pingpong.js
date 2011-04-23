//
// PingPong:
// http://www.scala-lang.org/node/54
//

var MSG_Start = 1;
var MSG_SendPing = 2;
var MSG_Pong = 3;
var MSG_Ping = 4;
var MSG_Stop = 5;

var Ping = function(count, pong) {
  this.count = count;
  this.pong = pong;
};
Ping.prototype = new Actor();
Ping.prototype.toString = function (){
  return 'Ping[count: ' + this.count + ', pong: ' + this.pong + ']';
};
Ping.prototype.act = function(actor){
  console.log('Ping initializing with count:' + this.count + ': ' + this.pong);
  var pingsLeft = this.count;
  actor.loop(actor.react(function(message, sender){
    switch(message){
    case MSG_Start:
      console.log('Ping:start');
      this.pong['!'](MSG_Ping, this);
      pingsLeft = pingsLeft - 1;
      break;
    case MSG_SendPing:
      this.pong['!'](MSG_Ping, this);
      pingsLeft = pingsLeft - 1;
      break;
    case MSG_Pong:
      if(0 === (pingsLeft % 1000)){
        console.log('Ping pong from: ' + sender);
      }
      if(0 < pingsLeft){
        this['!'](MSG_SendPing, this);
      } else {
        console.log('Ping Stop');
        this.pong['!'](MSG_Stop, this);
        this.stop();
      }
      break;
    }
  }));
};
var Pong = function (){};
Pong.prototype = new Actor();
Pong.prototype.toString = function (){
  return '[Pong]';
};
Pong.prototype.act = function(actor){
  var pongCount = 0;
  actor.loop(actor.react(function(message, sender){
    switch(message){
    case MSG_Ping:
      if(0 === (pongCount % 1000)){
        console.log('Pong ping:' + pongCount + ' from ' + sender);
      }
      sender['!'](MSG_Pong, this);
      pongCount = pongCount + 1;
      break;
    case MSG_Stop:
      console.log('Pong Stop');
      this.stop();
      break;
    }
  }));
};

var pong = new Pong();
var ping = new Ping(100000, pong);

ping.start();
pong.start();

ping['!'](MSG_Start);
