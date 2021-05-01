import React, { useEffect, useState, Fragment } from "react";
import { Card, Tooltip, Avatar, Col, Typography, Row } from "antd";
import axios from "axios";
import moment from "moment";
import { Helmet } from "react-helmet";
import NotFound from "./../NotFound/NotFound";
import Footer from "../Footer/Footer";
const { Title } = Typography;
const { Meta } = Card;
const Loader = require("../../../assets/images/loader.gif");
const NoThumbnail = require("../../../assets/images/thumbnail.jpg");

function SubscriptionPage() {
  const [Videos, setVideos] = useState([]);
  const [Load, setLoad] = useState([]);
  const [UserData, setUserData] = useState([]);
  const [Reload, setState] = useState(false);
  const [Wrong, setWrong] = useState(false);

  let variable = { profile: localStorage.getItem("userId") };

  const savevideo = (event) => {
    setState(false);
    let user1 = UserData;
    let nameOfClass = event.currentTarget.className;
    const videoid = {
      _id: window.localStorage.getItem("userId"),
      video: event.currentTarget.id,
    };
    // console.log(videoid);
    if (nameOfClass === "far fa-bookmark ant-tooltip-open") {
      axios.post("/api/video/savevideo", videoid).then((response) => {
        if (response.data.success) {
          user1[0].saved.push(videoid.video);
          setUserData(user1);
          setState(true);
        } else {
          alert("failed to Save video");
          window.location.reload();
        }
      });
    } else {
      axios.post("/api/video/unsavevideo", videoid).then((response) => {
        if (response.data.success) {
          user1[0].saved.splice(user1[0].saved.indexOf(videoid.video), 1);
          setUserData(user1);
          setState(true);
        } else {
          alert("failed to unsave video");
          window.location.reload();
        }
      });
    }
  };

  useEffect(() => {
    axios
      .post("/api/video/getSubscriptionVideos", variable)
      .then((response) => {
        if (response.data.success) {
          setLoad(false);
          setVideos(response.data.videos);
        } else {
          alert("Failed to get subscription videos");
        }
      })
      .catch(() => {
        setWrong(true);
      });

    axios
      .post("/api/users/getdata", variable)
      .then((response) => {
        if (response.data.success) {
          setUserData(response.data.user);
        } else {
          alert("failed to get user data");
        }
      })
      .catch(() => {
        setWrong(true);
      });

    setState(false);
  }, []);

  if (!Load) {
    const renderCards = Videos.map((video, index) => {
      var minutes = Math.floor(video.duration / 60);
      var seconds = Math.floor(video.duration - minutes * 60);

      return (
        <Col lg={6} md={8} xs={24} key={index}>
          <div
            style={{
              backgroundColor: "rgb(176,224,230,0.3)",
              marginBottom: "5%",
              marginTop: "4%",
            }}
          >
            <div style={{ position: "relative" }}>
              <a href={`/video/${video._id}`}>
                <img
                  style={{
                    width: "100%",
                    height: "205.984px",
                    maxwidth: "274.656px",
                    maxHeight: "205.984px",
                  }}
                  alt="thumbnail"
                  src={`${video.thumbnail}`}
                  onError={(e) => {
                    e.target.src = NoThumbnail;
                  }}
                />
                <div
                  className=" duration"
                  style={{
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    margin: "4px",
                    color: "#fff",
                    backgroundColor: "rgba(17, 17, 17, 0.8)",
                    opacity: 0.8,
                    padding: "2px 4px",
                    borderRadius: "2px",
                    letterSpacing: "0.5px",
                    fontSize: "12px",
                    fontWeight: "500",
                    lineHeight: "12px",
                  }}
                >
                  <span>
                    {minutes} : {seconds}
                  </span>
                </div>
              </a>
            </div>
            <br />
            <div style={{ paddingBottom: "2%", paddingLeft: "2%" }}>
              <a
                href={`/users/${video.writer._id}`}
                style={{ textDecoration: "none", color: "#000000A6" }}
              >
                <Meta
                  avatar={<Avatar src={video.writer.image} />}
                  title={video.title.substr(0, 15)}
                />
                <span>{video.writer.name} </span>
              </a>
              <br />
              <b>
                <Tooltip title="Save">
                  <i
                    className={
                      UserData[0].saved.includes(video._id)
                        ? "fas fa-bookmark"
                        : "far fa-bookmark"
                    }
                    style={{
                      fontSize: "18px",
                      float: "right",
                      margin: "-45px 10px 0px 0px",
                      cursor: "pointer",
                    }}
                    id={video._id}
                    onClick={savevideo}
                  />
                </Tooltip>
              </b>
              <span style={{ marginLeft: "3rem" }}> {video.views}</span>
              &nbsp;views&nbsp;|{" "}
              <span> {moment(video.createdAt).format("MMM Do YY")} </span>
            </div>
          </div>
        </Col>
      );
    });

    return (
      <Fragment>
        <Helmet>
          <title>Stremio | Subscribed</title>
        </Helmet>
        <div style={{ width: "85%", margin: "1rem auto 3rem" }}>
          <Title level={2}> Subscribed Videos </Title>
          <hr />

          <Row gutter={16}>{renderCards}</Row>
        </div>
        {/* <Footer /> */}
      </Fragment>
    );
  } else {
    if (Wrong) {
      return (
        <Fragment>
          <Helmet>
            <title> Stremio | User Profile</title>
          </Helmet>
          <NotFound />
          <Footer />
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <Helmet>
            <title> Stremio | User Profile</title>
          </Helmet>
          <div
            style={{
              textAlign: "center",
              left: "50%",
              height: "480px",
              paddingTop: "12%",
              fontSize: "2rem",
            }}
          >
            <img src={Loader} alt="loading!!" />
          </div>
          {/* <Footer /> */}
        </Fragment>
      );
    }
  }
}

export default SubscriptionPage;
