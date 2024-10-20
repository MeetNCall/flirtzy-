import axios from "axios";
import { setToast } from "../../util/toast";
import * as ActionType from "./fakeStory.type";
import { apiInstanceFetch } from "../../util/api";

// get fakeStory
export const getFakeStory = () => (dispatch) => {
  apiInstanceFetch
    .get(`story/getFakeStory`)
    .then((res) => {
      dispatch({ type: ActionType.GET_FAKE_STORY, payload: res.story });
    })
    .catch((error) => console.log(error.message));
};

// create fakeStory

export const createFakeStory = (data) => (dispatch) => {
  axios
    .post(`story/fakeStory`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.CREATE_FAKE_STORY,
          payload: res.data.story,
        });
        setToast("success", "Story created successfully");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error.message));
};

// edit fakeStory

export const editFakeStory = (formData, id) => (dispatch) => {
  axios
    .patch(`story/updateStory`, formData)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.UPDATE_FAKE_STORY,
          payload: { data: res.data.story, id: formData?.storyId },
        });
        setToast("success", `Story  update successfully`);
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error.message));
};

// delete fakeStory

export const deleteFakeStory = (data) => (dispatch) => {
  axios
    .delete(`story/delete?storyId=${data}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.DELETE_FAKE_STORY,
          payload: data,
        });
        setToast("success", "Story update successfully");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error.message));
};

// host disable
