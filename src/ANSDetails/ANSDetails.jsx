import React, { useEffect, useRef } from 'react'
import { useGet, useANSRead, useANS1155Read, useANSWrite } from "@anspar/ans-wallet";
import { useNetwork, useAccount } from "wagmi";
import { ethers } from "ethers";
import {
    DivContentBetween,
    Input,
    TextArea,
    DivContentStartCol
} from "./ANSDetails.styles";
import { BuyBtn } from "./BuyBtns";
import { SellUpdateBtns } from "./SellUpdateBtns";
import { Loading } from "./Utils";

function ShowInfo({ info, chainId, chainSymbol, query, ...props }) {
    const { address, isConnected } = useAccount()
    
    const balanceOf = useANS1155Read(chainId, "balanceOf", [address, props.data ? props.data.id : "0"]);
    const name = useRef();
    const about = useRef();
    const color = useRef();
    const background_color = useRef();
    const image = useRef();
    const website = useRef();
    const twitter = useRef();
    const github = useRef();
    useEffect(() => {
        if (!info) return
        name.current.value = info.name || '';
        about.current.value = info.about || '';
        background_color.current.value = info.background_color || '';
        color.current.value = info.color || '';
        // image.current.value = info.image;
        website.current.value = info.website || '';
        twitter.current.value = info.twitter || '';
        github.current.value = info.github || '';
    }, [info])

    const inputs = {
        name, about, color, background_color, image, website, twitter, github
    }

    const Btns = balanceOf.data && balanceOf.data.gt(ethers.BigNumber.from('0'))
        ?
        <SellUpdateBtns query={query} ownerAddress={props.data?.target} address={address} ansId={props.data?.id} chainId={chainId} chainSymbol={chainSymbol} inputs={inputs} />
        :
        <BuyBtn query={query} ownerAddress={props.data?.target} ansId={props.data?.id} chainId={chainId} chainSymbol={chainSymbol} inputs={inputs} />;


    if (isConnected) return (
        <div style={{ maxWidth: "720px", width: "100%", borderStyle: "none", borderRadius: "0.5rem" }}
            className={`as-text-dark as-bg-light as-shadow-sm`}>
            <span className='as-text-dark as-text-size-sm as-text-bold' style={{ padding: "0.5rem" }}>
                * Information provided here will be public
            </span>
            <br />
            <DivContentBetween>
                <span style={{ margin: "0 0.5rem", width: "95px" }} className='as-text-size-sm as-text-bold as-text-primary'>{query}</span>
            </DivContentBetween>
            {
                props.data?.target === address ?
                    <DivContentStartCol>
                        <SetDefault chainId={chainId} query={query} />
                    </DivContentStartCol>
                    :
                    <></>
            }
            <DivContentBetween>
                <span style={{ margin: "0 0.5rem", width: "95px" }}>Name</span>
                <Input ref={name} className=" as-text-size-l" placeholder='Your Name' />
            </DivContentBetween>
            <DivContentBetween>
                <span style={{ margin: "0 0.5rem", width: "95px" }}>About</span>
                <TextArea ref={about} className=" as-text-size-l" placeholder='Short description about you' />
            </DivContentBetween>
            <DivContentBetween>
                <span style={{ margin: "0 0.5rem", width: "95px" }}>Color</span>
                <Input ref={color} placeholder="#ffffffff" className=" as-text-size-l" onChange={(e) => {
                    e.target.style.borderStyle = "solid";
                    e.target.style.borderWidth = "0.3rem";
                    e.target.style.borderColor = e.target.value;
                }} />
            </DivContentBetween>
            <DivContentBetween>
                <span style={{ margin: "0 0.5rem", width: "95px" }}>Background Color</span>
                <Input ref={background_color} placeholder="#00000000" className=" as-text-size-l" onChange={(e) => {
                    e.target.style.borderStyle = "solid";
                    e.target.style.borderWidth = "0.3rem";
                    e.target.style.borderColor = e.target.value;
                }} />
            </DivContentBetween>
            <DivContentBetween>
                <span style={{ margin: "0 0.5rem", width: "95px" }}>Image</span>
                <DivContentStartCol style={{ margin: "0 0.2rem" }}>
                    <span className='as-text-dark as-text-size-sm as-text-bold'>Current: {info?.image}</span>
                    <Input ref={image} className="as-text-size-l" type='file' style={{ margin: 0 }} />
                </DivContentStartCol>
            </DivContentBetween>
            <DivContentBetween>
                <span style={{ margin: "0 0.5rem", width: "95px" }}>Website</span>
                <Input ref={website} className="as-text-size-l" placeholder='https://anspar.io' />
            </DivContentBetween>
            <DivContentBetween>
                <span style={{ margin: "0 0.5rem", width: "95px" }}>Twitter</span>
                <Input ref={twitter} className=" as-text-size-l" placeholder='https://twitter.com/user_name' />
            </DivContentBetween>
            <DivContentBetween>
                <span style={{ margin: "0 0.5rem", width: "95px" }}>Github</span>
                <Input ref={github} className=" as-text-size-l" placeholder='https://github.com/user_name' />
            </DivContentBetween>
            <br />

            {
                balanceOf.isSuccess ? Btns : <></>
            }

        </div>
    )

    return (
        <div style={{
            maxWidth: "720px", width: "100%", borderStyle: "none",
            borderRadius: "0.5rem", display: "flex", justifyContent: "center"
        }}
            className={`as-text-dark as-bg-light as-shadow-sm`}>
            <span className='as-text-dark as-text-size-l as-text-bold'>
                Please connect your wallet to continue
            </span>
        </div>
    )
}

function GetInfo(props) {
    const { data, isLoading } = useGet(`${props.data.cid}/info.json`, true);
    return (
        isLoading ?
            <Loading isIndeterminate={true} />
            :
            <ShowInfo {...props} info={data} />
    )
}


function SetDefault({ chainId, query }) {
    const setDefault = useANSWrite(chainId, "set_default",
        [`${query}`]);

    return (
        <button className={`${setDefault.isLoading ? "as-loading" : ""} as-btn as-btn-primary`} style={{ maxWidth: "100%", margin: "0 0.5rem"}}
            onClick={() => { setDefault.write() }}>Set As Default ANS</button>
    )
}

export default function ANSDetails(props) {
    const { query } = props;
    const { chain } = useNetwork();
    const { data, isLoading } = useANSRead(chain?.id, "who_is", [query]);
    useEffect(() => {
        props.setLoading(isLoading)
    }, [isLoading])
    return (
        data && !data.id.isZero() && data.cid !== "" ?
            <GetInfo data={data} query={query} chainId={chain?.id} chainSymbol={chain?.nativeCurrency?.symbol || "?"} />
            :
            <ShowInfo data={data} query={query} info={false} chainId={chain?.id} chainSymbol={chain?.nativeCurrency?.symbol || "?"} />
    )
}
