import * as React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router';

const HomeContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const HomeSection = styled.div`
    width: 100%;
`
const SearchButton = withRouter(({ history, search }) => {
    return <button onClick={() => history.push("/search/" + search)}>Go</button>
})

export class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = { search: '' }
    }

    render() {
        return <HomeContainer>
            <h2>Input Github, get cheat sheet.</h2>
            <HomeSection>
                <input
                    type="text"
                    placeholder="torvalds/linux"
                    value={this.state.search}
                    onChange={(ev) => this.setState({ search: ev.target.value })} />
                <SearchButton search={this.state.search} />
            </HomeSection>
        </HomeContainer>
    }
}
