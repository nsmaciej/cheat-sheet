import * as React from 'react'
import styled from 'styled-components';

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
`

const RepoName = styled.h2`
    color: red;
    margin-bottom: 20px;
`

const FileContainer = styled.div`
    margin-bottom: 40px;
`
const FileName = styled.div`
    margin-top: 10px;
    color: white;
    background: red;
    font-weight: bolder;
    padding: 6px;
    font-family: 'Roboto Mono', monospace;
`

const FunctionName = styled.div`
    padding: 7px 0 0;
`

export class Results extends React.Component<{ repo: string }, { results: any }> {
    constructor(props) {
        super(props);
        const req = new Request(`http://localhost:8080?repo=${props.repo}`)
        this.state = { results: {} }
        fetch(req).then(val => val.json())
            .then(json => {
                this.setState({ results: json })
            })
    }

    render() {
        return <>
            <a href={`https://github.com/${this.props.repo}`}><RepoName>{this.props.repo}</RepoName></a>
            {Object.keys(this.state.results).map(lang => {
                return <div key={lang}>
                    <h3>{lang} files</h3>
                    {this.renderLanguage(this.state.results[lang])}
                </div>
            })}
            <h3>.js files</h3>
            <h3>.rb files</h3>
        </>
    }

    renderLanguage(files) {
        return files.map(file => {
            return <FileContainer>
                <FileName>{file.Filename}</FileName>
                {this.renderFunctions(file.ExportedFuncs)}
            </FileContainer>
        })
    }

    renderFunctions(fns) {
        return <>
            <GridContainer>
                {fns.map(fn => <FunctionName>{fn.Name}()</FunctionName>)}
            </GridContainer>
        </>
    }

    exportAsPdf() {
        window.print();
    }
}