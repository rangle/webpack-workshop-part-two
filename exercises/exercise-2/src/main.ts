import "./styles.css";

class Greeter {
  constructor(public greeting: string) { }
  greet() : string {
    return "<h1>" + this.greeting + "</h1>";
  }
};

const greeter = new Greeter("Hello, world!");

document.body.innerHTML = greeter.greet();
