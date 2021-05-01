import React, { useEffect, useState, Fragment } from "react";
import {
  Button,
  Card,
  Menu,
  Avatar,
  Col,
  Form,
  Row,
  Input,
  Tooltip,
  Icon,
  Popover,
  Dropdown,
} from "antd";
import axios from "axios";
import moment from "moment";
import Userupper from "./UserData";
import { Helmet } from "react-helmet";
import "./UserProfile.css";
import NotFound from "./../NotFound/NotFound";
import Footer from "../Footer/Footer";
const { Meta } = Card;
const Loader = require("../../../assets/images/loader.gif");
const NoThumbnail = require("../../../assets/images/thumbnail.jpg");

function UserProfile(props) {
  const [Videos, setVideos] = useState([]);
  const [Load, setLoad] = useState([true]);
  const [SameUser, setSameUser] = useState(0);
  const [ShowData, setshowData] = useState(0);
  const [Title, setTitle] = useState(0);
  const [Playlist, setPlaylist] = useState([]);
  const [Liked, setLiked] = useState([]);
  const [Saved, setSaved] = useState([]);
  const [UserData, setUserData] = useState([]);
  const [Reload, setState] = useState(false);
  const [Wrong, setWrong] = useState(false);

  const currentid = window.localStorage.getItem("userId");

  const userVariable = {
    profile: props.match.params.userId,
  };

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
    if (ShowData === 3) {
      dpart();
    }
  };

  //to check whether user is on videos or playlist
  const apart = () => {
    setshowData(0);
  };

  const bpart = () => {
    axios.post("/api/playlist/getplaylist", userVariable).then((response) => {
      if (response.data.success) {
        setPlaylist(response.data.playlist);
        // console.log(Playlist);
      } else {
        alert("failed to get playlist");
        window.location.reload();
      }
    });
    setshowData(1);
  };

  const cpart = () => {
    axios.post("/api/video/liked", userVariable).then((response) => {
      if (response.data.success) {
        setLiked(response.data.liked);
        // console.log(response.data.liked);
      } else {
        alert("failed to get liked videos");
        window.location.reload();
      }
    });
    setshowData(2);
  };

  const dpart = () => {
    axios.post("/api/video/saved", userVariable).then((response) => {
      if (response.data.success) {
        setSaved(response.data.videos);
      } else {
        alert("failed to get liked videos");
        window.location.reload();
      }
    });
    setshowData(3);
  };

  const handleChangeTitle = (event) => {
    setTitle(event.currentTarget.value);
  };

  const data = {
    user_id: currentid,
    title: Title,
  };

  //call when user create a new playlist
  const playlist = (event) => {
    event.preventDefault();

    if (Title === "") {
      return alert("Please fill the field first");
    }

    axios.post("/api/playlist/createplaylist", data).then((response) => {
      if (response.data.success) {
        // setshowData(1);
        bpart();
        // window.location.reload();
      } else {
        alert("failed to create playlist");
        window.location.reload();
      }
    });
    setTitle("");
  };

  //show the popup for creating playlist
  const newPlaylist = (
    <div>
      <Form onSubmit={playlist}>
        <label id="playlist_name">Playlist Name</label>
        <Input onChange={handleChangeTitle} value={Title} maxLength={10} />
        <br />
        <br />
        <Button type="primary" size="large" onClick={playlist}>
          Create
        </Button>
      </Form>
    </div>
  );

  const onClick = function (info) {
    // console.log("on", info);
    if (info.key == 1) {
      //delete video
      const videoid = {
        video: info.item.props.mode,
      };

      axios.post("/api/video/deletevideo", videoid).then((response) => {
        if (response.data.success) {
          window.location.reload();
        } else {
          alert("failed to delete video");
          window.location.reload();
        }
      });
    }
    if (info.key == 2) {
      window.location = `video/edit/${info.item.props.mode}`;
    }
  };

  const menu = (videoid) => (
    <Menu onClick={onClick}>
      <Menu.Item key="1" mode={videoid}>
        Delete
      </Menu.Item>
      <Menu.Item key="2" mode={videoid}>
        Edit Video
      </Menu.Item>
    </Menu>
  );

  const deleteplaylist = (event) => {
    const playlistid = {
      playlist: event.currentTarget.id,
    };
    axios.post("/api/playlist/deleteplaylist", playlistid).then((response) => {
      if (response.data.success) {
        bpart();
      } else {
        alert("failed to delete video");
        window.location.reload();
      }
    });
  };

  useEffect(() => {
    if (userVariable.profile === currentid) {
      setSameUser(1);
    } else {
      setSameUser(0);
    }

    axios
      .post("/api/video/getuservideos", userVariable)
      .then((response) => {
        if (response.data.success) {
          setVideos(response.data.videos);
          setLoad(false);
        } else {
          alert("Failed to get video Info");
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
    if (UserData.length > 0) {
      let senddata = {
        profile: props.match.params.userId,
        Videos: Videos.length,
      };

      const newplaylisticon = (
        <div>
          {SameUser ? (
            <div className="new_playlist">
              <Popover
                content={newPlaylist}
                title="Create New Playlist"
                trigger="click"
                placement="bottom"
              >
                <Icon className="Add" type="plus" theme={"outlined"} />
                <span className="textnew">New PlayList</span>
              </Popover>
            </div>
          ) : null}
        </div>
      );

      const renderPlaylist = Playlist.map((playlist, index) => {
        // console.log(playlist);
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
                <a href={`/playlist/${playlist._id}`}>
                  <img
                    style={{
                      width: "100%",
                      height: "172px",
                      maxwidth: "274.656px",
                      maxHeight: "205.984px",
                    }}
                    alt="thumbnail"
                    src={`${playlist.thumbnail}`}
                    onError={(e) => {
                      e.target.src = NoThumbnail;
                    }}
                  />
                  <div className="side-thumbnail">
                    <span>
                      <br></br>{" "}
                      {playlist.videos[0] ? playlist.videos.length : "0"}{" "}
                      <br></br>
                      <Icon
                        style={{
                          fontSize: "27px",
                        }}
                        type="align-left"
                        theme={"outlined"}
                      />
                    </span>
                  </div>
                </a>
              </div>
              <br />
              <div style={{ paddingBottom: "2%", paddingLeft: "2%" }}>
                <a href={`/playlist/${playlist._id}`}>
                  <Meta
                    avatar={<Avatar src={playlist.user_id.image} />}
                    title={playlist.title.substr(0, 15)}
                  />
                </a>
                <span>{playlist.user_id.name} </span>
                <div>
                  <b>
                    {SameUser ? (
                      <Tooltip title="Delete">
                        <Icon
                          style={{
                            fontSize: "18px",
                            color: "red",
                            float: "right",
                            margin: "-45px 10px 0px 0px",
                            cursor: "pointer",
                          }}
                          type="delete"
                          theme={"filled"}
                          id={playlist._id}
                          onClick={deleteplaylist}
                        />
                      </Tooltip>
                    ) : null}
                  </b>
                </div>
                <br />
                <span style={{ marginLeft: "3rem" }}>Last Updated:</span>-{" "}
                <span> {moment(playlist.updatedAt).format("MMM Do YY")} </span>
              </div>
            </div>
          </Col>
        );
      });

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
                  <div className="duration">
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
                </a>{" "}
                <div>
                  <b>
                    {SameUser ? (
                      <Dropdown
                        overlay={menu(video._id)}
                        id={video._id}
                        trigger={["click"]}
                      >
                        <Icon
                          style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            color: "black",
                            float: "right",
                            margin: "-45px 10px 0px 0px",
                            cursor: "pointer",
                          }}
                          type="more"
                          theme={"outlined"}
                          id={video._id}
                        />
                      </Dropdown>
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
                            margin: "-45px 10px 0px 0px",
                            cursor: "pointer",
                          }}
                          id={video._id}
                          onClick={savevideo}
                        />
                      </Tooltip>
                    )}
                  </b>
                </div>
                <br />
                <span style={{ marginLeft: "3rem" }}> {video.views}</span>
                &nbsp;views&nbsp;|{" "}
                <span> {moment(video.createdAt).format("MMM Do YY")} </span>
              </div>
            </div>
          </Col>
        );
      });

      const renderLiked = Liked.map((video, index) => {
        var minutes = Math.floor(video.videoId.duration / 60);
        var seconds = Math.floor(video.videoId.duration - minutes * 60);
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
                <a href={`/video/${video.videoId._id}`}>
                  <img
                    style={{
                      width: "100%",
                      height: "205.984px",
                      maxwidth: "274.656px",
                      maxHeight: "205.984px",
                    }}
                    alt="thumbnail"
                    src={`${video.videoId.thumbnail}`}
                    onError={(e) => {
                      e.target.src = NoThumbnail;
                    }}
                  />
                  <div className="duration">
                    <span>
                      {minutes} : {seconds}
                    </span>
                  </div>
                </a>
              </div>
              <br />
              <div style={{ paddingBottom: "2%", paddingLeft: "2%" }}>
                <a
                  href={`/users/${video.videoId.writer._id}`}
                  style={{ textDecoration: "none", color: "#000000A6" }}
                >
                  <Meta
                    avatar={<Avatar src={video.videoId.writer.image} />}
                    title={video.videoId.title.substr(0, 15)}
                  />
                  <span>{video.videoId.writer.name} </span>
                </a>
                <br />
                <b>
                  <Tooltip title="Save">
                    <i
                      className={
                        UserData[0].saved.includes(video.videoId._id)
                          ? "fas fa-bookmark"
                          : "far fa-bookmark"
                      }
                      style={{
                        fontSize: "18px",
                        float: "right",
                        margin: "-45px 10px 0px 0px",
                        cursor: "pointer",
                      }}
                      id={video.videoId._id}
                      onClick={savevideo}
                    />
                  </Tooltip>
                </b>
                <span style={{ marginLeft: "3rem" }}>
                  {" "}
                  {video.videoId.views}
                </span>
                &nbsp;views&nbsp;|{" "}
                <span>
                  {" "}
                  {moment(video.videoId.createdAt).format("MMM Do YY")}{" "}
                </span>
              </div>
            </div>
          </Col>
        );
      });

      const renderSaved = Saved.map((video, index) => {
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
                  <div className="duration">
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
            <title>Stremio | User Profile</title>
          </Helmet>
          <Userupper data={senddata} />
          <div
            style={{
              width: "85%",
              margin: "1rem auto 3rem",
            }}
          >
            <div className="videosorplaylist">
              <div
                className={
                  ShowData === 0 ? "active titlevideos" : "titlevideos"
                }
                level={2}
                onClick={apart}
              >
                Videos
              </div>
              <div
                className={
                  ShowData === 1 ? "active titleplaylist" : "titleplaylist"
                }
                level={2}
                onClick={bpart}
              >
                Playlist
              </div>{" "}
              <div>
                {SameUser ? (
                  <div
                    className={
                      ShowData === 2 ? "active titleplaylist" : "titleplaylist"
                    }
                    level={2}
                    onClick={cpart}
                  >
                    Liked
                  </div>
                ) : null}
              </div>
              <div>
                {SameUser ? (
                  <div
                    className={
                      ShowData === 3 ? "active titleplaylist" : "titleplaylist"
                    }
                    level={2}
                    onClick={dpart}
                  >
                    Saved
                  </div>
                ) : null}
              </div>
            </div>

            <hr />

            {ShowData === 0 ? <Row gutter={16}>{renderCards}</Row> : null}

            {ShowData === 1 ? (
              <div>
                {newplaylisticon}
                <hr />
                <Row gutter={16}> {renderPlaylist}</Row>
              </div>
            ) : null}

            {ShowData === 2 ? <Row gutter={16}>{renderLiked}</Row> : null}

            {ShowData === 3 ? <Row gutter={16}>{renderSaved}</Row> : null}
          </div>
        </Fragment>
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
        </Fragment>
      );
    }
  }
}
export default UserProfile;
