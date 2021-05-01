import React, { useState, Fragment } from "react";
import { Typography, Button, Form, Input, Icon } from "antd";
import Dropzone from "react-dropzone";
import axios from "axios";
import { useSelector } from "react-redux";
// import { set } from "mongoose";
import { Helmet } from "react-helmet";
import Loader from "react-loader-advanced";
import Footer from "../Footer/Footer";
const imgLoader = require("../../../assets/images/loader.gif");
const imgLoader1 = require("../../../assets/images/loader2.gif");

const { Title } = Typography;
const { TextArea } = Input;

const Private = [
  { value: 0, label: "Private" },
  { value: 1, label: "Public" },
];

const Catogory = [
  { value: 0, label: "Film & Animation" },
  { value: 0, label: "Autos & Vehicles" },
  { value: 0, label: "Music" },
  { value: 0, label: "Pets & Animals" },
  { value: 0, label: "Sports" },
];

function UploadVideoPage(props) {
  const user = useSelector((state) => state.user);

  const [title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState(0);
  const [Categories, setCategories] = useState("Film & Animation");
  const [FilePath, setFilePath] = useState("");
  const [Duration, setDuration] = useState("");
  const [Thumbnail, setThumbnail] = useState("");
  const [Loader1, setLoader1] = useState(false);
  const [VideoPath, setVideoPath] = useState("");
  const [ThumbnailPath, setThumbnailPath] = useState("");
  const [submitLoad, setSubmitLoad] = useState(false);

  const handleChangeTitle = (event) => {
    setTitle(event.currentTarget.value);
  };

  const handleChangeDecsription = (event) => {
    setDescription(event.currentTarget.value);
  };

  const handleChangeOne = (event) => {
    setPrivacy(event.currentTarget.value);
  };

  const handleChangeTwo = (event) => {
    setCategories(event.currentTarget.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (user.userData && !user.userData.isAuth) {
      setSubmitLoad(false);
      return alert("Please Log in First");
    }

    if (
      title === "" ||
      Description === "" ||
      Categories === "" ||
      FilePath === "" ||
      Duration === "" ||
      Thumbnail === ""
    ) {
      setSubmitLoad(false);
      return alert("Please first fill all the fields");
    }

    setSubmitLoad(true);
    const variables = {
      writer: user.userData._id,
      title: title,
      description: Description,
      privacy: privacy,
      filePath: FilePath,
      category: Categories,
      duration: Duration,
      thumbnail: Thumbnail,
      thumbnail_public: "",
    };

    axios.post("/api/video/uploadVideo", variables).then((response) => {
      if (response.data.success) {
        setSubmitLoad(false);
        setThumbnailPath("");
        setVideoPath("");
        props.history.push("/");
      } else {
        setSubmitLoad(false);
        props.history.push("/video/upload");
        alert("Failed to upload video");
      }
    });
  };

  const onDrop = (files) => {
    // console.log(files[0]);
    if (files[0].size > 99999999) {
      alert("Try Uploading a video of smaller size!");
    } else {
      if (files[0].type === "video/mp4" || files[0].type === "video/matroska") {
        let formData = new FormData();
        const config = {
          header: { "content-type": "multipart/form-data" },
        };
        formData.append("file", files[0]);
        if (files) {
          setLoader1(true);
        }

        axios
          .post("/api/video/uploadfiles", formData, config)
          .then((response) => {
            if (response.data.success) {
              let variable = {
                filePath: response.data.filePath,
                fileName: response.data.fileName,
                videopath: VideoPath,
                thumbnail: ThumbnailPath,
              };
              setFilePath(response.data.filePath);

              //gerenate thumbnail with this filepath !

              axios.post("/api/video/thumbnail", variable).then((response) => {
                if (response.data.success) {
                  setLoader1(false);
                  setDuration(response.data.fileDuration);
                  setThumbnail(response.data.thumbsFilePath);
                  setThumbnailPath(response.data.thumbsFilePath);
                  setVideoPath(variable.filePath);
                } else {
                  alert("Failed to make the thumbnails");
                }
              });
            } else {
              alert("failed to save the video in server");
            }
          });
      } else {
        alert("Please upload a video only");
      }
    }
  };

  return (
    <Loader
      show={submitLoad ? true : false}
      message={<img src={imgLoader} contentBlur={"100px"} />}
    >
      <Fragment>
        <Helmet>
          <title>Upload Video</title>
        </Helmet>
        <div
          style={{
            maxWidth: "700px",
            margin: "2rem auto",
            paddingLeft: "3%",
            paddingRight: "2%",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <Title level={2}> Upload Video</Title>
          </div>

          <Form onSubmit={onSubmit}>
            <div
              style={
                window.innerWidth > 600
                  ? { display: "flex", justifyContent: "space-between" }
                  : { justifyContent: "space-between" }
              }
            >
              <Dropzone onDrop={onDrop} multiple={false} maxSize={80000000000}>
                {({ getRootProps, getInputProps }) => (
                  <div
                    style={{
                      width: "300px",
                      height: "240px",
                      border: "1px solid lightgray",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    {...getRootProps()}
                  >
                    <input {...getInputProps()} />
                    <Icon type="plus" style={{ fontSize: "3rem" }} />
                  </div>
                )}
              </Dropzone>
              {window.innerWidth < 600 && <br />}

              {Thumbnail !== "" ? (
                <div>
                  <img
                    src={`https://pumpkin-cupcake-09736.herokuapp.com/${Thumbnail}`}
                    alt="haha"
                  />
                </div>
              ) : (
                Loader1 && (
                  <div>
                    <img src={imgLoader1} alt="loader" />
                  </div>
                )
              )}
            </div>

            <br />
            <br />
            <label>Title</label>
            <Input onChange={handleChangeTitle} value={title} maxLength={100} />
            <br />
            <br />
            <label>Description</label>
            <TextArea onChange={handleChangeDecsription} value={Description} />
            <br />
            <br />

            <select onChange={handleChangeOne}>
              {Private.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <br />
            <br />

            <select onChange={handleChangeTwo}>
              {Catogory.map((item, index) => (
                <option key={index} value={item.label}>
                  {item.label}
                </option>
              ))}
            </select>
            <br />
            <br />

            <Button type="primary" size="large" onClick={onSubmit}>
              Submit
            </Button>
          </Form>
        </div>
        <Footer />
      </Fragment>
    </Loader>
  );
}

export default UploadVideoPage;
