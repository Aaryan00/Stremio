import React, { useState, useEffect } from "react";
import { Avatar, Button, Col, Icon, Typography, Row } from "antd";
import "./UserProfile.css";
import axios from "axios";
const { Title } = Typography;
// const NoThumbnail = require("../../../assets/images/thumbnail.jpg");

class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
    this.fileSelected = this.fileSelected.bind(this);
    this.FileName = " ";
    this.image = props.image;
    this.user = props.user;
  }
  state = {
    reload: false,
  };

  refreshPage = () => {
    this.setState({ reload: true }, () => this.setState({ reload: false }));
  };
  handleSubmit(event) {
    if (this.fileInput.current.files[0]) {
      event.preventDefault();
      let formData = new FormData();
      const config = {
        header: { "content-type": "multipart/form-data" },
      };
      formData.append("file", this.fileInput.current.files[0]);
      const mainuser = window.localStorage.getItem("userId");
      axios
        .put(`/api/users/changeprofile/${mainuser}`, formData, config)
        .then((response) => {
          if (response.data.success) {
            window.location.reload();
          } else {
            // console.log(response);
            // console.log();
            // console.log(response.data.err);
            alert("please upload again");
          }
        });
    } else {
      alert("please select a file!!!");
    }
  }
  fileSelected(event) {
    this.FileName = this.fileInput.current.files[0].name;
    this.refreshPage();
  }
  render() {
    // if (this.user) {
    //   console.log("here");
    // } else {
    //   console.log("there");
    // }
    return (
      <div>
        <form>
          <label for="profile">
            <div className="image">
              <img
                style={{ minHeight: "100px", minWidth: "100px" }}
                className="avatar"
                src={this.image}
                alt="User Profile"
              />
              {this.user ? (
                <div className="icon">
                  <Icon type="camera" theme={"filled"} />
                </div>
              ) : null}
            </div>
          </label>
          {this.user ? (
            <div>
              <input
                type="file"
                id="profile"
                ref={this.fileInput}
                style={{ display: "none" }}
                onChange={this.fileSelected}
              />
              {this.FileName !== " " ? (
                <div>
                  <br />
                  {this.FileName}
                  <br />
                  <Button
                    type="primary"
                    size="small"
                    onClick={this.handleSubmit}
                  >
                    Change Profile
                  </Button>{" "}
                </div>
              ) : null}
              <br />
            </div>
          ) : null}
        </form>
      </div>
    );
  }
}

function UserData(props) {
  const mainuser = window.localStorage.getItem("userId");

  // const [Thumbnail, setThumbnail] = useState("");
  const [Userdata, setdata] = useState([]);
  const [SubscribeNumber, setSubscribeNumber] = useState(0);
  const [SameUser, setSameUser] = useState(0);
  const [Subscribed, setSubscribed] = useState(false);

  let userVariable = {
    profile: props.data.profile,
  };

  let subscribeVariables = {
    userTo: userVariable.profile,
  };

  const onSubscribe = () => {
    // console.log(userFrom);
    // console.log(userTo);
    if (!mainuser) {
      alert("Login First");
    } else {
      let subscribeVariable = {
        userTo: userVariable.profile,
        userFrom: mainuser,
      };

      if (Subscribed) {
        //when we are already subscribed
        axios
          .post("/api/subscribe/unSubscribe", subscribeVariable)
          .then((response) => {
            if (response.data.success) {
              setSubscribeNumber(SubscribeNumber - 1);
              setSubscribed(!Subscribed);
            } else {
              alert("Failed to unsubscribe");
            }
          });
      } else {
        // when we are not subscribed yet

        axios
          .post("/api/subscribe/subscribe", subscribeVariable)
          .then((response) => {
            if (response.data.success) {
              setSubscribeNumber(SubscribeNumber + 1);
              setSubscribed(!Subscribed);
            } else {
              alert("Failed to subscribe");
            }
          });
      }
    }
  };

  useEffect(() => {
    if (mainuser === userVariable.profile) {
      setSameUser(1);
    } else {
      setSameUser(0);
    }

    const subscribeNumberVariables = {
      userTo: userVariable.profile,
      userFrom: mainuser,
    };

    axios
      .post("/api/subscribe/subscribeNumber", subscribeVariables)
      .then((response) => {
        if (response.data.success) {
          setSubscribeNumber(response.data.subscribeNumber);
        } else {
          alert("Failed to get subscriber Number");
        }
      });

    axios
      .post("/api/subscribe/subscribed", subscribeNumberVariables)
      .then((response) => {
        if (response.data.success) {
          setSubscribed(response.data.subcribed);
        } else {
          alert("Failed to get Subscribed Information");
        }
      });

    axios.post("/api/users/getdata", userVariable).then((response) => {
      if (response.data.success) {
        setdata(response.data.user);
      } else {
        alert("failed to get user data");
      }
    });
  }, []);

  const renderdata = Userdata.map((user, index) => {
    return (
      <div
        key={index}
        style={{
          // backgroundImage: "linear-gradient(45deg,#f046ff,#9b00e8)",
          backgroundColor: "#2499f9",
          marginBottom: "4%",
        }}
      >
        <Row gutter={16} style={{ padding: "2% 2% 1%" }}>
          <Col lg={4} sm={12}>
            <div style={{ textAlign: "center" }}>
              <b>
                <FileInput image={user.image} user={SameUser} />
              </b>
            </div>
          </Col>
          <Col lg={6} sm={12} style={{ paddingTop: "2%", textAlign: "center" }}>
            <Title letterSpacing="1" level={2}>
              {user.name}
            </Title>{" "}
          </Col>
          <Col lg={6} sm={6} style={{ paddingTop: "2%", textAlign: "center" }}>
            <p style={{ fontSize: "25px", color: "black" }}>Videos</p>
            <p style={{ fontSize: "25px", color: "black" }}>
              {props.data.Videos}
            </p>
          </Col>
          {SameUser ? (
            <Col
              lg={6}
              sm={6}
              style={{ paddingTop: "2%", textAlign: "center" }}
            >
              <p style={{ fontSize: "25px", color: "black" }}>Subcribers</p>
              <p style={{ fontSize: "25px", color: "black" }}>
                {SubscribeNumber}
              </p>
            </Col>
          ) : (
            <Col
              lg={6}
              sm={6}
              style={{ paddingTop: "2%", textAlign: "center" }}
            >
              <button
                onClick={onSubscribe}
                style={{
                  backgroundColor: `${Subscribed ? "#AAAAAA" : "#CC0000"}`,
                  borderRadius: "4px",
                  color: "white",
                  padding: "10px 16px",
                  fontWeight: "500",
                  fontSize: "1rem",
                  textTransform: "uppercase",
                }}
              >
                {SubscribeNumber} &nbsp;
                {Subscribed ? "Subscribed" : "Subscribe"}
              </button>
            </Col>
          )}
        </Row>
      </div>
    );
  });

  return (
    <div
      style={{
        width: "85%",
        margin: "1rem auto 3rem",
      }}
    >
      {renderdata}
    </div>
  );
}

export default UserData;
