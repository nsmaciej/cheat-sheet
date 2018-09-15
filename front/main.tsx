import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Route, BrowserRouter } from 'react-router-dom'

import { Home } from './home'
import { Results } from './results'

const App = () => {
    return <React.Fragment>
        <h1>Cool Name</h1>
        <BrowserRouter>
            <>
                <Route exact path="/" render={() => <Home />} />
                <Route path="/q" render={() => <Results />} />
            </>
        </BrowserRouter>
    </React.Fragment>
}

window.addEventListener('load', () => {
    ReactDOM.render(<App />, document.getElementById("main"));
});