/**
 *  Resetting CSS Usinf ress
 */


 import 'ress'

 import 'typeface-merriweather'
 import 'typeface-roboto'

 import { baselineFontSize } from './fonts'
 import { createGlobalStyle } from 'styled-components/macro'


 export default createGlobalStyle`
    :root, body {
        font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Opens Sans', 'Helvetica Neue', sans-serif;
        font-size: ${baselineFontSize}px;
        line-height: 1rem;
        text-rendering: geometricPrecision;
        font-weight: 300;
    }

    body, #root {
        height: 100vh;
        max-width: 100vw;
    }

    button {
        -webkit-appearance: none;
        border-width: 0;
        border-color: transparent;
    }

    button:focus {
        outline: none;
    }

    html {
        overflow-y: initial;
    }

    a {
        text-decoration: none;
        color: inherit;
    }

    a.visited {
        text-decoration: none;
    }

    svg {
        display: inlinne-block;
        overflow: visible;
    }

    input {
        &:focus {
            outline: none;
        }
    }
    
 `