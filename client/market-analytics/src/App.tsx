import React from 'react';
import GlobalStyle from './rt-theme/globals'
import { ThemeProvider } from './rt-theme/ThemeContext'
import styled from 'styled-components/macro'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLightbulb  as farLightBulb} from '@fortawesome/free-regular-svg-icons'
import { faLightbulb as fasLightBulb } from '@fortawesome/free-solid-svg-icons'
import { AppBar } from './containers/main-layout'
import './App.css';

library.add(fasLightBulb, farLightBulb)

function App() {
  return (
    <div className="App">
    <GlobalStyle />
    <ThemeProvider>
        <ParentContainer>
          <h1>Hello welcome to Nigeria stock exchange trading engine</h1>
          <AppBar />
        </ParentContainer>
       
    </ThemeProvider>
     
    </div>
  );
}


const ParentContainer = styled.div `
  width: 100%;
  height: 100%;
  min-height: 100vh;
  max-height: 100vh;
  background-color: ${({ theme }) => theme.secondary.coreSecondary1};
  color: ${({ theme }) => theme.primary.corePrimary};
  
`

export default App;
