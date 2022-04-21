import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import { func, string } from 'prop-types';

import {ReactComponent as Moon } from '../Images/moon.svg';
import {ReactComponent as Sun }  from '../Images/sun.svg';
import { lightTheme, darkTheme } from '../Styles/themes';
import { GlobalStyles } from '../Styles/global';
import { store } from '../store/TripUsStore';

function LightDarkMode() {
    const [theme, setTheme] = useState('dark');

    React.useEffect(() => {
      const storageTheme = localStorage.getItem('theme');
      if(storageTheme === "light") {
        setTheme('light')
        store.dispatch( {type: 'SET_THEME', payload: lightTheme });
      }
    }, [])

    // The function that toggles between themes
    const toggleTheme = () => {
      // if the theme is not light, then set it to dark
      if (theme === 'light') {
        setTheme('dark');
        store.dispatch( {type: 'SET_THEME', payload: darkTheme });
        localStorage.setItem('theme', 'dark');
      // otherwise, it should be light
      } else {
        setTheme('light');
        store.dispatch( {type: 'SET_THEME', payload: lightTheme });
        localStorage.setItem('theme', 'light');
      }
    }

    const Toggle = ({ theme, toggleTheme }) => {
        const isLight = theme === 'light';

        return (
          <ToggleContainer lightTheme={isLight} onClick={toggleTheme} >
            <Sun />
            <Moon />
          </ToggleContainer>
        );
    };

    Toggle.propTypes = {
        theme: string.isRequired,
        toggleTheme: func.isRequired,
    }
  
    return (
        <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
            <>
                <GlobalStyles />
                <Toggle theme={theme} toggleTheme={toggleTheme} />
            </>
        </ThemeProvider>
    )
}

const ToggleContainer = styled.button`
  background: ${({ theme }) => theme.gradient};
  border: 2px solid ${({ theme }) => theme.toggleBorder};
  border-radius: 30px;
  cursor: pointer;
  display: flex;
  font-size: 0.5rem;
  justify-content: space-between;
  margin: 0 20px 0;
  overflow: hidden;
  padding: 0.5rem;
  position: fixed;
  width: 4rem;
  height: 2rem;
  top: 35px;
  left: 150px;

  svg {
    height: auto;
    width: 1rem;
    transition: all 0.3s linear;
    
    // sun icon
    &:first-child {
      transform: ${({ lightTheme }) => lightTheme ? 'translateY(0)' : 'translateY(100px)'};
    }
    
    // moon icon
    &:nth-child(2) {
      transform: ${({ lightTheme }) => lightTheme ? 'translateY(-100px)' : 'translateY(0)'};
    }
  }
`;

export default LightDarkMode;