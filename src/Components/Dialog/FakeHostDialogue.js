import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { CLOSE_FAKE_HOST_DIALOGUE } from "../../store/fakeHost/fakeHost.type";
import {
  createFakeHost,
  editFakeHost,
} from "../../store/fakeHost/fakeHost.action";
import $ from "jquery";

import ReactDropzone from "react-dropzone";
import noImage from "../../assets/img/female.png";


const FakeHostDialogue = (props) => {
  const { dialog, dialogData } = useSelector((state) => state.fakeHost);
  

  const [name, setName] = useState("");
  const [image, setImage] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [showImage, setShowImage] = useState();

  const [album, setAlbum] = useState([]);

  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [videoType, setVideoType] = useState(1);
  const [imageType, setImageType] = useState(1);
  const [error, setError] = useState("");

  const [video, setVideo] = useState("");
  const [videoPath, setVideoPath] = useState("");
  const [showVideo, setShowVideo] = useState();

  useEffect(() => {
    if (dialogData) {
      setEmail(dialogData?.email);
      setName(dialogData?.name);
      setGender(dialogData?.gender);
      setCountry(dialogData?.country);
      setAge(dialogData?.age);
      setBio(dialogData?.bio);
      setVideoType(dialogData?.videoType?.toString());
      setImageType(dialogData?.imageType?.toString());
      setAlbum(dialogData?.album);

      if (dialogData?.videoType === 1) {
        setVideoPath(dialogData?.video);
      } else if (dialogData?.videoType === 0) {
        setShowVideo(dialogData?.video);
      }
      if (dialogData?.imageType === 1) {
        setImagePath(dialogData?.image);
      } else if (dialogData?.videoType === 0) {
        setShowImage(dialogData?.image);
      }
    }
  }, [dialog]);

  useEffect(
    () => () => {
      setName("");
      setEmail("");
      setBio("");
      setAge("");
      setImagePath("");
      setImage([]);
      setCountry("");
      setVideoType("");
      setImageType("");
      setError("");
      setAlbum([]);
      setVideoPath("");
      setVideo([]);
      setGender("");
    },
    [dialog]
  );

  useEffect(() => {
    window.onbeforeunload = handleClose();
  }, []);

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch({ type: CLOSE_FAKE_HOST_DIALOGUE });
  };

  const isValidURL = (url) => {
    if (typeof url !== "string") {
      return false; // Make sure url is a string
    }

    const urlRegex = /^(ftp|http|https):\/[^ "]+$/;
    return urlRegex.test(url) || url?.startsWith("blob:");
  };

  const handelSubmit = () => {
    if (
      !name ||
      !bio ||
      !email ||
      !age ||
      age < 18 ||
      !country ||
      !gender ||
      !videoType ||
      (imageType === 1 && !imagePath) ||
      (imageType === 1 && !isValidURL(imagePath)) ||
      (videoType === 1 && !videoPath) ||
      (videoType === 1 && !isValidURL(videoPath))
    ) {
      const error = {};
      if (!name) error.name = "Name is required";
      if (!bio) error.bio = "Bio is Required";
      if (!email) error.email = "Email is required";
      if (!age) error.age = "Age is required";
      if (age < 18) error.age = "Age can't be under 18";
      if (!gender) error.gender = "Gender is required";
      if (!videoType) error.videoType = "Link Type Is Required";
      if (!imageType) error.imageType = "Image Type Is Required";
      if (!country) error.country = "Country is Required";
      if (album.length === 0) error.album = "At least one image is required";

      // Validate based on type
      if (videoType === 1) {
        if (!videoPath) {
          error.video = "Video URL is required";
        } else if (!isValidURL(videoPath)) {
          error.video = "Invalid video URL";
        }
      } else if (videoType === 0) {
        if (!video || video.length === 0) {
          error.video = "Video file is required";
        }
      }

      if (imageType === 1) {
        if (!imagePath) {
          error.image = "Image URL is required";
        } else if (!isValidURL(imagePath)) {
          error.image = "Invalid image URL";
        }
      } else if (imageType === 0) {
        if (!image || image.length === 0) {
          error.image = "Image file is required";
        }
      }
      return setError({ ...error });
    } else {
      
      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("age", age);
      formData.append("gender", gender);
      formData.append("videoType", parseInt(videoType));

      formData.append("imageType", parseInt(imageType));

      formData.append("bio", bio);
      imageType == 1
        ? formData.append("image", imagePath)
        : formData.append("image", image);
      videoType == 1
        ? formData.append("video", videoPath)
        : formData.append("video", video);
      formData.append("country", country);
      for (let i = 0; i < album.length; i++) {
        formData.append("album", album[i]);
      }

      if (dialogData) {
        props.editFakeHost(formData, dialogData?._id);
      } else {
        props.createFakeHost(formData);
      }
      handleClose();
    }
  };

  const handleKeyPress = (event) => {
    if (event.key == "Enter") {
      handelSubmit();
    }
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
    setImagePath(URL.createObjectURL(e.target.files[0]));
    setShowImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleVideo = (e) => {
    setVideo(e.target.files[0]);
    setVideoPath(URL.createObjectURL(e.target.files[0]));
    setShowVideo(URL.createObjectURL(e.target.files[0]));
  };

  const onPreviewDrop = (files) => {
    setError({ ...error, album: "" });
    files.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );

    setAlbum(album.concat(files));
  };

  const removeImage = (file) => {
    const newFiles = [...album];
    album.splice(newFiles.indexOf(file), 1);
    if (file.preview) {
      const images = album.filter((ele) => {
        return ele.preview !== file.preview;
      });
      setAlbum(images);
    } else {
      const newFiles = [...album];
      album.splice(newFiles.indexOf(file), 1);
      setAlbum(newFiles);
    }
  };

  // set default image

  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", noImage);
    });
  });
  return (
    <>
      <Dialog
        open={dialog}
        aria-labelledby="responsive-dialog-title"
        onClose={handleClose}
        disableBackdropClick
        disableEscapeKeyDown
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          id="responsive-dialog-title"
          className="dialogue_background_color"
        >
          <span className="modal-title font-weight-bold h4">
            Fake Host {dialogData ? "Edit" : "Create"}
          </span>
        </DialogTitle>
        <DialogContent className="dialogue_background_color">
          <div className="modal-body pt-1 px-1 pb-3">
            <div className="d-flex flex-column">
              <form>
                <div className="row">
                  <div className="col-md-6 col-12">
                    <div>
                      <div className="form-group mb-0">
                        <p className="form-label fw-bold mt-3"> Name </p>
                      </div>
                      <input
                        type="text"
                        placeholder="Name"
                        className="form-control"
                        autocomplete="off"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (!e.target.value)
                            return setError({
                              ...error,
                              name: "Name Is Required !",
                            });
                          else {
                            return setError({
                              ...error,
                              name: "",
                            });
                          }
                        }}
                        onKeyPress={handleKeyPress}
                      />
                      {error.name && (
                        <div class="pl-1 text-left">
                          <Typography
                            variant="caption"
                            color="error"
                            style={{ fontFamily: "Circular-Loom" }}
                          >
                            {error.name}
                          </Typography>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div>
                      <div className="form-group mb-0">
                        <p className="form-label fw-bold mt-3"> Email </p>
                      </div>
                      <input
                        type="text"
                        min="0"
                        placeholder="Email"
                        className="form-control pe-1"
                        autocomplete="off"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (!e.target.value)
                            return setError({
                              ...error,
                              email: "Email  Is Required !",
                            });
                          else {
                            return setError({
                              ...error,
                              email: "",
                            });
                          }
                        }}
                        onKeyPress={handleKeyPress}
                      />
                      {error.email && (
                        <div class="pl-1 text-left">
                          <Typography
                            variant="caption"
                            color="error"
                            style={{ fontFamily: "Circular-Loom" }}
                          >
                            {error.email}
                          </Typography>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 col-12">
                    <div>
                      <div>
                        <div className="form-group mb-0">
                          <p className="form-label fw-bold mt-3">Age</p>
                        </div>
                        <input
                          type="number"
                          placeholder="Age"
                          value={age}
                          className="form-control pe-1"
                          autocomplete="off"
                          onChange={(e) => {
                            setAge(
                              (e.target.value = Math.max(
                                0,
                                parseInt(e.target.value)
                              )
                                .toString()
                                .slice(0, 2))
                            );
                            if (!e.target.value)
                              return setError({
                                ...error,
                                age: "Age Is Required !",
                              });
                            else {
                              return setError({
                                ...error,
                                age: "",
                              });
                            }
                          }}
                          onKeyPress={handleKeyPress}
                        />
                      </div>
                      {error.age && (
                        <div class="pl-1 text-left">
                          <Typography
                            variant="caption"
                            color="error"
                            style={{ fontFamily: "Circular-Loom" }}
                          >
                            {error.age}
                          </Typography>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-12">
                    <div>
                      <div className="form-group mb-0">
                        <p className="form-label fw-bold mt-3"> Country</p>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        value={country}
                        onChange={(e) => {
                          setCountry(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              country: "Country Is Required !",
                            });
                          } else {
                            return setError({
                              ...error,
                              country: "",
                            });
                          }
                        }}
                        onKeyPress={handleKeyPress}
                      />
                    </div>
                    {error.country && (
                      <div class="pl-1 text-left">
                        <Typography
                          variant="caption"
                          color="error"
                          style={{ fontFamily: "Circular-Loom" }}
                        >
                          {error.country}
                        </Typography>
                      </div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 col-12">
                    <div>
                      <div>
                        <div className="form-group mb-0">
                          <p className="form-label fw-bold mt-3"> Bio</p>
                        </div>
                        <input
                          type="text"
                          placeholder="Bio"
                          value={bio}
                          className="form-control "
                          autocomplete="off"
                          onChange={(e) => {
                            setBio(e.target.value);
                            if (!e.target.value)
                              return setError({
                                ...error,
                                bio: "Bio Is Required !",
                              });
                            else {
                              return setError({
                                ...error,
                                bio: "",
                              });
                            }
                          }}
                          onKeyPress={handleKeyPress}
                        />
                      </div>
                      {error.bio && (
                        <div class="pl-1 text-left">
                          <Typography
                            variant="caption"
                            color="error"
                            style={{ fontFamily: "Circular-Loom" }}
                          >
                            {error.bio}
                          </Typography>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <p className="form-label fw-bold mt-3 "> Gender</p>
                    <FormControl className="mb-0">
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={gender}
                        onChange={(e) => {
                          setGender(e.target.value);
                          if (!e.target.value)
                            return setError({
                              ...error,
                              gender: "Gender Is Required !",
                            });
                          else {
                            return setError({
                              ...error,
                              gender: "",
                            });
                          }
                        }}
                      >
                        <FormControlLabel
                          value="Male"
                          control={<Radio />}
                          label="Male"
                        />
                        <FormControlLabel
                          value="Female"
                          control={<Radio />}
                          label="Female"
                        />
                      </RadioGroup>
                    </FormControl>
                    {error.gender && (
                      <div class="pl-1 text-left">
                        <Typography
                          variant="caption"
                          color="error"
                          style={{ fontFamily: "Circular-Loom" }}
                        >
                          {error.gender}
                        </Typography>
                      </div>
                    )}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 col-12">
                    <p className="form-label fw-bold mt-3 ">Video Type</p>
                    <FormControl className="mb-0">
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={videoType}
                        onChange={(e) => {
                          setVideoType(e.target.value);
                          if (!e.target.value)
                            return setError({
                              ...error,
                              videoType: "LinkType Is Required !",
                            });
                          else {
                            return setError({
                              ...error,
                              videoType: "",
                            });
                          }
                        }}
                      >
                        <FormControlLabel
                          value="1"
                          control={<Radio />}
                          label="Link"
                          checked={videoType == 1 ? true : false}
                        />
                        <FormControlLabel
                          value="0"
                          control={<Radio />}
                          label="File"
                          checked={videoType == 0 ? true : false}
                        />
                      </RadioGroup>
                    </FormControl>
                    {error.videoType && (
                      <div class="pl-1 text-left">
                        <Typography
                          variant="caption"
                          color="error"
                          style={{ fontFamily: "Circular-Loom" }}
                        >
                          {error.videoType}
                        </Typography>
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 col-12">
                    <p className="form-label fw-bold mt-3 ">Image Type</p>
                    <FormControl className="mb-0">
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={imageType}
                        onChange={(e) => {
                          setImageType(e.target.value);
                          if (!e.target.value)
                            return setError({
                              ...error,
                              imageType: "Image Type Is Required !",
                            });
                          else {
                            return setError({
                              ...error,
                              imageType: "",
                            });
                          }
                        }}
                      >
                        <FormControlLabel
                          value="1"
                          control={<Radio />}
                          label="Link"
                          checked={imageType == 1 ? true : false}
                        />
                        <FormControlLabel
                          value="0"
                          control={<Radio />}
                          label="File"
                          checked={imageType == 0 ? true : false}
                        />
                      </RadioGroup>
                    </FormControl>
                    {error.imageType && (
                      <div class="pl-1 text-left">
                        <Typography
                          variant="caption"
                          color="error"
                          style={{ fontFamily: "Circular-Loom" }}
                        >
                          {error.imageType}
                        </Typography>
                      </div>
                    )}
                  </div>
                </div>

                <div className="row">
                  {videoType == 0 ? (
                    <div className="col-md-6 col-12 my-2">
                      <div>
                        <div className="form-group mb-0">
                          <p className="form-label fw-bold mt-3">Host Video</p>
                        </div>
                        <input
                          type="file"
                          accept="video/mp4,video/x-m4v,video/*"
                          className="form-control "
                          autocomplete="off"
                          onChange={(e) => handleVideo(e)}
                          onKeyPress={handleKeyPress}
                        />
                        {showVideo && (
                          <video
                            autoPlay
                            controls={true}
                            src={showVideo}
                            alt="hostImage"
                            draggable="false"
                            className="p-3 "
                            width={100}
                          />
                        )}
                        {error.video && (
                          <div class="pl-1 text-left">
                            <Typography
                              variant="caption"
                              color="error"
                              style={{ fontFamily: "Circular-Loom" }}
                            >
                              {error.video}
                            </Typography>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="col-md-6 col-12 my-2">
                      <div>
                        <div className="form-group mb-0">
                          <p className="form-label fw-bold mt-3"> Video Link</p>
                        </div>
                        <input
                          type="text"
                          placeholder="Video URL"
                          value={videoPath}
                          className="form-control "
                          autocomplete="off"
                          onChange={(e) => {
                            setVideoPath(e.target.value);
                            if (!e.target.value)
                              return setError({
                                ...error,
                                video: "videoPath Is Required !",
                              });
                            else {
                              return setError({
                                ...error,
                                video: "",
                              });
                            }
                          }}
                          onKeyPress={handleKeyPress}
                        />
                        {videoPath && (
                          <video
                            src={videoPath}
                            alt="hostImage"
                            draggable="false"
                            className="p-3 dialogueImageVideoShow"
                            width={100}
                          />
                        )}

                        {error.video && (
                          <div class="pl-1 text-left">
                            <Typography
                              variant="caption"
                              color="error"
                              style={{ fontFamily: "Circular-Loom" }}
                            >
                              {error.video}
                            </Typography>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {imageType == 0 ? (
                    <div className="col-md-6 col-12 my-2">
                      <div>
                        <div className="form-group mb-0">
                          <p className="form-label fw-bold mt-3">Host Image</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control "
                          autocomplete="off"
                          onChange={(e) => handleImage(e)}
                          onKeyPress={handleKeyPress}
                        />
                        {showImage && (
                          <img
                            src={showImage}
                            alt="hostImage"
                            draggable="false"
                            className="p-3 "
                            width={100}
                          />
                        )}
                        {error.image && (
                          <div class="pl-1 text-left">
                            <Typography
                              variant="caption"
                              color="error"
                              style={{ fontFamily: "Circular-Loom" }}
                            >
                              {error.image}
                            </Typography>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="col-md-6 col-12 my-2">
                      <div>
                        <div className="form-group mb-0">
                          <p className="form-label fw-bold mt-3"> Image Link</p>
                        </div>
                        <input
                          type="text"
                          placeholder="Image URl"
                          value={imagePath}
                          className="form-control "
                          autocomplete="off"
                          onChange={(e) => {
                            setImagePath(e.target.value);
                            if (!e.target.value)
                              return setError({
                                ...error,
                                image: "imagePath Is Required !",
                              });
                            else {
                              return setError({
                                ...error,
                                image: "",
                              });
                            }
                          }}
                          onKeyPress={handleKeyPress}
                        />
                        {imagePath && (
                          <img
                            src={imagePath}
                            alt="hostImage"
                            draggable="false"
                            className="p-3 dialogueImageVideoShow"
                            width={100}
                          />
                        )}

                        {error.image && (
                          <div class="pl-1 text-left">
                            <Typography
                              variant="caption"
                              color="error"
                              style={{ fontFamily: "Circular-Loom" }}
                            >
                              {error.image}
                            </Typography>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="row">
                  <div>
                    <div className="form-group mb-0">
                      <p className="form-label fw-bold mt-3"> Host Image</p>
                    </div>

                    <div className="hostAlbum d-flex">
                      <ReactDropzone
                        onDrop={(acceptedFiles) => onPreviewDrop(acceptedFiles)}
                        accept="image/*"
                      >
                        {({ getRootProps, getInputProps }) => (
                          <section className="mx-2">
                            <div {...getRootProps()}>
                              <input {...getInputProps()} />
                              <div
                                style={{
                                  height: 130,
                                  width: 130,
                                  border: "2px dashed gray",
                                  textAlign: "center",
                                  marginTop: "10px",
                                }}
                              >
                                <i
                                  className="fas fa-plus"
                                  style={{ paddingTop: 30, fontSize: 70 }}
                                ></i>
                              </div>
                            </div>
                          </section>
                        )}
                      </ReactDropzone>
                      <div
                        className="hostImagePre d-flex ms-5"
                        style={{ flexWrap: "wrap" }}
                      >
                        {album?.length > 0 &&
                          album?.map((file, index) => {
                            return file?.type?.split("image")[0] === "" ? (
                              <>
                                <img
                                  height="60px"
                                  width="60px"
                                  alt="app"
                                  src={file.preview}
                                  style={{
                                    boxShadow:
                                      "0 5px 15px 0 rgb(105 103 103 / 00%)",
                                    border: "2px solid #fff",
                                    borderRadius: 10,
                                    marginTop: 10,
                                    float: "left",
                                    objectFit: "contain",
                                    marginRight: 15,
                                  }}
                                  draggable="false"
                                />
                                <div
                                  class="img-container"
                                  style={{
                                    display: "inline",
                                    position: "relative",
                                    float: "left",
                                  }}
                                >
                                  <i
                                    class="fas fa-times-circle text-danger"
                                    style={{
                                      position: "absolute",
                                      right: "10px",
                                      top: "4px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => removeImage(file)}
                                  ></i>
                                </div>
                              </>
                            ) : (
                              <>
                                <img
                                  height="60px"
                                  width="60px"
                                  alt="app"
                                  src={file}
                                  style={{
                                    boxShadow:
                                      "0 5px 15px 0 rgb(105 103 103 / 00%)",
                                    border: "2px solid #fff",
                                    borderRadius: 10,
                                    marginTop: 10,
                                    float: "left",
                                    objectFit: "contain",
                                    marginRight: 15,
                                  }}
                                  draggable="false"
                                />
                                <div
                                  class="img-container"
                                  style={{
                                    display: "inline",
                                    position: "relative",
                                    float: "left",
                                  }}
                                >
                                  <i
                                    class="fas fa-times-circle text-danger"
                                    style={{
                                      position: "absolute",
                                      right: "10px",
                                      top: "4px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => removeImage(file)}
                                  ></i>
                                </div>
                              </>
                            );
                          })}
                      </div>
                    </div>
                    {error.album && (
                      <div class="pl-1 text-left">
                        <Typography
                          variant="caption"
                          color="error"
                          style={{ fontFamily: "Circular-Loom" }}
                        >
                          {error.album}
                        </Typography>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 float-right">
                  {dialogData ? (
                    <button
                      type="button"
                      class="btn btn-info px-3"
                      onClick={handelSubmit}
                    >
                      Update
                    </button>
                  ) : (
                    <button
                      type="button"
                      class="btn btn-info px-3"
                      onClick={handelSubmit}
                    >
                      Insert
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn ml-2 btn-danger px-3"
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default connect(null, { editFakeHost, createFakeHost })(
  FakeHostDialogue
);
