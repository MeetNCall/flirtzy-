import axios from "axios";
import * as ActionType from "./dashboard.type";
import { apiInstanceFetch } from "../../util/api";

export const getDashboard = () => (dispatch) => {
  apiInstanceFetch
    .get(`dashboard/admin`)
    .then((res) => {
    
      dispatch({ type: ActionType.GET_DASHBOARD, payload: res.dashboard });
    })
    .catch((error) => console.error(error));
};

export const getChart = (type, startDate, endDate) => (dispatch) => {
  apiInstanceFetch
    .get(
      `dashboard/analyitc?type=${type}&startDate=${startDate}&endDate=${endDate}`
    )
    .then((res) => {
      dispatch({ type: ActionType.CHART_ANALYTIC, payload: res.analytic });
    })
    .catch((error) => console.log(error));
};

export const getChartData = (type, startDate, endDate) => (dispatch) => {
  apiInstanceFetch
    .get(
      `dashboard/analyitc?type=${type}&startDate=${startDate}&endDate=${endDate}`
    )
    .then((res) => {
      dispatch({
        type: ActionType.USER_HOST_ANALYTIC,
        payload: { user: res.user, host: res.host },
      });
    })
    .catch((error) => console.log(error));
};
