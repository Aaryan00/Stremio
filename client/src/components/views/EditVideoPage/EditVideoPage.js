import React, { useState, Fragment, useEffect } from "react";
import { Typography, Button, Form, Input, Icon } from "antd";
import Dropzone from "react-dropzone";
import axios from "axios";
import ReactTooltip from "react-tooltip";
import { useSelector } from "react-redux";
import Footer from "./../Footer/Footer";
import { Helmet } from "react-helmet";
import Loader from "react-loader-advanced";
import NotFound from "./../NotFound/NotFound";
const imgLoader = require("../../../assets/images/loader.gif");
const imgLoader1 = require("../../../assets/images/loader2.gif");
const NoThumbnail = require("../../../assets/images/thumbnail.jpg");

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

function EditVideoPage(props) {
  const user = useSelector((state) => state.user);
  const [title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState(0);
  const [Categories, setCategories] = useState("Film & Animation");
  const [Thumbnail, setThumbnail] = useState("");
  const [Loader1, setLoader1] = useState(false);
  const [ThumbnailPath, setThumbnailPath] = useState("");
  const [submitLoad, setSubmitLoad] = useState(false);
  const videoId = props.match.params.videoId;
  const userId = localStorage.getItem("userId");
  const [changed, setChanged] = useState(false);
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
          if (userId !== response.data.video.writer._id) {
            props.history.push("/");
          }
          setTitle(response.data.video.title);
          setDescription(response.data.video.description);
          setPrivacy(response.data.video.privacy);
          setThumbnail(response.data.video.thumbnail);
        } else {
          alert("Failed to get video Info");
        }
      })
      .catch(() => {
        setWrong(true);
      });
  }, []);

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
      category: Categories,
      thumbnail: ThumbnailPath,
      videoId: videoId,
      changed: changed,
    };

    axios.put("/api/video/updateVideo", variables).then((response) => {
      if (response.data.success) {
        setSubmitLoad(false);
        setThumbnailPath("");
        props.history.push(`/users/${userId}`);
      } else {
        setSubmitLoad(false);
        window.location.reload();
        alert("Failed to edit video");
      }
    });
  };

  const onDrop = (files) => {
    // console.log(files[0]);
    if (files[0].size > 9999999) {
      alert("Try Uploading a image of smaller size!");
    } else {
      if (files[0].type === "video/mp4" || files[0].type === "video/matroska") {
        alert("Uploaad a image only!");
      } else {
        // if (true) {
        let formData = new FormData();
        const config = {
          header: { "content-type": "multipart/form-data" },
        };
        formData.append("file", files[0]);
        if (files) {
          setLoader1(true);
        }
        axios
          .put("/api/video/uploadThumbnail", formData, config)
          .then((response) => {
            if (response.data.success) {
              console.log(response.data);
              setChanged(true);
              setThumbnail(
                "https://pumpkin-cupcake-09736.herokuapp.com/" +
                  response.data.filePath
              );
              setThumbnailPath(response.data.filePath);
            }
          });
      }
      // else {
      //   alert("Please upload a image only");
      // }
    }
  };

  return (
    <Loader
      show={submitLoad ? true : false}
      message={<img alt="Loader" src={imgLoader} contentBlur={"100px"} />}
    >
      <Fragment>
        <Helmet>
          <title>Stremio|Edit</title>
        </Helmet>
        {Wrong ? (
          <div>
            <NotFound />

            <Footer />
          </div>
        ) : (
          <div
            style={{
              maxWidth: "700px",
              margin: "2rem auto",
              paddingLeft: "3%",
              paddingRight: "2%",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <Title level={2}> Edit Video</Title>
            </div>

            <Form onSubmit={onSubmit}>
              <div
                style={
                  window.innerWidth > 600
                    ? { display: "flex", justifyContent: "space-between" }
                    : { justifyContent: "space-between" }
                }
              >
                <Dropzone onDrop={onDrop} multiple={false} maxSize={8000000}>
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
                      <span style={{ fontSize: "2rem" }}>Edit Thumbnail</span>
                    </div>
                  )}
                </Dropzone>
                <ReactTooltip />
                {window.innerWidth < 600 && <br />}

                {Thumbnail !== "" ? (
                  <div>
                    <img
                      style={{ maxWidth: "320px", maxHeight: "240px" }}
                      src={Thumbnail}
                      onError={(e) => {
                        e.target.src = NoThumbnail;
                      }}
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
              <Input
                onChange={handleChangeTitle}
                value={title}
                maxLength={100}
              />
              <br />
              <br />
              <label>Description</label>
              <TextArea
                onChange={handleChangeDecsription}
                value={Description}
              />
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
            <Footer />
          </div>
        )}
      </Fragment>
    </Loader>
  );
}

export default EditVideoPage;
