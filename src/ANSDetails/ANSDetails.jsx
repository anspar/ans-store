import React, { useEffect, useRef } from 'react'
import { useGet, useANSRead, useANS1155Read } from "@anspar/ans-wallet";
import { useNetwork, useAccount } from "wagmi";
import { CircularProgress } from "@chakra-ui/progress";
import styled from "styled-components";
import { ethers } from "ethers";

const Input = styled.input`
    width: 100%;
    border-style: none;
    border-radius: 0.5rem;
    padding: 0.2rem;
    text-align: center;
    outline-width: 0;
    background-color: var(--as-light);
    color: var(--as-dark);
`;

const TextArea = styled.textarea`
    width: 100%;
    border-style: none;
    border-radius: 0.5rem;
    padding: 0.2rem;
    text-align: center;
    outline-width: 0;
    background-color: var(--as-light);
    color: var(--as-dark);
`;

const DivContentBetween = styled.div`
    width: 100%;
    display: flex;
    justify-content: between;
    align-items: center;
    margin-bottom: 0.5rem;
`;


function ShowInfo(props) {
    const { info } = props;
    const { address } = useAccount()
    const forSale = useANS1155Read(props.chainId, "get_amount_for_sale", [props.data?.id, address]);
    const balanceOf = useANS1155Read(props.chainId, "balanceOf", [address, props.data?.id]);
    const name = useRef();
    const about = useRef();
    const background_color = useRef();
    const image = useRef();
    const web = useRef();
    const twitter = useRef();
    const github = useRef();
    useEffect(() => {
        if (!info) return
        name.current.value = info.name;
        about.current.value = info.about;
        background_color.current.value = info.background_color;
        // image.current.value = info.image;
        web.current.value = info.website;
        twitter.current.value = info.twitter;
        github.current.value = info.github;
        // console.log("dd", data, props.info)
    }, [info])

    return (
        <div style={{ maxWidth: "720px", width: "100%", borderStyle: "none", borderRadius: "0.5rem" }}
            className={`as-text-dark as-bg-light as-shadow-sm`}>
            <DivContentBetween>
                <span style={{ margin: "0 0.5rem", minWidth: "90px" }}>Name</span>
                <Input ref={name} className="as-shadow-sm as-text-size-l" />
            </DivContentBetween>
            <DivContentBetween>
                <span style={{ margin: "0 0.5rem", minWidth: "90px" }}>About</span>
                <TextArea ref={about} className="as-shadow-sm as-text-size-l" />
            </DivContentBetween>
            <DivContentBetween>
                <span style={{ margin: "0 0.5rem", minWidth: "90px" }}>Background Color</span>
                <Input ref={background_color} className="as-shadow-sm as-text-size-l" onChange={(e) => {
                    e.target.style.borderStyle = "solid";
                    e.target.style.borderWidth = "0.3rem";
                    e.target.style.borderColor = e.target.value;
                }} />
            </DivContentBetween>
            <DivContentBetween>
                <span style={{ margin: "0 0.5rem", minWidth: "90px" }}>Image</span>
                <Input ref={image} className="as-shadow-sm as-text-size-l file-upload-btn-fix" type='file' />
            </DivContentBetween>
            <DivContentBetween>
                <span style={{ margin: "0 0.5rem", minWidth: "90px" }}>Website</span>
                <Input ref={web} className="as-shadow-sm as-text-size-l" />
            </DivContentBetween>
            <DivContentBetween>
                <span style={{ margin: "0 0.5rem", minWidth: "90px" }}>Twitter</span>
                <Input ref={twitter} className="as-shadow-sm as-text-size-l" />
            </DivContentBetween>
            <DivContentBetween>
                <span style={{ margin: "0 0.5rem", minWidth: "90px" }}>Github</span>
                <Input ref={github} className="as-shadow-sm as-text-size-l" />
            </DivContentBetween>

            {
                balanceOf.data && balanceOf.data.gt(ethers.BigNumber.from('0'))
                    ?
                    <SellUpdateBtns forSale={forSale} />
                    :
                    <BuyBtn forSale={forSale} data={props.data} />
            }

        </div>
    )
}

function SellUpdateBtns(props) {
    const { data, isLoading } = props.forSale;
    const classes = isLoading ? "as-loading" : "";
    return (
        <DivContentBetween>
            <button className={classes}>Update</button>
            {
                data && data.eq(ethers.BigNumber.from('0')) ?
                    <button className={classes}>Set For Sale</button>
                    :
                    <button className={classes}>Cancel Sale</button>
            }
        </DivContentBetween>
    )
}

function BuyBtn(props) {
    const { data, isLoading } = props.forSale;
    return (
        <button className={isLoading ? "as-loading" : ""} disabled={
            data && data.isZero()
            && !ethers.BigNumber.from(props.data ? props.data.id.toString() : '0').isZero()
        }>Buy</button>
    )
}


function GetInfo(props) {
    const { data, isLoading } = useGet(`${props.data.cid}/info.json`, true);
    return (
        isLoading ?
            <CircularProgress size='50px' color="var(--as-primary)" isIndeterminate></CircularProgress>
            :
            <ShowInfo {...props} info={data} />
    )
}

export default function ANSDetails(props) {
    const { query } = props;
    const { chain } = useNetwork();
    const { data, isLoading } = useANSRead(chain.id, "who_is", [query]);
    useEffect(() => {
        props.setLoading(isLoading)
    }, [isLoading])
    return (
        data && data.id.toString() !== "0" && data.cid !== "" ?
            <GetInfo data={data} query={query} chainId={chain.id} />
            :
            <ShowInfo data={data} query={query} info={false} chainId={chain.id} />
    )
}
