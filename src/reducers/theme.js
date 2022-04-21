import { darkTheme } from '../Styles/themes';

export default function theme(state = { theme: darkTheme }, action) { 
    switch (action.type) {
        case 'SET_THEME':
            return {
                ...state,
                theme: action.payload,
            };
        default:
            return state;
    }
  }