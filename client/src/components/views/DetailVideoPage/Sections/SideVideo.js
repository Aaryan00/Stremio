import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography } from "antd";
const NoThumbnail = require("../../../../assets/images/thumbnail.jpg");
const { Title } = Typography;

function SideVideo(props) {
  const [SideVideos, setSideVideos] = useState([]);

  useEffect(() => {
    // console.log(props);
    axios.post("/api/video/getVideos", props).then((response) => {
      if (response.data.success) {
        // console.log(response.data.videos);
        setSideVideos(response.data.videos);
      } else {
        alert("Failed to get Videos");
      }
    });
  }, []);

  const sideVideoItem = SideVideos.map((video, index) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);

    return (
      <div
        key={index}
        style={{
          backgroundColor: "rgb(176,224,230,0.3)",
          display: "flex",
          marginTop: "1rem",
          padding: "0",
          marginLeft: "2rem",
          marginRight: "2rem",
          minHeight: "96.469px",
          minWidth: "231px",
        }}
      >
        <div
          style={{
            width: "50%",
            marginRight: "1rem",
          }}
        >
          <a href={`/video/${video._id}`} style={{ color: "gray" }}>
            <img
              style={{
                width: "100%",
                height: "96.469px",
                maxheight: "96.469px",
                widht: "128.625px",
                maxWidth: "128.625px",
              }}
              src={`${video.thumbnail}`}
              onError={(e) => {
                e.target.src = NoThumbnail;
              }}
              alt="thumbnail"
            />
          </a>
        </div>

        <div style={{ width: "50%" }}>
          <a href={`/video/${video._id}`} style={{ color: "gray" }}>
            <span style={{ fontSize: "1rem", color: "black" }}>
              {video.title.substr(0, 15)}{" "}
            </span>
            <br />
            <a
              style={{
                textDecoration: "none",
                color: "#808080",
              }}
              href={`/users/${video.writer._id}`}
            >
              <span>{video.writer.name.substr(0, 17)}</span>
            </a>
            <br />
            <span>{video.views}&nbsp;views</span>
            <br />
            <span>
              {minutes} : {seconds}
            </span>
            <br />
          </a>
        </div>
      </div>
    );
  });

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <div style={{ marginTop: "2%" }} className="detail-side-video">
          <hr style={{ width: "80%" }} className="detail-line" />
          <Title level={2} style={{ marginLeft: "10%" }}>
            {" "}
            Related Videos
          </Title>
          <hr style={{ width: "80%" }} />
          {sideVideoItem}
        </div>
      </div>
    </>
  );
}

export default SideVideo;
