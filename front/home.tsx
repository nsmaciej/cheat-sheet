import * as React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router';

const HomeContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
& > * {
    display: block;
}
`;

const CallToAction = styled.h2`
    font-size: 3.5em;
`

const SearchButton = withRouter(({ history, search }) => {
    return <button onClick={() => history.push("/search/" + search)}>Go</button>
})

const SmallHeading = styled.h3`
    margin-top: 40px;
    font-size: 1.2rem;
`

const LinkBox = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 20px;
    padding-top: 10px;
`

const kThingsToTry = [
    "facebookincubator/fbender",
    "eoindavey/demogolibrary",
    "google/go-github"
]

export class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = { search: '' }
    }

    render() {
        return <HomeContainer>
            <CallToAction>Input Github, get cheat sheet.</CallToAction>
            <input
                type="text"
                placeholder="facebookincubator/fbender"
                value={this.state.search}
                onChange={(ev) => this.setState({ search: ev.target.value })} />
            <SearchButton search={this.state.search} />
            <SmallHeading>Things to try!</SmallHeading>
            <LinkBox>
                {kThingsToTry.map(x => <a href={`http://localhost:1234/search/${x}`} key={x}>{x}</a>)}
            </LinkBox>
        </HomeContainer>
    }
}
