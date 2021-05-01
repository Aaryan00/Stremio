import React, { useState } from "react";
import { Comment, Avatar, Button, Input } from "antd";
import Axios from "axios";
import { useSelector } from "react-redux";
import LikeDislikes from "./LikeDislikes";
const { TextArea } = Input;

function SingleComment(props) {
  const user = useSelector((state) => state.user);
  const [CommentValue, setCommentValue] = useState("");
  const [OpenReply, setOpenReply] = useState(false);

  const handleChange = (e) => {
    setCommentValue(e.currentTarget.value);
  };

  const openReply = () => {
    setOpenReply(!OpenReply);
  };

  const onSubmit = (e) => {
    if (window.localStorage.getItem("userId") !== null) {
      e.preventDefault();

      const variables = {
        writer: user.userData._id,
        postId: props.postId,
        responseTo: props.comment._id,
        content: CommentValue,
      };

      if (CommentValue === "") {
        return;
      }

      Axios.post("/api/comment/saveComment", variables).then((response) => {
        if (response.data.success) {
          setCommentValue("");
          setOpenReply(!OpenReply);
          props.refreshFunction(response.data.result);
        } else {
          alert("Failed to save Comment");
        }
      });
    } else {
      alert("Please Log in First");
    }
  };

  const actions = [
    <LikeDislikes
      comment
      commentId={props.comment._id}
      userId={localStorage.getItem("userId")}
    />,
    <span onClick={openReply} key="comment-basic-reply-to">
      Reply to{" "}
    </span>,
  ];

  return (
    <div>
      <Comment
        actions={actions}
        author={props.comment.writer.name}
        avatar={<Avatar src={props.comment.writer.image} alt="image" />}
        content={<p>{props.comment.content}</p>}
      ></Comment>

      {OpenReply && (
        <form style={{ display: "flex" }} onSubmit={onSubmit}>
          <TextArea
            style={{
              width: "70%",
              // minWidth: "490px",
              borderRadius: "5px",
              marginLeft: "-2%",
              marginBottom: "5%",
            }}
            onChange={handleChange}
            value={CommentValue}
            placeholder="write some comments"
          />
          <br />
          <Button className="reply-button" onClick={onSubmit}>
            Submit
          </Button>
        </form>
      )}
    </div>
  );
}

export default SingleComment;
