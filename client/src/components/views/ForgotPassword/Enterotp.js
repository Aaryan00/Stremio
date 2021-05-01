import React, { useState, Fragment } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import "./password_otp.css";

function Enterotp() {
  var email = localStorage.getItem("email");
  // console.log(localStorage.getItem('email'));

  const [userotp, setuserotp] = useState("");

  const handlechangeotp = (event) => {
    setuserotp(event.currentTarget.value);
    // console.log(userotp);
  };

  const handleSubmit = (event) => {
    const variable = {
      email: email,
      otp: userotp,
    };
    // console.log(variable);
    event.preventDefault();

    axios.post("/api/users/otp", variable).then((response) => {
      if (response.data.success === true) {
        window.location = "/changePassword";
      } else {
        alert("Invalid Otp!!!");
      }
    });
  };

  return (
    <Fragment>
      <Helmet>
        <title>Stremio | Enter Otp</title>
      </Helmet>
      <div
        className="container"
        style={{
          color: "#292f33",
          fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
          boxSizing: "border-box",
          maxWidth: "590px",
          margin: "0px auto 20px",
          height: "300px",
        }}
      >
        <div className="row" style={{ height: "100%" }}>
          <div
            className="col"
            style={{
              backgroundImage: "linear-gradient(45deg,#f046ff,#9b00e8)",
              borderRadius: "25px",
            }}
          >
            <div
              style={{
                color: "#292f33",
                fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
                padding: "36px 0",
                backgroundImage: "linear-gradient(45deg,#f046ff,#9b00e8)",
              }}
              class="myCtn "
            >
              <h2
                style={{
                  marginBottom: "36px",
                  fontWeight: "bold",
                  color: "aquamarine",
                }}
              >
                -- Kindly check your email --
              </h2>
              <p
                style={{
                  color: "aquamarine",
                  fontWeight: " 20px",
                  fontFamily: "sans-serif",
                  fontSize: "16px",
                  lineHeight: "18px",
                }}
              >
                You'll receive a code to verify here so you can reset your
                account password.
              </p>
              <form
                style={{
                  color: "#292f33",
                  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                }}
                class="Form"
                onSubmit={handleSubmit}
              >
                <input
                  onChange={handlechangeotp}
                  type="text"
                  name="pin"
                  style={{
                    font: "inherit",
                    width: "300px",
                    lineHeight: "20px",
                    outline: "0",
                    fontSize: " 16px",
                    margin: "5px 10px 5px 0",
                    color: "#292f33",
                    boxShadow: " 0 0 0 1px #292f33",
                    border: " 0.25px none #292f33",
                    borderRadius: "18px",
                    padding: "7px 15px 5px",
                  }}
                  placeholder="Enter your code"
                  autofocus
                  required
                  data-error="We need this information to reset your password."
                />
                <p
                  style={{
                    color: "aquamarine",
                    fontWeight: " 20px",
                    fontFamily: "sans-serif",
                    fontSize: "16px",
                    lineHeight: "18px",
                  }}
                >
                  <span
                    style={{
                      color: "aquamarine",
                      fontWeight: "20px",
                      fontFamily: "sans-serif",
                      fontSize: "13px",
                      lineHeight: "18px",
                    }}
                  >
                    *Your OTP will expire in Ten minutes.
                  </span>
                </p>
                <input
                  type="submit"
                  onSubmit={handleSubmit}
                  style={{
                    font: "inherit",
                    margin: "0",
                    outline: "0",
                    borderRadius: " 100px",
                    boxShadow: "none",
                    fontSize: "16px",
                    fontWeight: "bold",
                    lineHeight: " 20px",
                    padding: "6px 16px",
                    position: "relative",
                    textAlign: "center",
                    whiteSpace: " nowrap",
                    border: " none",
                    color: " #fff",
                    cursor: "pointer",
                    display: "block",
                    marginTop: "25px",
                    marginBottom: "25px",
                  }}
                  value="Verify"
                  class="Button Buttton EdgeButton--primary EdgeButton btn btn-outline-secondary "
                />
              </form>
              <p>
                Wait for 5 mins for the Email, after then also If you don't see
                the email, check other places it might be, like your junk, spam,
                social, or other folders.
              </p>
              <div className="aaa">
                {/* <a
                style={{
                  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
                href="#"
              >
                Didn’t receive your code? Send again.
              </a> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Enterotp;
