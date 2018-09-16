import * as React from 'react'
import styled from 'styled-components';


const Filename = styled.h1`
    font-size: 24px;
    color: blue;
`;

// const PrintButton = styled.button`
//     padding: 2em;
//     text-align: center;
//     text-decoration: none;
// `;

const FunctionKeyword = styled.span`
    font-size: 20px;
    color: #5f6063;
    font-weight: bold;
`;

const Bold = styled.span`
    font-weight: bold;
`;

const FunctionName = styled.span`
    font-size: 20px;
    color: #76777a;
`;

const StructName = styled.span`
    font-size: 20px;
    color: #76777a;
`;


const AllWrapper = styled.div`
    background: #ccccff;
    height: 100%;
    width: 100%;
`;


const FileWrapper = styled.div`
    padding: 3em;
`;

const FunctionsWrapper = styled.div`
    background: #e8edf4;
    padding: 1em;
    border-radius: 20px;
`;

const TypesWrapper = styled.div`
    background: #e8edf4;
    padding: 1em;
    border-radius: 20px;
`;

const Parameters = styled.span`
    font-weight: light;
    font-size: 18px;
    font-style: italic;
`;

const ReturnValue = styled.span`
    color:red;
    font-weight: heavy;
    font-size: 18px;
    font-style: italic;
`;

const Heading = styled.span`
    font-weight: heavy;
    font-size: 18px;
`;

const StructKeyword = styled.span`
    font-size: 20px;
    color: #5f6063;
    font-weight: bold;
`;


type Props = {
    repo: Object,
}

type State = {
    responseReceived: bool,
}

export class Results extends React.Component<Props, any> {
    constructor(props){
        super(props);
        this.state = {
            detectedLanguages: [],
            response: "",
        }
    }
    
    render(){
        let detectedLanguages = ["Go"];
        let repository = this.props.repo;
        if (this.state.response.length === 0){
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "GET", "localhost:8080/", false ); 
            xmlHttp.send( null );
            let response = JSON.parse(xmlHttp.responseText);
            this.setState({response: response});
            console.log("HEY");
            console.log(this.state.response);
        }
        else{
            let files = this.state.response.map((file, i) => File(file));
            return <AllWrapper>
                {this.renderDropdown(detectedLanguages)}
                {this.renderPrintButton()}
                {files}
            </AllWrapper>;

        }
        // let fake_results = {
        //     "files" : [
        //         {
        //             "name": "src.go",
        //             "functions": [
        //                 {
        //                     "name": "FindTheBeaver",
        //                     "parameters": ["int", "string"],
        //                     "returns": ["bool"],
        //                 },
        //                 {
        //                     "name": "HideTheBeaver",
        //                     "parameters": ["int", "string"],
        //                     "returns": ["bool"],
        //                 }
        //             ],
        //             "types": [
        //                 {
        //                     "name": "Eoin",
        //                     "fields": [
        //                         {
        //                             "name": "height",
        //                             "type": "float",
        //                         },
        //                         {
        //                             "name": "weight",
        //                             "type": "float",
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "name": "Maciej",
        //                     "fields": [
        //                         {
        //                             "name": "height",
        //                             "type": "float",
        //                         },
        //                         {
        //                             "name": "weight",
        //                             "type": "float",
        //                         }
        //                     ]
        //                 }
        //             ]
        //         },
        //         {
        //             "name": "lol.go",
        //             "functions": [
        //                 {
        //                     "name": "Eat",
        //                     "parameters": ["int", "string"],
        //                     "returns": ["bool"],
        //                 },
        //                 {
        //                     "name": "Drink",
        //                     "parameters": ["int", "string"],
        //                     "returns": ["bool"],
        //                 }
        //             ],
        //             "types": [
        //                 {
        //                     "name": "Eoin",
        //                     "fields": [
        //                         {
        //                             "name": "height",
        //                             "type": "float",
        //                         },
        //                         {
        //                             "name": "weight",
        //                             "type": "float",
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "name": "Maciej",
        //                     "fields": [
        //                         {
        //                             "name": "height",
        //                             "type": "float",
        //                         },
        //                         {
        //                             "name": "weight",
        //                             "type": "float",
        //                         }
        //                     ]
        //                 }
        //             ]
        //         }
        //     ],
        // }
        
    }
    
    renderDropdown(detectedLanguages){
        let languageOptions = detectedLanguages.map(
            (lang, i) => <option>{lang}</option>
        )
        return (
            <select onChange={(e) => this.setState(detectedLanguages: e.target.value)}>
                {languageOptions}
            </select>
        )
    }

    renderPrintButton(){
        return (
            <button onClick={this.exportAsPdf}>Export as pdf</button>
        );
    }

    exportAsPdf(){
        window.print();
    }
}



function File(props){
    let functions = props.functions.map((func, i) => (Function(func)));
    let types = props.types.map((type, i) => (Type(type)));
    return (
        <FileWrapper>
            <Filename>{props.name} </Filename>
            <FunctionsWrapper>
                {functions}
            </FunctionsWrapper>
            <TypesWrapper>
                {types}
            </TypesWrapper>
        </FileWrapper>
    );
}

function Function(props){
    let name = props.name;
    let parameters = props.parameters.join(", ");
    let returnValue = props.returns;
    return <>
        <FunctionKeyword>{"function "}</FunctionKeyword><FunctionName>{name}</FunctionName>
        <br></br>
        <Heading>{"Parameters: "}</Heading><Parameters>{parameters}</Parameters>
        <br></br>
        <Heading>{"Returns: "}</Heading><ReturnValue>{returnValue}</ReturnValue>
        <br></br>
        <br></br>
    </>
}

function Type(props){
    let name = props.name;
    let fields = props.fields.map((f, i) => f.type + ' ' + f.name});
    console.log(fields);
    console.log(fields);
    fields = fields.join(", ");
    console.log(fields);
    return <>
        <StructKeyword>{"struct "}</StructKeyword><StructName>{name}</StructName>
        <br></br>
        <Heading>{"Fields: "}</Heading><Parameters>{fields}</Parameters>
        <br></br>
    </>
}