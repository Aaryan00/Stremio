import React from "react";
import { Menu, Icon } from "antd";

function LeftMenu(props) {
  return (
    <Menu mode={props.mode}>
      <Menu.Item key="mail">
        <a className="home-img" style={{ fontWeight: "bold" }} href="/" >
          <Icon
            style={{ 
              marginRight: "11px",
              fontSize: "24px"
          }}
          type="home"
          theme={ 'outlined'}
          />
          Home
        </a>
      </Menu.Item>
      <Menu.Item key="subscription">
        <a
          className="home-img"
          style={{ fontWeight: "bold" }}
          href="/subscription"
        >
          <Icon
            style={{ 
              marginRight: "11px",
              fontSize: "24px"
          }}
          type="wallet"
          theme={ 'outlined'}

          />
          Subscription
        </a>
      </Menu.Item>
    </Menu>
  );
}

export default LeftMenu;