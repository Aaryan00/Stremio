import React from "react";
import Footer from "./../Footer/Footer";
import "./NotFound.css";
function NotFound() {
  return (
    <>
      <div id="notfound">
        <div className="notfound">
          <div className="notfound-404">
            <h3 style={{ color: "dodgerblue", display: "inline" }}>Oops!</h3>
            <h3 style={{ display: "inline" }}>Page not found</h3>
            <h1>
              <span>4</span>
              <span>0</span>
              <span>4</span>
            </h1>
          </div>
          <h2 style={{ fontFamily: "monospace" }}>
            we are sorry, but the page you requested was not found
          </h2>
          <a type="button" class="btn btn-5 btn-5a icon-remove" href="/">
            <span>Home</span>
          </a>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default NotFound;
