import * as React from 'react'
import styled from 'styled-components';
import kGoIconPath from './gogo.png'
import kPythonIconPath from './python.png'

const kSvg = `
<?xml version="1.0" encoding="UTF-8"?>
<svg width="109.5px" height="134px" viewBox="0 0 219 268" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="Artboard-3" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <polyline id="left" stroke="#FFEC30" stroke-width="17" points="13 75 13 100.013055 89 187.172002 89 263"></polyline>
        <polyline id="right" stroke="#FFEC30" stroke-width="17" points="121 262 121 186.112216 204 102.598013 204 78"></polyline>
        <text id="code" transform="translate(102.500000, 64.500000) rotate(-40.000000) translate(-102.500000, -64.500000) " font-family="SFProDisplay-Bold, SF Pro Display" font-size="140" font-weight="bold" fill="#FFAB20">
            <tspan x="35" y="114">{ }</tspan>
        </text>
    </g>
</svg>`

const kRedShade = "#fdaeae;"

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
`

const RepoName = styled.h2`
    /* color: red; */
    font-size: 3.5em;
    margin: 0 20px 20px 0;
    display: inline;
`

const FileContainer = styled.div`
    margin-bottom: 40px;
`
const FileName = styled.div`
    margin-top: 10px;
    color: white;
    background: ${(props: { background: string }) => props.background};
    font-weight: bolder;
    padding: 6px;
    font-family: 'Roboto Mono', monospace;
`

const SubFileName = styled.div`
    margin-top: 10px;
    font-weight: bolder;
    padding: 6px 0;
    /* font-size: 1.2rem; */
    font-family: 'Roboto Mono', monospace;
    color: black;
`

const FunctionName = styled.div`
    padding: 7px 0 0;
    min-width: 0; /* For long names */
    overflow: hidden;
    font-size: 0.9rem;
    text-overflow: ellipsis;
`

const CneterAlign = styled.div`
    text-align: center;
`

const Damn = styled.button`
    position: relative;
    bottom: 12px;
`

const Loading = () => (
    <CneterAlign dangerouslySetInnerHTML={{ __html: kSvg }} />
)

export class Results extends React.Component<{ repo: string }, { results: any }> {
    constructor(props) {
        super(props);
        const req = new Request(`http://localhost:8080?repo=${props.repo}`)
        this.state = { results: null }
        fetch(req).then(val => val.json())
            .then(json => {
                this.setState({ results: json })
            })
    }

    render() {
        return <>
            <div className="margin-bottom">
                <a className="nounderline" href={`https://github.com/${this.props.repo}`}><RepoName>{this.props.repo}</RepoName></a>
                <Damn className="noprint" onClick={() => window.print()}>Print</Damn>
            </div>
            {!this.state.results
                ? <Loading />
                : Object.keys(this.state.results).map(lang => {
                    return <div key={lang}>
                        <img height="60" src={lang == ".py" ? kPythonIconPath : kGoIconPath} />
                        {this.renderLanguage(this.state.results[lang])}
                    </div>
                })
            }
        </>
    }

    renderLanguage(files) {
        if (!files) return null;
        return files.map(file => {
            if (!file.ExportedFuncs || file.ExportedFuncs.length == 0) return null;
            return <FileContainer>
                <FileName background="red"><a href={file.URL}>{file.Filename}</a></FileName>
                {this.renderFunctions(file.ExportedFuncs)}
                {this.renderMethods(file.ExportedMethods)}
                {
                    !file.ExportedTypes ? null : <>
                        <SubFileName>Types</SubFileName>
                        <GridContainer>
                            {file.ExportedTypes.map(x => <FunctionName>{x.Name}</FunctionName>)}
                        </GridContainer>
                    </>
                }
            </FileContainer>
        })
    }

    renderMethods(methods) {
        if (!methods) return null;
        return <>
            <FileContainer>
                {Object.keys(methods).map(obj => {
                    return <>
                        <SubFileName key={obj}>{obj}</SubFileName>
                        {this.renderFunctions(methods[obj])}
                    </>
                })}
            </FileContainer>
        </>
    }

    renderFunctions(fns) {
        if (!fns) return null;
        return <>
            <GridContainer>
                {fns.map(fn => {
                    return <FunctionName key={fn.Name}>{fn.Name}({this.renderParams(fn.Params)})</FunctionName>
                })}
            </GridContainer>
        </>
    }

    renderParams(params) {
        if (!params) return "";
        return params.map((x, i) => (
            <React.Fragment>
                {x.Type
                    ? <>{x.Name.trim()} <b>{x.Type.trim()}</b>{i == params.length - 1 ? "" : ", "}</>
                    : <>{x.Name.trim()}{i == params.length - 1 ? "" : ", "}</>
                }
            </React.Fragment>
        ));
    }

    exportAsPdf() {
        window.print();
    }
}