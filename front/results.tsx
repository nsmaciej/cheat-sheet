import * as React from 'react'
import styled from 'styled-components';

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
`

const RepoName = styled.h2`
    color: red;
    margin-top: 20px;
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
    min-width: 0; /* For long names */
    overflow: hidden;
    text-overflow: ellipsis;
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
            <button onClick={() => window.print()}>Print</button>
            <a href={`https://github.com/${this.props.repo}`}><RepoName>{this.props.repo}</RepoName></a>
            {Object.keys(this.state.results).map(lang => {
                return <div key={lang}>
                    <h3>{lang} files</h3>
                    {this.renderLanguage(this.state.results[lang])}
                </div>
            })}
            <h3>.js files</h3>
            <p>No results</p>
            <br />
            <h3>.rb files</h3>
            <p>No results</p>
        </>
    }

    renderLanguage(files) {
        if (!files) return null;
        return files.map(file => {
            if (!file.ExportedFuncs || file.ExportedFuncs.length == 0) return null;
            return <FileContainer>
                <FileName><a href="#">{file.Filename}</a></FileName>
                {this.renderFunctions(file.ExportedFuncs)}
            </FileContainer>
        })
    }

    renderFunctions(fns) {
        if (!fns) return null;
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