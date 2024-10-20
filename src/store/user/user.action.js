import axios from "axios";

import { setToast } from "../../util/toast";
import * as ActionType from "./user.type";
import { apiInstanceFetch } from "../../util/api";

export const getUser = (start,limit) => (dispatch) => {
  apiInstanceFetch
    .get(`user/userGet?start=${start}&limit=${limit}`)
    .then((res) => {
      
      dispatch({
        type: ActionType.GET_USER,
        payload: {userAll: res.userAll,total: res.userCount},
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// get profile

export const getUserProfile = (id) => (dispatch) => {
  apiInstanceFetch
    .get(`user/userProfileByadmin?id=${id}`)
    .then((res) => {
      dispatch({
        type: ActionType.GET_USER_PROFILE,
        payload: res.findUser,
      });
    })
    .catch((error) => {
      console.log(error);
      setToast("error", error.message);
    });
};

export const blockUser = (user) => (dispatch) => {
  axios
    .patch(`user/isBlock?userId=${user._id}`)
    .then((res) => {
      console.log(res.data.user);
      dispatch({
        type: ActionType.GET_USER_BLOCK,
        payload: { data: res.data.user, id: user._id },
      });
      setToast(
        "success",
        `${user.name} Is ${
          user.isBlock !== true ? "Blocked" : "Unblocked"
        } Successfully!`
      );
    })
    .catch((error) => {
      console.log(error);
      setToast("error", error.message);
    });
};
// get history

export const getUserHistory =
  (userId, startDate, endDate, page, size, type) => (dispatch) => {
    apiInstanceFetch
      .get(
        `history/historyForUser?userId=${userId}&type=${type}&start=${page}&limit=${size}&startDate=${startDate}&endDate=${endDate}`
      )
      .then((res) => {
        dispatch({
          type: ActionType.GET_USER_HISTORY,
          payload: res,
        });
      })
      .catch((err) => console.log(err));
  };

// user coin update
export const updateHostCoin = (val, ids) => (dispatch) => {
  axios
    .post(`user/addLessCoin`, { userId: ids, coin: val })
    .then((res) => {
      console.log(res.data);
      if (res.data.status) {
        dispatch({
          type: ActionType.UPDATE_USER_COIN,
          payload: { editHostCoin: res.data.hostExist },
        });
        setToast("success", "User Updated Successfully");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => setToast("error", error));
};
