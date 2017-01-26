import "./styles.css";
import "whatwg-fetch";
import BoreMore from "./bore-more.js";

class Greeter {
  constructor(public greeting: string) { }
  greet(): string {
    return "<h1>" + this.greeting + "</h1><button onclick='document.greeter.bore()'>Bore me!</button>";
  }

  bore(): void {
    fetch("https://jsonplaceholder.typicode.com/posts/2", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        console.log("failed with status: " + response.status);
      }
    }).catch((error) => {
      console.log(error.message);
    }).then(result => {
      if (result && result.body) {
        document.body.innerHTML = "<h1>" + result.body + "</h1><button onclick='document.moreBoring.getMoreBoring()'>Bore me more!</button>";
      }
    });
  }
};

const greeter = new Greeter("Hello, world!");
const moreBoring = new BoreMore();
document["greeter"] = greeter;
document["moreBoring"] = moreBoring;
document.body.innerHTML = greeter.greet();
