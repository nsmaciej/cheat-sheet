import * as React from 'react'
import styled from 'styled-components'

const HomeContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const HomeSection = styled.div`
    width: 100%;
`

export const Home = () => {
    return <HomeContainer>
        <h2>Input Github, get cheat sheet.</h2>
        <HomeSection>
            <input type="text" />
            <button>Go</button>
        </HomeSection>
    </HomeContainer>
}
