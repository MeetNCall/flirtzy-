import axios from "axios";
import { setToast } from "../../util/toast";
import * as ActionType from "./fakeHost.type";
import { apiInstanceFetch } from "../../util/api";

// get fakeHost
export const getFakeHost = () => (dispatch) => {
  apiInstanceFetch
    .get(`host?type=fake`)
    .then((res) => {
      dispatch({ type: ActionType.GET_FAKE_HOST, payload: res.host });
    })
    .catch((error) => console.log(error.message));
};

// create fakeHost

export const createFakeHost = (data) => (dispatch) => {
  axios
    .post(`host/AddFakehost`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.CREATE_FAKE_HOST,
          payload: res.data.host,
        });
        setToast("success", "fakeHost created successfully");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error.message));
};

// edit fakeHost

export const editFakeHost = (formData, id) => (dispatch) => {
  console.log("id", id);
  axios
    .patch(`host/updateFakeHost?hostId=${id}`, formData)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.UPDATE_FAKE_HOST,
          payload: { data: res.data.host, id },
        });
        setToast(
          "success",
          `${res.data.host.name}'s info  update successfully`
        );
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error.message));
};

// delete fakeHost

export const deleteFakeHost = (data) => (dispatch) => {
  axios
    .delete(`host/deleteFakeHost?hostId=${data}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.DELETE_FAKE_HOST,
          payload: data,
        });
        setToast("success", "fakeHost update successfully");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error.message));
};

// host disable

export const disableFakeHost = (host) => (dispatch) => {
  axios
    .patch(`host/isBlock?hostId=${host._id}`)
    .then((res) => {
      console.log(res.data.host);
      dispatch({
        type: ActionType.DISABLE_FAKE_HOST,
        payload: { data: res.data.host, id: host._id },
      });
      setToast(
        "success",
        `${host.name} is ${
          res?.data?.host?.isBlock === true
            ? "block Successfully"
            : "unBlock Successfully"
        } !`
      );
    })
    .catch((error) => {
      console.log(error);
      setToast("error", error.message);
    });
};

// fake host is Live

export const isLiveFakeHost = (data) => (dispatch) => {
  axios
    .patch(`host/isLive?hostId=${data?._id}`)
    .then((res) => {
      console.log("res.data", res.data);
      if (res.data.status) {
        dispatch({
          type: ActionType.IS_LIVE_FAKE_HOST,
          payload: { data: res.data.host, id: data._id },
        });
        setToast(
          "success",
          `${data.name} is ${
            res?.data?.host?.isLive === true
              ? "live Successfully"
              : "not live anymore"
          } !`
        );
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
      setToast("error", error.message);
    });
};
export const isBusyFakeHost = (data) => (dispatch) => {
  axios
    .patch(`host/isBusy?hostId=${data?._id}`)
    .then((res) => {
      console.log("res.data", res.data);
      if (res.data.status) {
        dispatch({
          type: ActionType.IS_BUSY_FAKE_HOST,
          payload: { data: res.data.host, id: data?._id },
        });
        setToast(
          "success",
          `${data.name} is ${
            res?.data?.host?.isBusy === true
              ? "busy Successfully"
              : "not busy anymore"
          } !`
        );
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
      setToast("error", error.message);
    });
};
