import React, { useEffect, useState } from "react";
import { Tooltip, Icon } from "antd";
import Axios from "axios";

function LikeDislikes(props) {
  const [Likes, setLikes] = useState(0);
  const [Dislikes, setDislikes] = useState(0);
  const [LikeAction, setLikeAction] = useState(null);
  const [DislikeAction, setDislikeAction] = useState(null);
  const [UserData, setUserData] = useState([]);
  const [Reload, setState] = useState(false);
  const [Load, setLoad] = useState(false);
  let variable = {};

  if (props.video) {
    variable = { videoId: props.videoId, userId: props.userId };
  } else {
    variable = { commentId: props.commentId, userId: props.userId };
  }

  let userVariable = { profile: localStorage.getItem("userId") };

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
      Axios.post("/api/video/savevideo", videoid).then((response) => {
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
      Axios.post("/api/video/unsavevideo", videoid).then((response) => {
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
    if (window.localStorage.getItem("userId") !== null) {
      Axios.post("/api/users/getdata", userVariable).then((response) => {
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

    Axios.post("/api/like/getLikes", variable).then((response) => {
      // console.log('getLikes',response.data)

      if (response.data.success) {
        //How many likes does this video or comment have
        setLikes(response.data.likes.length);

        //if I already click this like button or not
        response.data.likes.map((like) => {
          if (like.userId === props.userId) {
            setLikeAction("liked");
          }
        });
      } else {
        alert("Failed to get likes");
      }
    });

    Axios.post("/api/like/getDislikes", variable).then((response) => {
      // console.log('getDislike',response.data)
      if (response.data.success) {
        //How many likes does this video or comment have
        setDislikes(response.data.dislikes.length);

        //if I already click this like button or not
        response.data.dislikes.map((dislike) => {
          if (dislike.userId === props.userId) {
            setDislikeAction("disliked");
          }
        });
      } else {
        alert("Failed to get dislikes");
      }
    });
    setLoad(true);
  }, []);

  if (Load) {
    if (UserData.length > 0) {
      const onLike = () => {
        if (window.localStorage.getItem("userId") !== null) {
          if (LikeAction === null) {
            Axios.post("/api/like/upLike", variable).then((response) => {
              if (response.data.success) {
                setLikes(Likes + 1);
                setLikeAction("liked");

                //If dislike button is already clicked

                if (DislikeAction !== null) {
                  setDislikeAction(null);
                  setDislikes(Dislikes - 1);
                }
              } else {
                alert("Failed to increase the like");
              }
            });
          } else {
            Axios.post("/api/like/unLike", variable).then((response) => {
              if (response.data.success) {
                setLikes(Likes - 1);
                setLikeAction(null);
              } else {
                alert("Failed to decrease the like");
              }
            });
          }
        } else {
          alert("Please login first");
        }
      };

      const onDisLike = () => {
        if (window.localStorage.getItem("userId") !== null) {
          if (DislikeAction !== null) {
            Axios.post("/api/like/unDisLike", variable).then((response) => {
              if (response.data.success) {
                setDislikes(Dislikes - 1);
                setDislikeAction(null);
              } else {
                alert("Failed to decrease dislike");
              }
            });
          } else {
            Axios.post("/api/like/upDisLike", variable).then((response) => {
              if (response.data.success) {
                setDislikes(Dislikes + 1);
                setDislikeAction("disliked");

                //If dislike button is already clicked
                if (LikeAction !== null) {
                  setLikeAction(null);
                  setLikes(Likes - 1);
                }
              } else {
                alert("Failed to increase dislike");
              }
            });
          }
        } else {
          alert("Please Log in First");
        }
      };

      return (
        <React.Fragment>
          {window.localStorage.getItem("userId") !== null
            ? [
                props.video ? (
                  <Tooltip title="Save">
                    <i
                      className={
                        UserData[0].saved.includes(props.videoId)
                          ? "fas fa-bookmark"
                          : "far fa-bookmark"
                      }
                      style={{
                        fontSize: "18px",
                        margin: "0px 10px 0px 0px",
                        cursor: "pointer",
                      }}
                      id={props.videoId}
                      onClick={savevideo}
                    />
                  </Tooltip>
                ) : null,
              ]
            : null}
          <span key="comment-basic-like">
            <Tooltip title="Like">
              <Icon
                type="like"
                theme={LikeAction === "liked" ? "filled" : "outlined"}
                onClick={onLike}
              />
            </Tooltip>
            <span style={{ paddingLeft: "8px", cursor: "auto" }}>{Likes}</span>
          </span>
          &nbsp;&nbsp;
          <span key="comment-basic-dislike">
            <Tooltip title="Dislike">
              <Icon
                type="dislike"
                theme={DislikeAction === "disliked" ? "filled" : "outlined"}
                onClick={onDisLike}
              />
            </Tooltip>
            <span style={{ paddingLeft: "8px", cursor: "auto" }}>
              {Dislikes}
            </span>
          </span>
        </React.Fragment>
      );
    } else {
      return null;
    }
  } else {
    return null;
  }
}

export default LikeDislikes;
