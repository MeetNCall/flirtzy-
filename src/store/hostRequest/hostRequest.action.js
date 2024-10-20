import axios from "axios";
import { setToast } from "../../util/toast";
import * as ActionType from "./hostRequest.type";
import { apiInstanceFetch } from "../../util/api";

// get host request
export const getHostRequest = () => (dispatch) => {
  apiInstanceFetch
    .get("request/newRequest")
    .then((res) => {
      dispatch({
        type: ActionType.GET_HOST_REQUEST,

        payload: res.requestAll,
      });
    })
    .catch((error) => console.log("error", error));
};

// edit request
export const hostRequestUpdate = (fromData, id) => (dispatch) => {
 
  axios
    .patch(`request/${id}`, fromData)
    .then((res) => {

      if (res.data.status) {
        setToast("success", "Update Successfully!");
        dispatch({
          type: ActionType.EDIT_HOST_REQUEST,
          payload: { editHost: res.data.request, id },
        });
      } else {
     
        setToast("error", res.data.message);
      }
    })
    .catch((error) => {
      console.log('first', error.response.data.message)
     
      setToast("error", error.response.data.message);
    });
};

// host Request accept
export const hostRequestAccept = (id) => (dispatch) => {
  axios
    .put(`request/${id}`)
    .then((res) => {
      console.log(res.data);
      if (res.data.status) {
        dispatch({ type: ActionType.ACCEPT_HOST_REQUEST, payload: id });
        setToast("success", "Host Request Accept!");
      }
    })
    .catch((error) => console.log("error", error));
};
