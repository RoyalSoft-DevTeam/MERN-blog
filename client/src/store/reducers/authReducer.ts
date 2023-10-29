const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  user: null,
};

type ActionType = {
  type: string;
  payload: any;
};

type StateType = {
  token: string | null;
  isAuthenticated: boolean;
  user: null;
};

const authReducer = (
  state: StateType = initialState,
  action: ActionType = { type: "", payload: null }
) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
      };
    case "LOGOUT":
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

export default authReducer;
