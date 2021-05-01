import React, { useState } from "react";
import "../DetailVideoPage.css";
import { Button, Input } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import SingleComment from "./SingleComment";
import ReplyComment from "./ReplyComment";
const { TextArea } = Input;

function Comments(props) {
  const user = useSelector((state) => state.user);
  const [Comment, setComment] = useState("");

  const handleChange = (e) => {
    setComment(e.currentTarget.value);
  };

  const onSubmit = (e) => {
    if (window.localStorage.getItem("userId") !== null) {
      e.preventDefault();

      const variables = {
        content: Comment,
        writer: user.userData._id,
        postId: props.postId,
      };

      if (Comment === "") {
        return;
      }

      axios.post("/api/comment/saveComment", variables).then((response) => {
        if (response.data.success) {
          setComment("");
          props.refreshFunction(response.data.result);
        } else {
          alert("Failed to save Comment");
        }
      });
    } else {
      alert("Please Log in first");
    }
  };

  return (
    <div>
      <br />
      <p style={{ fontWeight: "bold" }}> Comments</p>
      <hr />
      {/* Comment Lists  */}
      {/* {console.log(props.CommentLists)} */}

      {props.CommentLists &&
        props.CommentLists.map(
          (comment, index) =>
            !comment.responseTo && (
              <React.Fragment key={index}>
                <SingleComment
                  comment={comment}
                  postId={props.postId}
                  refreshFunction={props.refreshFunction}
                />
                <ReplyComment
                  CommentLists={props.CommentLists}
                  postId={props.postId}
                  parentCommentId={comment._id}
                  refreshFunction={props.refreshFunction}
                />
              </React.Fragment>
            )
        )}

      {/* Root Comment Form */}
      <form style={{ display: "flex", marginTop: "2%" }} onSubmit={onSubmit}>
        <TextArea
          style={{ width: "100%", borderRadius: "5px" }}
          onChange={handleChange}
          value={Comment}
          placeholder="Write some comments"
        />
        <br />
        <Button className="comment-button" onClick={onSubmit}>
          Submit
        </Button>
      </form>
    </div>
  );
}

export default Comments;
