import React, { useState, useEffect } from "react";
import LeftMenu from "./Sections/LeftMenu";
import RightMenu from "./Sections/RightMenu";
import { Drawer, Button, Icon } from "antd";
import "./Sections/Navbar.css";

const suggest = require("suggestion");
const Logo = require("../../../assets/images/Stremio.png");

function NavBar(props) {
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const handleChange = (e) => {
    // console.log(e.type);
    setSearchQuery(e.currentTarget.value);
    suggest(
      e.currentTarget.value,
      { client: "youtube" },
      function (err, suggestions) {
        if (err) throw err;
        setData(suggestions);
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Query to search : ", searchQuery);
    window.location = `/search/${searchQuery}`;
  };

  useEffect(() => {
    const path = window.location.pathname.split("/");
    if (path[1] === "search") {
      setSearchQuery(
        decodeURIComponent(window.location.pathname.split("/")[2])
      );
    }
  }, []);

  return (
    <nav
      className="menu"
      style={{
        position: "fixed",
        zIndex: 50,
        width: "100%",
        boxShadow: "0px 3px 10px 0px #888888",
        // paddingTop: "8px",
        top: 0,
      }}
    >
      <div className="menu__logo">
        <a href="/">
          <img
            src={Logo}
            alt="Logo"
            style={{ width: "100%", marginTop: "-5px" }}
          />
        </a>
      </div>
      <div className="menu__container">
        <div className="menu_left">
          <LeftMenu mode="horizontal" />
        </div>
        <form
          onSubmit={handleSubmit}
          style={{ margin: "0", padding: "0", display: "inline" }}
        >
          <div className="autocomplete">
            <input
              id="myInput"
              type="text"
              name="search"
              list="data"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleChange}
              autoComplete="off"
            ></input>
            <datalist id="data">
              {data.map((item, key) => (
                <option key={key} value={item} />
              ))}
            </datalist>

            <span className="search" onClick={handleSubmit}>
              <Icon
                style={{
                  marginBottom: "4px",
                  fontSize: "20px",
                }}
                type="search"
                theme={"outlined"}
              />
            </span>
          </div>
        </form>

        <div className="menu_rigth">
          <RightMenu mode="horizontal" />
        </div>
        <Button
          className="menu__mobile-button"
          type="primary"
          onClick={showDrawer}
        >
          <Icon type="align-right" />
        </Button>
        <Drawer
          title="Menu Bar"
          placement="right"
          className="menu_drawer"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <RightMenu mode="inline" />
          <LeftMenu mode="inline" />
        </Drawer>
      </div>
    </nav>
  );
}

export default NavBar;
