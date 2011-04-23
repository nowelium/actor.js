actor.js
----

  actor.js: javascript actor
  scala programing style actor

example:
----

  include actor.js:
  ========

    <script type="text/javacript" src="actor.js"></script>

  javascript code:
  ========

    var Foo = function(){
      // the constructor
    };
    Foo.prototype = new Actor();
    Foo.prototype.act = function(actor){
      actor.loop(actor.react(function (message, sender){
        switch(message){
        case 'bar':
          console.log('message bar');
          break;
        case 'baz':
          console.log('message baz');
          break;
        }
      }));
    };

    var foo = new Foo();
    foo.start();

    foo['!']('bar');

  actual scala code:
  ========

    import scala.actors.Actor
    class Foo extends Actor {
      def act() = {
        loop {
          react {
            case 'bar => Console.println("message bar")
            case 'baz => Console.println("message baz")
          }
        }
      }
    }
    
    var foo = new Foo();
    foo.start

    foo ! 'bar

license
----
