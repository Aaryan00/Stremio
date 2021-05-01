import React, { useState, Fragment } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import "./reset_pass.css";

function ChangePassword() {
  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");

  const handleChangepassword = (event) => {
    setpassword(event.currentTarget.value);
  };
  const handleChangecpassword = (event) => {
    setcpassword(event.currentTarget.value);
  };

  var email = localStorage.getItem("email");
  const pass = {
    email: email,
    password: password,
  };

  const Submit = (event) => {
    event.preventDefault();
    if (password !== cpassword) {
      return alert("different password");
    } else {
      axios.post("/api/users/changed", pass).then((response) => {
        if (response.data.success) {
          alert("Password Sucessfully Changed");
          window.location = "/login";
        } else {
          alert("Can't change password");
        }
      });
    }
  };

  return (
    <Fragment>
      <Helmet>
        <title>Stremio | Change Password</title>
      </Helmet>
      <div>
        <div
          style={{
            color: "#292f33",
            fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
            boxSizing: "border-box",
            maxWidth: "590px",
            margin: "0px auto 20px",
            height: "300px",
          }}
          class="container"
        >
          <div class="row" style={{ height: "100%" }}>
            <div
              class="col"
              style={{
                backgroundImage: "linear-gradient(45deg,#f046ff,#9b00e8)",
                borderRadius: "25px",
              }}
            >
              <div
                class="myCtn "
                style={{
                  color: "#292f33",
                  fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
                  padding: "36px 0",
                  backgroundImage: "linear-gradient(45deg,#f046ff,#9b00e8)",
                }}
              >
                <h2
                  class="PageHeader "
                  style={{
                    marginBottom: "36px",
                    fontWeight: "bold",
                    color: "aquamarine",
                  }}
                >
                  Reset your password for Stremio
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
                  Fun-Fact: Strong passwords include numbers, letters, and
                  punctuation marks.
                </p>
                <form
                  style={{
                    color: "#292f33",
                    fontFamily:
                      '"Helvetica Neue", Helvetica, Arial, sans-serif',
                  }}
                  class="Form"
                  onSubmit={Submit}
                >
                  <input
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
                    id="password"
                    onChange={handleChangepassword}
                    class="Form-textbox"
                    type="password"
                    name="password"
                    placeholder="Enter new password"
                    minlength="6"
                    required
                  />
                  <input
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
                    required
                    class="Form-textbox"
                    onChange={handleChangecpassword}
                    type="password"
                    name="confirm_password"
                    placeholder="Confirm new password"
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
                    <br />
                    *Resetting your password will log you out of all your active
                    Stremio sessions.
                  </p>
                  <input
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
                    onSubmit={Submit}
                    type="submit"
                    value="Reset password"
                    class="Buttton EdgeButton--primary EdgeButton btn btn-outline-secondary "
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
export default ChangePassword;
