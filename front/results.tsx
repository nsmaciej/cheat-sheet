import * as React from 'react'
import styled from 'styled-components';

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

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
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
    font-size: 0.9rem;
    text-overflow: ellipsis;
`

const CneterAlign = styled.div`
    text-align: center;
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
            <button className="noprint" onClick={() => window.print()}>Print</button>
            <a href={`https://github.com/${this.props.repo}`}><RepoName>{this.props.repo}</RepoName></a>
            {!this.state.results
                ? <Loading />
                : Object.keys(this.state.results).map(lang => {
                    return <div key={lang}>
                        <h3>{lang} files</h3>
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
                <FileName><a href={file.URL}>{file.Filename}</a></FileName>
                {this.renderFunctions(file.ExportedFuncs)}
            </FileContainer>
        })
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

    renderFunctions(fns_raw) {
        if (!fns_raw) return null;
        let seen = new Set();
        let fns = [];
        for (const fn of fns_raw) {
            if (seen.has(fn.Name)) continue;
            seen.add(fn.Name)
            fns.push(fn)
        }
        return <>
            <GridContainer>
                {fns.map(fn => {
                    return <FunctionName key={fn.Name}>{fn.Name}({this.renderParams(fn.Params)})</FunctionName>
                })}
            </GridContainer>
        </>
    }

    exportAsPdf() {
        window.print();
    }
}