import { injectable } from "inversify";
import lodash from "lodash";
import redux from "redux";

export type State = {
  readonly version: string;
  readonly easylabUserLoggedIn: boolean;
  readonly easylabLoginInProgress: boolean;
  readonly loggedInUser: any[];
  readonly expectedUser: number;
  readonly machinesInUse: any[];
  readonly alarm: boolean;
};

const initialState: State = {
  version: "0.0.1",
  easylabUserLoggedIn: false,
  easylabLoginInProgress: false,
  loggedInUser: [],
  expectedUser: 0,
  machinesInUse: [],
  alarm: false
};

export interface IStateManager {
  Subscribe(listener: () => void): void;
  Dispatch(action: string, payload?: any): void;
  GetState(): State;
}

@injectable()
export class StateManager implements IStateManager {
  private _store = redux.createStore<State, any, any, any>(
    this._reducerFunction,
    initialState
  );

  public Subscribe(listener: () => void): void {
    this._store.subscribe(listener);
  }

  public Dispatch(action: string, payload: any = null) {
    this._store.dispatch(
      Object.assign(
        {},
        {
          type: action
        },
        payload
      )
    );
  }

  public GetState(): State {
    return this._store.getState();
  }

  private _reducerFunction(state: State, action: redux.AnyAction): State {
    switch (action.type) {
      case "EASYLAB_LOGIN_IN_PROGRESS":
        return Object.assign({}, state, {
          easylabLoginInProgress: true
        });

      case "EASYLAB_LOGIN_SUCCESSFULL":
        return Object.assign({}, state, {
          easylabUserLoggedIn: true,
          easylabLoginInProgress: false
        });

      case "LOGIN_USER":
        state.loggedInUser.push(action.userInfo);

        return Object.assign({}, state, {
          loggedInUser: state.loggedInUser
        });

      case "LOGOUT_USER":
        lodash.remove(state.loggedInUser, o => o.nfcId === action.nfcId);

        return Object.assign({}, state, {
          loggedInUser: state.loggedInUser,
          expectedUser: state.loggedInUser.length
        });

      case "START_ALARM":
        return Object.assign({}, state, {
          alarm: true,
          expectedUser: state.expectedUser - 1
        });

      case "STOP_ALARM":
        return Object.assign({}, state, {
          alarm: false
        });

      case "USER_ENTRANCE":
        return Object.assign({}, state, {
          expectedUser: state.expectedUser + 1
        });

      case "USER_EXIT":
        return state;

      case "MACHINE_STARTED":
        state.machinesInUse.push({
          mid: action.mid,
          uid: action.uid
        });

        return Object.assign({}, state, {
          machinesInUse: state.machinesInUse
        });

      case "MACHINE_STOPPED":
        lodash.remove(state.machinesInUse, o => o.mid === action.mid);

        return Object.assign({}, state, {
          machinesInUse: state.machinesInUse
        });

      default:
        return state;
    }
  }
}
