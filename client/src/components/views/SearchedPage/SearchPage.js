import React, { useEffect, useState } from "react";
import { Card, Avatar, Col, Icon } from "antd";
import axios from "axios";
import moment from "moment";
import { Helmet } from "react-helmet";
import "./SearchPage.css";
const { Meta } = Card;
const Loader = require("../../../assets/images/loader.gif");
const NoThumbnail = require("../../../assets/images/thumbnail.jpg");

function SearchPage(props) {
  const [searchedVideos, setSearchedVideos] = useState([]);
  const [searchedPlaylist, setSearchedPlayList] = useState([]);
  const [searchedUser, setSearchedUser] = useState([]);
  const [showData, setShowData] = useState(0);
  const [videoFound, setVideoFound] = useState(false);
  const [playlistFound, setPlaylistFound] = useState(false);
  const [userFound, setUserFound] = useState(false);

  const searchObj = {
    query: props.match.params.query,
  };

  const playlist = () => {
    setShowData(1);
    setPlaylistFound(false);
    axios
      .post("/api/search/results/playlists", searchObj)
      .then(async (response) => {
        if (response.data.success) {
          setSearchedPlayList(response.data.result);
          // console.log(response.data);
        } else {
          console.log("not found");
        }
        await setPlaylistFound(true);
      })
      .catch((err) => {
        setPlaylistFound(true);
      });
  };

  const user = () => {
    console.log("clicked");
    setShowData(2);
    setUserFound(false);
    axios
      .post("/api/search/results/users", searchObj)
      .then(async (response) => {
        if (response.data.success) {
          setSearchedUser(response.data.result);
          console.log(response.data);
        } else {
          console.log("not found");
        }
        await setUserFound(true);
      })
      .catch((err) => {
        setUserFound(true);
      });
  };

  const videos = () => {
    setShowData(0);
    setVideoFound(false);
    axios
      .post("/api/search/results/videos", searchObj)
      .then(async (response) => {
        if (response.data.success) {
          setSearchedVideos(response.data.result);
          console.log(response.data);
        } else {
          console.log("not found");
        }
        await setVideoFound(true);
      })
      .catch((err) => {
        setVideoFound(true);
      });
  };

  useEffect(() => {
    setShowData(0);
    setVideoFound(false);
    axios
      .post("/api/search/results/videos", searchObj)
      .then(async (response) => {
        if (response.data.success) {
          setSearchedVideos(response.data.result);
        } else {
          console.log("not found");
        }
        await setVideoFound(true);
      })
      .catch((err) => {
        setVideoFound(true);
      });
  }, []);

  const users = searchedUser.map((user, index) => {
    return (
      <Col lg={6} md={8} sm={12} xs={25}>
        <div
          style={{
            backgroundColor: "rgb(176,224,230,0.3)",
            marginBottom: "5%",
            marginTop: "4%",
            marginRight: "20px",
          }}
        >
          <div style={{ position: "relative" }}>
            <a href={`/users/${user._id}`}>
              <img
                style={{
                  width: "100%",
                  height: "150.984px",
                  maxwidth: "274.656px",
                  maxHeight: "205.984px",
                }}
                alt="thumbnail"
                src={`${user.image}`}
                onError={(e) => {
                  e.target.src = NoThumbnail;
                }}
              />
            </a>
          </div>
          <br />

          <div style={{ paddingBottom: "2%", paddingLeft: "2%" }}>
            <a
              href={`/users/${user._id}`}
              style={{ textDecoration: "none", color: "#000000A6" }}
            >
              <span>
                <b>{user.name}</b>{" "}
              </span>
            </a>
            <br />
          </div>
        </div>
      </Col>
    );
  });

  const playlists = searchedPlaylist.map((playlist, index) => {
    return (
      <Col lg={6} md={8} sm={12} xs={24} key={index}>
        <div
          style={{
            backgroundColor: "rgb(176,224,230,0.3)",
            marginBottom: "5%",
            marginTop: "4%",
            marginRight: "5%",
            marginLeft: "2%",
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
                  <br></br> {playlist.videos[0] ? playlist.videos.length : "0"}{" "}
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
            <div></div>
            <br />
            <span style={{ marginLeft: "3rem" }}>Last Updated:</span>-{" "}
            <span> {moment(playlist.updatedAt).format("MMM Do YY")} </span>
          </div>
        </div>
      </Col>
    );
  });

  const results = searchedVideos.map((video, index) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);

    return (
      <Col lg={6} md={8} sm={12} xs={25}>
        <div
          style={{
            backgroundColor: "rgb(176,224,230,0.3)",
            marginBottom: "5%",
            marginTop: "4%",
            marginRight: "20px",
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
        <title>{props.match.params.query} | Stremio</title>
      </Helmet>
      <div className="main">
        <span
          className={showData === 0 ? "hashtag current" : "hashtag"}
          onClick={videos}
        >
          #videos
        </span>
        <span
          className={showData === 1 ? "hashtag current" : "hashtag"}
          onClick={playlist}
        >
          #playlist
        </span>
        <span
          className={showData === 2 ? "hashtag current" : "hashtag"}
          onClick={user}
        >
          #user
        </span>
        <hr></hr>
        {showData === 0 ? (
          <div>
            {videoFound === true ? (
              <div>
                {searchedVideos.length > 0 ? (
                  <>
                    <div>{results}</div>
                    <br />
                  </>
                ) : (
                  <h3 style={{ textAlign: "center", fontWeight: "bold" }}>
                    {" "}
                    No Videos Found{" "}
                  </h3>
                )}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  left: "50%",
                  height: "480px",
                  paddingTop: "10%",
                  fontSize: "2rem",
                }}
              >
                <img src={Loader} alt="loading!!" />
              </div>
            )}
          </div>
        ) : null}

        {showData === 1 ? (
          <div>
            {playlistFound === true ? (
              <div>
                {searchedPlaylist.length > 0 ? (
                  <>
                    <div>{playlists}</div>
                    <br />
                  </>
                ) : (
                  <h3 style={{ textAlign: "center", fontWeight: "bold" }}>
                    {" "}
                    No Playlist Found{" "}
                  </h3>
                )}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  left: "50%",
                  height: "480px",
                  paddingTop: "10%",
                  fontSize: "2rem",
                }}
              >
                <img src={Loader} alt="loading!!" />
              </div>
            )}
          </div>
        ) : null}

        {showData === 2 ? (
          <div>
            {userFound === true ? (
              <div>
                {searchedUser.length > 0 ? (
                  <>
                    <div>{users}</div>
                    <br />
                  </>
                ) : (
                  <h3 style={{ textAlign: "center", fontWeight: "bold" }}>
                    {" "}
                    No Users Found{" "}
                  </h3>
                )}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  left: "50%",
                  height: "480px",
                  paddingTop: "10%",
                  fontSize: "2rem",
                }}
              >
                <img src={Loader} alt="loading!!" />
              </div>
            )}
          </div>
        ) : null}
        {/* 
        {showData === 1 ? <div>{playlists}</div> : null}
        {showData === 2 ? <div>{users}</div> : null} */}
      </div>
    </>
  );
}

export default SearchPage;
