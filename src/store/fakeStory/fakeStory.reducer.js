import * as ActionType from "./fakeStory.type";
const initialState = {
  fakeStory: [],
  dialog: false,
  dialogData: null,
};
export const fakeStoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_FAKE_STORY:
      return {
        ...state,
        fakeStory: action.payload,
      };
    case ActionType.OPEN_FAKE_STORY_DIALOGUE:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };
    case ActionType.CLOSE_FAKE_STORY_DIALOGUE:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };
    case ActionType.CREATE_FAKE_STORY:
      let data = [...state.fakeStory];
      data.unshift(action.payload);
      return {
        ...state,
        fakeStory: data,
      };
    case ActionType.UPDATE_FAKE_STORY:
      return {
        ...state,
        fakeStory: state.fakeStory.map((data) =>
          data._id === action.payload.id ? action.payload.data : data
        ),
      };
    case ActionType.DELETE_FAKE_STORY:
      return {
        ...state,
        fakeStory: state.fakeStory.filter(
          (data) => data._id !== action.payload && data
        ),
      };

    default:
      return state;
  }
};
