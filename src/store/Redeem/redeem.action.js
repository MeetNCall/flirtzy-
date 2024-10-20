import axios from "axios";
import { setToast } from "../../util/toast";

import { GET_REDEEM, ACCEPT_REDEEM } from "./redeem.type";
import { apiInstanceFetch } from "../../util/api";

export const getRedeem = (type) => (dispatch) => {
  apiInstanceFetch
    .get(`redeem?type=${type}`)
    .then((res) => {
      if (res.status) {
        dispatch({ type: GET_REDEEM, payload: res.redeem });
      } else {
        setToast("error", res.message);
      }
    })
    .catch((error) => {
      console.log(error);
      setToast("error", error.message);
    });
};

export const acceptRedeem = (id, type) => (dispatch) => {
  axios
    .patch(`redeem/${id}?type=${type}`)
    .then((res) => {
      if (res.data.status) {
        setToast("success", "Accept Success!!");
        dispatch({ type: ACCEPT_REDEEM, payload: res.data.redeem });
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
      setToast("error", error.message);
    });
};

export const acceptRedeemDecline = (id) => (dispatch) => {
  axios
    .patch(`redeem/${id}`)
    .then((res) => {
      if (res.data.status) {
        setToast("error", "Decline Success!!");

        dispatch({ type: ACCEPT_REDEEM, payload: res.data.redeem });
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
      setToast("error", error.message);
    });
};
