import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Route, BrowserRouter } from 'react-router-dom'
import styled from 'styled-components'

import { Home } from './home'
import { Results } from './results'
import kLogoPath from './logo.png'

const Logo = styled.img`
    height: 1em;
`

const App = () => {
    return <React.Fragment>
        <h1>
            <Logo src={kLogoPath} />
            Cheat Sheets
            </h1>
        <BrowserRouter>
            <>
                <Route exact path="/" render={() => <Home />} />
                <Route path="/search/:user/:repo" render={({ match }) => <Results repo={match.params.user + "/" + match.params.repo} /> } />
            </>
        </BrowserRouter>
    </React.Fragment>
}

window.addEventListener('load', () => {
    ReactDOM.render(<App />, document.getElementById("main"));
});