import "./styles.css";
import "whatwg-fetch";
declare var PRODUCTION: Boolean;
declare var GET_DATA_URL: string;
declare var POST_ERROR_URL: string;

class Greeter {
  constructor(public greeting: string) { }
  greet(): string {
    return "<h1>" + this.greeting + "</h1><button onclick='document.greeter.bore()'>Bore me!</button>";
  }

  bore(): void {
    fetch(GET_DATA_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        if (!PRODUCTION) {
          console.log("failed with status: " + response.status);
        } else {
          fetch(POST_ERROR_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ error: "failed with status: " + response.status })
          });
        }
      }
    }).catch((error) => {
      if (!PRODUCTION) {
        console.log(error.message);
      } else {
        fetch(POST_ERROR_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ error: error.message })
        });
      }
    }).then(result => {
      if (result && result.body) {
        document.body.innerHTML = "<h1>" + result.body + "</h1>";
      }
    });
  }
};

const greeter = new Greeter("Hello, world!");
document["greeter"] = greeter;
document.body.innerHTML = greeter.greet();
