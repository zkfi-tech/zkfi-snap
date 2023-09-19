import { SnapAdapter } from '@zkfi-tech/snap-adapter';
import { createContext, ReactNode, Reducer, useContext, useEffect, useReducer } from 'react';
import { SnapInfo } from '../types';

type ActionDispatch = { type: Actions; payload: any };
type State = {
  snap: SnapAdapter;
  isFlask: boolean;
  isInstalled: boolean;
  snapInfo?: SnapInfo;
};

const snapId = 'npm:@zkfi-tech/snap'; // 'local:http://localhost:8080';
const snap = new SnapAdapter(snapId);

const initialState: State = {
  snap,
  isInstalled: false,
  isFlask: false,
};

export const SnapContext = createContext<State>(initialState);

export enum Actions {
  SetInfo = 'SetInstalled',
  SetFlaskDetected = 'SetFlaskDetected',
  SetError = 'SetError',
}

const reducer: Reducer<State, ActionDispatch> = (state, action) => {
  switch (action.type) {
    case Actions.SetInfo:
      return {
        ...state,
        snapInfo: action.payload,
        isInstalled: !!action.payload,
      };

    case Actions.SetFlaskDetected:
      return {
        ...state,
        isFlask: action.payload,
      };

    default:
      return state;
  }
};

export const SnapProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function detectFlask() {
      const isFlaskDetected = await SnapAdapter.isFlask();

      dispatch({
        type: Actions.SetFlaskDetected,
        payload: isFlaskDetected,
      });
    }

    async function detectSnapInstalled() {
      const snapInfo = await snap.get();
      dispatch({
        type: Actions.SetInfo,
        payload: snapInfo,
      });
    }

    detectFlask();

    if (state.isFlask) {
      detectSnapInstalled();
    }
  }, [state.isFlask]);

  if (typeof window === 'undefined') {
    return <>{children}</>;
  }

  return <SnapContext.Provider value={state}>{children}</SnapContext.Provider>;
};

export const useSnap = () => {
  const context = useContext(SnapContext);
  if (context === undefined) {
    throw new Error('useSnap must be used within a SnapProvider');
  }
  return context;
};
