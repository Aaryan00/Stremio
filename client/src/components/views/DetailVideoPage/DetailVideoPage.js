import React, { useEffect, useState, Fragment } from "react";
import { List, Avatar, Row, Col, Icon } from "antd";
import axios from "axios";
import SideVideo from "./Sections/SideVideo";
import Subscriber from "./Sections/Subscriber";
import { Helmet } from "react-helmet";
import Comments from "./Sections/Comments";
import LikeDislikes from "./Sections/LikeDislikes";
import NotFound from "./../NotFound/NotFound";
import "./DetailVideoPage.css";
import Footer from "../Footer/Footer";

const Loader = require("../../../assets/images/loader.gif");

function DetailVideoPage(props) {
  const videoId = props.match.params.videoId;
  const [Video, setVideo] = useState([]);
  const [CommentLists, setCommentLists] = useState([]);
  const [Wrong, setWrong] = useState(false);

  const videoVariable = {
    videoId: videoId,
  };

  useEffect(() => {
    axios
      .post("/api/video/getVideo", videoVariable)
      .then((response) => {
        if (response.data.success) {
          // console.log(response.data.video);
          setVideo(response.data.video);
        } else {
          alert("Failed to get video Info");
        }
      })
      .catch(() => {
        setWrong(true);
      });

    axios
      .post("/api/comment/getComments", videoVariable)
      .then((response) => {
        if (response.data.success) {
          // console.log("response.data.comments", response.data.comments);
          setCommentLists(response.data.comments);
        } else {
          alert("Failed to get video Info");
        }
      })
      .catch(() => {
        setWrong(true);
      });
  }, []);

  const updateComment = (newComment) => {
    setCommentLists(CommentLists.concat(newComment));
  };

  if (Video.writer) {
    return (
      <Fragment>
        <Helmet>
          <title>{Video.title}</title>
        </Helmet>

        <Row>
          <Col lg={18} xs={24}>
            <div
              style={{ width: "100%", maxWidth: "100%" }}
              className="postPage"
            >
              <video
                style={{ width: "100%" }}
                className="videoStyle"
                // src={`http://localhost:5000/${Video.filePath}`}
                src={Video.filePath}
                controls
              ></video>
              <div className="content-video">
                <List.Item
                  actions={[
                    <LikeDislikes
                      video
                      videoId={videoId}
                      userId={localStorage.getItem("userId")}
                    />,
                    <Subscriber
                      userTo={Video.writer._id}
                      userFrom={localStorage.getItem("userId")}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <a href={`/users/${Video.writer._id}`}>
                        <Avatar src={Video.writer && Video.writer.image} />
                      </a>
                    }
                    title={
                      <div
                        style={{ fontSize: "20px", fontWeight: "bold" }}
                        class="content"
                      >
                        {Video.title}
                        <br />{" "}
                        <h6 style={{ fontSize: "12px", paddingTop: "5px" }}>
                          <Icon
                            type="eye"
                            style={{
                              fontSize: "16px",
                              color: "grey",
                              marginRight: "2px",
                              paddingBottom: "3px",
                            }}
                            theme="outlined"
                          />
                          {Video.views}
                        </h6>
                      </div>
                    }
                    // description={Video.description}
                  />
                </List.Item>
                <p>{Video.description}</p>
                <Comments
                  CommentLists={CommentLists}
                  postId={Video._id}
                  refreshFunction={updateComment}
                />
              </div>
            </div>
          </Col>
          <Col lg={6} xs={16}>
            <SideVideo currentvideo={props.match.params.videoId} />
          </Col>
        </Row>
        <Footer />
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
        </Fragment>
      );
    }
  }
}

export default DetailVideoPage;
