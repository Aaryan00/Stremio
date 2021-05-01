import React, { useEffect, useState, Fragment } from "react";
import {
  Modal,
  Card,
  Typography,
  Avatar,
  Col,
  Row,
  Tooltip,
  Icon,
  Popover,
  Input,
  Button,
} from "antd";
import axios from "axios";
import moment from "moment";
import { Helmet } from "react-helmet";
import "./Playlist.css";
import NotFound from "./../NotFound/NotFound";
import Footer from "../Footer/Footer";

const Loader = require("../../../assets/images/loader.gif");
const { Meta } = Card;
const { Title } = Typography;
const NoThumbnail = require("../../../assets/images/thumbnail.jpg");

function Playlist(props) {
  const [Videos, setVideos] = useState([]);
  const [Load, setLoad] = useState([true]);
  const [SameUser, setSameUser] = useState(0);
  const [Visible, setVisible] = useState(false);
  const [ConfirmLoading, setConfirmLoading] = useState(false);
  const [Modaldata, setModalData] = useState([]);
  const [UserData, setUserData] = useState([]);
  const [Reload, setState] = useState(false);
  const [PlaylistTitle, setTitle] = useState("");
  const [NewTitle, setNewTitle] = useState("");
  const [Wrong, setWrong] = useState(false);

  const userVariable = {
    profile: window.localStorage.getItem("userId"),
  };
  const handleTitleChange = (e) => {
    setNewTitle(e.currentTarget.value);
  };
  const handleTitleSubmit = () => {
    // console.log(NewTitle);
    setTitle(NewTitle);
    const title = {
      newTitle: NewTitle,
      playlistId: playlist,
    };
    axios
      .put("/api/playlist/title", title)
      .then((response) => {
        if (!response.data.success) {
          alert("Failed to edit Playlist title");
          window.location.reload();
        }
      })
      .catch(() => {
        setWrong(true);
      });
  };
  const content = (
    <div>
      <Input type="text" values={NewTitle} onChange={handleTitleChange} />
      <br />
      <br />
      <Button onClick={handleTitleSubmit}>Submit</Button>
    </div>
  );
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
      axios
        .post("/api/video/savevideo", videoid)
        .then((response) => {
          if (response.data.success) {
            user1[0].saved.push(videoid.video);
            setUserData(user1);
            setState(true);
          } else {
            alert("failed to Save video");
            window.location.reload();
          }
        })
        .catch(() => {
          setWrong(true);
        });
    } else {
      axios
        .post("/api/video/unsavevideo", videoid)
        .then((response) => {
          if (response.data.success) {
            user1[0].saved.splice(user1[0].saved.indexOf(videoid.video), 1);
            setUserData(user1);
            setState(true);
          } else {
            alert("failed to unsave video");
            window.location.reload();
          }
        })
        .catch(() => {
          setWrong(true);
        });
    }
  };

  const playlist = props.match.params.playlistId;
  const newvideos = [];

  const sendvideos = {
    playlistid: playlist,
    videos: newvideos,
  };

  const handleCheck = (event) => {
    // console.log(event.target.value);
    if (newvideos.indexOf(event.target.value) !== -1) {
      newvideos.splice(newvideos.indexOf(event.target.value), 1);
    } else {
      newvideos.push(event.target.value);
    }
    // console.log(newvideos);
  };

  const addvideos = () => {
    // setModalData("hello");
    axios
      .post("/api/video/getuservideos", userVariable)
      .then((response) => {
        if (response.data.success) {
          // console.log(response.data.videos);
          setModalData(response.data.videos);
        } else {
          alert("failed to get videos");
          window.location.reload();
        }
      })
      .catch(() => {
        setWrong(true);
      });
    setVisible(true);
  };

  const handleTitleClick = () => {
    const newTitle = prompt("Enter New title");
    // console.log(newTitle);
  };

  const modaltext = Modaldata.map((video, index) => {
    return (
      <div key={index}>
        {Videos.some((ele) => ele._id === video._id) ? null : (
          <div className="addvideos">
            <img
              className="thumbnail"
              alt="thumbnail"
              src={`${video.thumbnail}`}
              onError={(e) => {
                e.target.src = NoThumbnail;
              }}
            />
            <span className="title">{video.title.substr(0, 15)}</span>
            <div className="btn-container">
              <input
                type="checkbox"
                value={video._id}
                className="toggle"
                onChange={handleCheck}
              />
            </div>
          </div>
        )}
      </div>
    );
  });

  const handleOk = () => {
    setConfirmLoading(true);
    // console.log(sendvideos);
    axios
      .post("/api/playlist/addvideos", sendvideos)
      .then((response) => {
        if (response.data.success) {
          setTimeout(() => {
            setVisible(false);
            setConfirmLoading(false);
            window.location.reload();
          }, 1000);
        }
      })
      .catch(() => {
        setWrong(true);
      });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const modal = (
    <Modal
      title="Add Videos"
      visible={Visible}
      onOk={handleOk}
      confirmLoading={ConfirmLoading}
      onCancel={handleCancel}
    >
      <div
        style={{
          maxHeight: "calc(100vh - 300px)",
          overflowY: "auto",
        }}
        className="scrollable-element"
      >
        {modaltext}
      </div>
    </Modal>
  );

  const deleteplaylistvideo = (event) => {
    const videoid = {
      playlist: playlist,
      video: event.currentTarget.id,
    };

    axios
      .post("/api/playlist/deleteplaylistvideo", videoid)
      .then((response) => {
        // console.log(response);
        if (response.data.success) {
          window.location.reload();
        } else {
          alert("failed to delete video");
          window.location.reload();
        }
      })
      .catch(() => {
        setWrong(true);
      });
  };

  useEffect(() => {
    axios
      .get(`/api/playlist/${playlist}`)
      .then((response) => {
        if (response.data.success) {
          // console.log(response.data.result.videos);
          setVideos(response.data.result.videos);
          setTitle(response.data.result.playlist[0].title);
          // console.log(response.data.result.playlist[0].title);
          setLoad(false);
        }
        if (userVariable.profile === response.data.result.playlist[0].user_id) {
          setSameUser(1);
        } else {
          setSameUser(0);
        }
      })
      .catch(() => {
        setWrong(true);
      });
    axios
      .post("/api/users/getdata", userVariable)
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
    if (UserData.length > 0 && PlaylistTitle !== "") {
      const newplaylisticon = (
        <div>
          {SameUser ? (
            <div className="newPlaylist" onClick={addvideos}>
              <Icon className="Plus" type="plus" theme={"outlined"} />
              <span className="NewVideos">Add Videos</span>
              <hr />
            </div>
          ) : null}
        </div>
      );

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
                {SameUser ? (
                  <Tooltip title="Delete">
                    <Icon
                      style={{
                        fontSize: "18px",
                        color: "red",
                        float: "right",
                        margin: "-30px 10px 0px 0px",
                        cursor: "pointer",
                      }}
                      type="delete"
                      theme={"filled"}
                      id={video._id}
                      onClick={deleteplaylistvideo}
                    />
                  </Tooltip>
                ) : (
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
                        margin: "-30px 10px 0px 0px",
                        cursor: "pointer",
                      }}
                      id={video._id}
                      onClick={savevideo}
                    />
                  </Tooltip>
                )}
                <br />
                <span style={{ marginLeft: "3rem" }}> {video.views}</span>
                &nbsp;views&nbsp;|{" "}
                <span> {moment(video.createdAt).format("MMM Do YY")} </span>
              </div>
            </div>
          </Col>
        );
      });

      return (
        <>
          <Helmet>
            <title>Playlist | {PlaylistTitle}</title>
          </Helmet>
          <div style={{ width: "85%", margin: "1rem auto 3rem" }}>
            <Title level={2}>
              {" "}
              {PlaylistTitle}
              {SameUser ? (
                <Popover content={content} title="Change Title">
                  <Icon
                    type="edit"
                    //                  onClick={handleTitleClick}
                    style={{ fontSize: "16px", color: "#08c", float: "right" }}
                    theme="outlined"
                  />
                </Popover>
              ) : null}{" "}
            </Title>
            <hr />
            {newplaylisticon}
            <Row gutter={16}>{renderCards}</Row>
          </div>
          {modal}
          {/* <Footer /> */}
        </>
      );
    } else {
      return null;
    }
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

export default Playlist;
