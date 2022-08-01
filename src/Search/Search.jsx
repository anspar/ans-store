import React, { useRef, useState } from 'react'
import styled from "styled-components";
import ANSDetails from '../ANSDetails/ANSDetails';
import MagnifyingGlassSolid from '../imgs/magnifying-glass-solid';

const Input = styled.input`
    width: 100%;
    border-style: none;
    border-radius: 1rem;
    padding: 0.2rem;
    text-align: center;
    outline-width: 0;
`;

const Div = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;
export default function Search() {
    const input = useRef();
    const [query, setQuery] = useState("");
    const [isLoading, setLoading] = useState(false);
    console.log(query)
    return (
        <Div style={{flexDirection: "column"}}>
            <Div style={{maxWidth: "720px", borderStyle: "none", borderRadius: "1rem"}} 
                        className={`as-text-dark as-bg-light as-shadow-sm`}>
                <Input ref={input} type="text" className={`as-text-dark as-bg-light as-text-size-l ${isLoading?"as-loading":''}`}
                        placeholder='Search for Anspar Namespace'onKeyDown={(e)=>{
                            if(e.key === 'Enter'){
                                setQuery(e.target.value);
                            }
                        }}/>
                <MagnifyingGlassSolid  width='30px' style={{padding: "0 0.5rem"}} className="as-pointer" onClick={()=>{setQuery(input.current.value)}}/>
            </Div>
            <br />
            { query!==""? <ANSDetails query={query} setLoading={setLoading} />:<></>}
        </Div>
    )
}
