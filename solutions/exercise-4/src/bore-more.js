import "whatwg-fetch";

class BoreMore {
  getMoreBoring() {
    fetch("https://jsonplaceholder.typicode.com/posts/3", {
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
        document.body.innerHTML = "<h1>" + result.body + "</h1>";
      }
    });
  }
}

export default BoreMore;