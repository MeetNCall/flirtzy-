import * as ActionType from "./fakeHost.type";
const initialState = {
  fakeHost: [],
  dialog: false,
  dialogData: null,
};
export const fakeHostReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_FAKE_HOST:
      return {
        ...state,
        fakeHost: action.payload,
      };
    case ActionType.OPEN_FAKE_HOST_DIALOGUE:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };
    case ActionType.CLOSE_FAKE_HOST_DIALOGUE:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };
    case ActionType.CREATE_FAKE_HOST:
      let data = [...state.fakeHost];
      data.unshift(action.payload);
      return {
        ...state,
        fakeHost: data,
      };
    case ActionType.UPDATE_FAKE_HOST:
      return {
        ...state,
        fakeHost: state.fakeHost.map((data) =>
          data._id === action.payload.id ? action.payload.data : data
        ),
      };
    case ActionType.DELETE_FAKE_HOST:
      return {
        ...state,
        fakeHost: state.fakeHost.filter(
          (data) => data._id !== action.payload && data
        ),
      };
    case ActionType.DISABLE_FAKE_HOST:
      return {
        ...state,
        fakeHost: state.fakeHost.map((data) =>
          data._id === action.payload.id ? action.payload.data : data
        ),
      };

    case ActionType.IS_LIVE_FAKE_HOST:
      return {
        ...state,
        fakeHost: state.fakeHost.map((data) =>
          data._id === action.payload.id ? action.payload.data : data
        ),
      };
    case ActionType.IS_BUSY_FAKE_HOST:
      
      return {
        ...state,
        fakeHost: state.fakeHost.map((data) =>
          data._id === action?.payload?.id ? action?.payload?.data : data
        ),
      };
    default:
      return state;
  }
};
