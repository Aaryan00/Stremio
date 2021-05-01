import React, { useEffect, useState, Fragment } from "react";
import {
  Card,
  Tooltip,
  Avatar,
  Col,
  Typography,
  Row,
  Icon,
  Popover,
} from "antd";
import axios from "axios";
import moment from "moment";
import { Helmet } from "react-helmet";
import InfiniteScroll from "react-infinite-scroll-component";
import Footer from "./../Footer/Footer";
const { Title } = Typography;
const { Meta } = Card;
const Loader = require("../../../assets/images/loader.gif");
const HomeLoader = require("../../../assets/images/homeloader.gif");
const NoThumbnail = require("../../../assets/images/thumbnail.jpg");

function LandingPage(props) {
  const [Trending, setTrending] = useState([]);
  const [Videos, setVideos] = useState([]);
  const [Load, setLoad] = useState([true]);
  const [UserData, setUserData] = useState([]);
  const [Reload, setState] = useState(false);
  const [count, setcount] = useState(10);
  const [hasmore, sethasmore] = useState(true);

  const handleFilterClick = (e) => {
    if (e.currentTarget.value === "1") {
      setState(false);
      let x = [...Videos];
      // console.log("1");
      x.sort((a, b) => {
        var keyA = new Date(a.createdAt).getTime(),
          keyB = new Date(b.createdAt).getTime();
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
      setVideos(x);
      setState(true);
    } else if (e.currentTarget.value === "2") {
      setState(false);
      let x = [...Videos];
      // console.log("2");
      x.sort((a, b) => {
        var keyA = new Date(a.createdAt).getTime(),
          keyB = new Date(b.createdAt).getTime();
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      });
      setVideos(x);
      setState(true);
    } else if (e.currentTarget.value === "3") {
      setState(false);
      let x = [...Videos];
      x.sort((a, b) => {
        const keyA = a.views;
        const keyB = b.views;
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      });

      setVideos(x);
      setState(true);
    }
  };

  let userVariable = {
    profile: window.localStorage.getItem("userId"),
  };

  const sortby = (
    <div>
      <input
        type="radio"
        id="Newest"
        name="gender"
        value="1"
        onClick={handleFilterClick}
      />
      <label for="Newest" style={{ fontWeight: "bold", marginLeft: "5px" }}>
        Newest
      </label>
      <br />
      <input
        type="radio"
        id="Oldest"
        name="gender"
        value="2"
        onClick={handleFilterClick}
      />
      <label for="Oldest" style={{ fontWeight: "bold", marginLeft: "5px" }}>
        Oldest
      </label>
      <br />
      <input
        type="radio"
        id="Views"
        name="gender"
        value="3"
        onClick={handleFilterClick}
      />
      <label for="Views" style={{ fontWeight: "bold", marginLeft: "5px" }}>
        Views
      </label>
    </div>
  );

  const getdata = (event) => {
    const countobj = {
      count: count,
    };
    axios.post("/api/video/fetchlazyvideos", countobj).then((response) => {
      if (response.data.success) {
        response.data.videos.forEach((video) => {
          Videos.push(video);
        });
        setcount(count + 10);
        if (response.data.videos.length < 10) {
          sethasmore(false);
        }
      } else {
        alert("Failed to get Videos");
      }
    });
  };

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
    // console.log(window.localStorage.getItem("userId"));
    axios.post("/api/video/getlimitVideos").then((response) => {
      if (response.data.success) {
        setLoad(false);
        setVideos(response.data.videos);
      } else {
        alert("Failed to get Videos");
      }
    });

    axios.get("/api/video/getTrendingVideos").then((response) => {
      if (response.data.success) {
        setTrending(response.data.videos);
      } else {
        alert("Failed to get trending videos");
      }
    });

    if (window.localStorage.getItem("userId") !== null) {
      axios.post("/api/users/getdata", userVariable).then((response) => {
        if (response.data.success) {
          setUserData(response.data.user);
        } else {
          alert("failed to get user data");
        }
      });
    } else {
      const a = [1];
      setUserData(a);
    }

    setState(false);
  }, []);

  if (!Load && UserData.length > 0) {
    // if (UserData.length > 0) {
    const renderCards = Videos.map((video, index) => {
      var minutes = Math.floor(video.duration / 60);
      var seconds = Math.floor(video.duration - minutes * 60);
      return (
        <Col lg={6} md={8} sm={12} xs={24} key={index}>
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
                {window.localStorage.getItem("userId") !== null ? (
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
                ) : null}
              </b>
              <span style={{ marginLeft: "3rem" }}> {video.views}</span>
              &nbsp;views&nbsp;|{" "}
              <span> {moment(video.createdAt).format("MMM Do YY")} </span>
            </div>
          </div>
        </Col>
      );
    });

    const rendertrendingCards = Trending.map((video, index) => {
      var minutes = Math.floor(video.duration / 60);
      var seconds = Math.floor(video.duration - minutes * 60);

      return (
        // <div style = {{  minWidth: "600px"}} key={index}>

        <Col lg={6} md={8} sm={12} xs={25} key={index}>
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
                {window.localStorage.getItem("userId") !== null ? (
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
                ) : null}
              </b>
              <span style={{ marginLeft: "3rem" }}> {video.views}</span>
              &nbsp;views&nbsp;|{" "}
              <span> {moment(video.createdAt).format("MMM Do YY")} </span>
            </div>
          </div>
        </Col>
        // </div>
      );
    });

    return (
      <Fragment>
        <Helmet>
          <title>Stremio | Videos</title>
        </Helmet>

        <div style={{ width: "85%", margin: "1rem auto 3rem" }}>
          <Title level={2}> Trending Videos </Title>
          <hr />

          <Row gutter={16}>{rendertrendingCards}</Row>
        </div>
        <div style={{ width: "85%", margin: "1rem auto 3rem" }}>
          <Title level={2}> Recommended </Title>
          <Tooltip title="Sort">
            <Popover
              content={sortby}
              title="Sort Videos by"
              trigger="click"
              placement="bottom"
            >
              <Icon
                style={{
                  position: "relative",
                  fontSize: "22px",
                  float: "right",
                  margin: "-41px 0px 0px 0px",
                }}
                type="sliders"
                theme={"outlined"}
              />
            </Popover>
          </Tooltip>

          <hr />

          <InfiniteScroll
            dataLength={Videos.length}
            next={getdata}
            hasMore={hasmore}
            loader={
              <div style={{ textAlign: "center" }}>
                <img src={HomeLoader} alt="Loading..." />
              </div>
            }
            style={{ overflow: "none" }}
            endMessage={
              <div style={{ textAlign: "center", fontSize: "20px" }}>
                <p>
                  <Icon
                    style={{
                      fontSize: "40px",
                      color: "deepskyblue",
                    }}
                    type="check-circle"
                    theme={"outlined"}
                  />
                </p>
                <p style={{ fontWeight: "bold" }}>You're All Caught up!</p>
              </div>
            }
          >
            <Row gutter={16}>{renderCards}</Row>
          </InfiniteScroll>
        </div>
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
        </div>{" "}
      </Fragment>
    );
  }
}

export default LandingPage;
