/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Menu, Icon } from "antd";
import axios from "axios";
import { USER_SERVER } from "../../../Config";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";

function RightMenu(props) {
  const user = useSelector((state) => state.user);

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then((response) => {
      if (response.status === 200) {
        localStorage.clear();
        props.history.push("/login");
      } else {
        alert("Log Out Failed");
      }
    });
  };

  const id = window.localStorage.getItem("userId");

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <a className="home-img" style={{ fontWeight: "bold" }} href="/login">
            <Icon
              style={{
                marginRight: "11px",
                fontSize: "24px",
              }}
              type="login"
              theme={"outlined"}
            />
            Login
          </a>
        </Menu.Item>
        <Menu.Item key="app" maxWidth="10%">
          <a
            className="home-img"
            style={{ fontWeight: "bold" }}
            href="/register"
          >
            <Icon
              style={{
                marginRight: "11px",
                fontSize: "24px",
              }}
              type="plus-square"
              theme={"outlined"}
            />
            Register
          </a>
        </Menu.Item>
      </Menu>
    );
  } else {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="user">
          <a
            className="home-img"
            style={{ fontWeight: "bold" }}
            href={`/users/${id}`}
          >
            <Icon
              style={{
                marginRight: "11px",
                fontSize: "24px",
              }}
              type="user"
              theme={"outlined"}
            />
            Profile
          </a>
        </Menu.Item>

        <Menu.Item key="create">
          <a
            className="home-img"
            style={{ fontWeight: "bold" }}
            href="/video/upload"
          >
            <Icon
              style={{
                marginRight: "11px",
                fontSize: "24px",
              }}
              type="video-camera"
              theme={"outlined"}
            />
            Upload
          </a>
        </Menu.Item>
        <Menu.Item key="logout">
          <a
            className="home-img"
            style={{ fontWeight: "bold" }}
            onClick={logoutHandler}
          >
            <Icon
              style={{
                marginRight: "11px",
                fontSize: "24px",
              }}
              type="logout"
              theme={"outlined"}
            />
            Logout
          </a>
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(RightMenu);
