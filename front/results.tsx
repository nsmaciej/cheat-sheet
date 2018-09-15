import * as React from 'react'
import styled from 'styled-components';


const Filename = styled.h1`
    font-size: 24px;
    color: blue;
`;

const FunctionKeyword = styled.span`
    font-size: 20px;
    color: #5f6063;
    font-weight: bold;
`;

const FunctionName = styled.span`
    font-size: 20px;
    color: #76777a;
`;


const AllWrapper = styled.div`
    background: #ccccff;
    height: 100%;
`;


const FileWrapper = styled.div`
    padding: 3em;
`;

const FunctionsWrapper = styled.div`
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

export function Results(){

    let fake_results = {
        "files" : [
            {
                "name": "src.go",
                "functions": [
                    {
                        "name": "FindTheBeaver",
                        "parameters": ["int", "string"],
                        "returns": ["bool"],
                    },
                    {
                        "name": "HideTheBeaver",
                        "parameters": ["int", "string"],
                        "returns": ["bool"],
                    }
                ],
            },
            {
                "name": "lol.go",
                "functions": [
                    {
                        "name": "Eat",
                        "parameters": ["int", "string"],
                        "returns": ["bool"],
                    },
                    {
                        "name": "Drink",
                        "parameters": ["int", "string"],
                        "returns": ["bool"],
                    }
                ],
            }
        ],
    }
    
    let files = fake_results.files.map((file, i) => File(file));
    return <AllWrapper>{files}</AllWrapper>;
}

function File(props){
    let functions = props.functions.map((func, i) => (Function(func)));
    return (
        <FileWrapper>
            <Filename>{props.name} </Filename>
            <FunctionsWrapper>
                {functions}
            </FunctionsWrapper>
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
