import React, { useState, Fragment } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import "./forgot_pass.css";

function ForgotPassword() {
  var ootp = 0;
  const [email, setemail] = useState("");

  const handleChangeEmail = (event) => {
    setemail(event.currentTarget.value);
  };

  const variable = {
    email: email,
  };

  const submit = (event) => {
    event.preventDefault();
    // console.log(email);
    axios.post("/api/users/forgot", variable).then((response) => {
      if (response.data.success === true) {
        // alert("User Found");

        const otprandom = 100000 + Math.floor(Math.random() * 900000);
        ootp = otprandom;

        const value = {
          email: email,
          otp: ootp,
        };

        axios.post("/api/users/storeotp", value).then((response) => {
          if (response.data.success) {
            // alert("otp send");

            localStorage.setItem("email", email);
            window.location = "/EnterOtp";
          } else {
            alert("Error, please try again");
          }
        });
      } else {
        alert("Failed to Find user");
      }
    });
  };

  return (
    <Fragment>
      <Helmet>
        <title>Stremio | Forgot Passsword</title>
      </Helmet>

      <div style={{ padding: "1% 4%" }}>
        <div
          style={{
            color: "#292f33",
            fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
            boxSizing: "border-box",
            background: " white",
            maxWidth: " 590px",
            margin: "11% auto 20px",
            height: "300px",
          }}
        >
          <div style={{ height: "100%" }}>
            <div
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
                }}
                className="text-center"
              >
                <h2
                  style={{
                    marginBottom: "36px",
                    fontWeight: "bold",
                    color: "aquamarine",
                  }}
                  class="PageHeader"
                >
                  Find your Stremio account very quickly !!!
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
                  Just enter your email.
                </p>
                <form
                  style={{
                    color: "#292f33",
                    fontFamily:
                      '"Helvetica Neue", Helvetica, Arial, sans-serif',
                  }}
                  class="Form"
                  onSubmit={submit}
                >
                  <input
                    onChange={handleChangeEmail}
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
                      marginRight: "2%",
                    }}
                    type="email"
                    name="email"
                    class="Form-textbox"
                    placeholder="xyz@gmail.com"
                    required=""
                    data-error="We need this information to find your account."
                    autofocus=""
                  />
                  <input
                    style={{
                      font: "inherit",
                      margin: "0 auto",
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
                    type="submit"
                    value="Search..."
                    class="Buttton EdgeButton--primary EdgeButton btn btn-outline-danger "
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ForgotPassword;
