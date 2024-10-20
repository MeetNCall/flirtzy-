import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CLOSE_FAKE_STORY_DIALOGUE } from "../../store/fakeStory/fakeStory.type";
import { getFakeHost } from "../../store/fakeHost/fakeHost.action";
import {
  createFakeStory,
  editFakeStory,
} from "../../store/fakeStory/fakeStory.action";
import { Cancel } from "@mui/icons-material";

import Select from "react-select";


const FakeStoryDialogue = () => {
  const { dialog, dialogData } = useSelector((state) => state.fakeStory);
  

  const { fakeHost } = useSelector((state) => state.fakeHost);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [image, setImage] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(getFakeHost());
  }, [dispatch]);

  useEffect(() => {
    if (dialogData) {
      setName(dialogData?.hostId?._id);
      setImagePath(dialogData?.image);
    }
  }, [dialogData]);
  useEffect(
    () => () => {
      setName("");
      setImagePath("");
      setImage([]);
    },
    [dialog]
  );

  const handleClose = () => {
    dispatch({ type: CLOSE_FAKE_STORY_DIALOGUE });
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
    setImagePath(URL.createObjectURL(e.target.files[0]));
  };
  const closePopup = () => {
    dispatch({ type: CLOSE_FAKE_STORY_DIALOGUE });
  };

  const handelSubmit = () => {
     
    if (!name || !image) {
      let error = {};
      if (!name) error.name = "Host is required !";
      if (!image) error.image = "Image is required !";
      return setError({ ...error });
    } else {
      const formData = new FormData();
      formData.append("hostId", name);
      formData.append("image", image);
      if (dialogData) {
        formData.append("storyId", dialogData?._id);
        dispatch(editFakeStory(formData));
      } else {
        dispatch(createFakeStory(formData));
      }

      closePopup();
    }
  };

  return (
    <>
      <Dialog
        open={dialog}
        aria-labelledby="responsive-dialog-title"
        onClose={closePopup}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          id="responsive-dialog-title"
          className="dialogue_background_color"
        >
          <span className="modal-title font-weight-bold h4">Fake Story</span>
        </DialogTitle>

        <IconButton
          style={{
            position: "absolute",
            right: 0,
            color: "#664dc9",
          }}
        >
          <Tooltip title="Close" placement="right">
            <Cancel className="modal-title" onClick={closePopup} />
          </Tooltip>
        </IconButton>
        <DialogContent className="">
          <div className="modal-body pt-1 px-1 pb-3">
            <div className="d-flex flex-column">
              <form>
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <label class="float-left dialog__input__title">
                        Host
                      </label>
                      <select
                        class="form-select form-control"
                        aria-label="Default select example"
                        value={name}
                        disabled={dialogData ? true : false}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (e.target.value === "Select Host") {
                            return setError({
                              ...error,
                              host: "Please select a Host!",
                            });
                          } else {
                            return setError({
                              ...error,
                              host: "",
                            });
                          }
                        }}
                      >
                        <option value="Select host" selected>
                          Select Host
                        </option>
                        {fakeHost.map((host) => {
                          return (
                            <>
                              <option
                                className="text-capitalize"
                                value={host?._id}
                              >
                                {host?.name}
                              </option>
                            </>
                          );
                        })}
                      </select>
                      {/* <Select
                        value={fakeHost?.find((option) => option?._id === name)}
                        options={fakeHost}
                        getOptionLabel={(option) => option?._id} // Assuming uniqueId is the label for options
                        formatOptionLabel={(option) => (
                          <div className="country-option">
                            <img
                              src={option?.image}
                              style={{
                                height: "30px",
                                width: "30px",
                                borderRadius: "50%",
                              }}
                              alt="country-image"
                            />
                            <span
                              className="ms-3"
                              style={{ marginLeft: "20px" }}
                            >
                              {option?.name}
                            </span>
                          </div>
                        )}
                        onChange={(selectedOption) => {
                          setName(selectedOption?._id);
                          if (
                            !selectedOption?._id ||
                            selectedOption?._id === "_id"
                          ) {
                            setError({
                              ...error,
                              name: "Please select a Host!",
                            });
                          } else {
                            setError({
                              ...error,
                              name: "",
                            });
                          }
                        }}
                      /> */}
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
                  <div className="col-12">
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
                      />
                      {imagePath && (
                        <img
                          src={imagePath}
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

export default FakeStoryDialogue;
