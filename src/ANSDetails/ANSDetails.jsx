import React, { useEffect, useRef, useState } from 'react'
import { useGet, useANSRead, useANS1155Read, hosqUpload, useANSWrite } from "@anspar/ans-wallet";
import { useNetwork, useAccount } from "wagmi";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/progress";
import { ethers } from "ethers";
import {
    DivContentBetween,
    Input,
    TextArea,
    DivContentCenterResponsive,
    DivContentStartCol,
    DivContentCenter,
    DivFixedCenterFullBgBlur
} from "./ANSDetails.styles";

function ShowInfo({ info, chainId, chainSymbol, query, ...props }) {
    const { address, isConnected } = useAccount()
    const forSale = useANS1155Read(chainId, "get_amount_for_sale", [props.data ? props.data.id : "0", address]);
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
        <SellUpdateBtns forSale={forSale} address={address} ansId={props.data?.id} chainId={chainId} chainSymbol={chainSymbol} inputs={inputs} />
        :
        <BuyBtn forSale={forSale} query={query} ownerAddress={props.data?.target} ansId={props.data?.id} chainId={chainId} chainSymbol={chainSymbol} inputs={inputs} />;


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
                balanceOf.isSuccess && forSale.isSuccess ? Btns : <></>
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

function SellUpdateBtns(props) {
    const [showSellInput, setShowSellInput] = useState(false);
    const priceInput = useRef();
    const { data, isLoading } = props.forSale;
    const classes = isLoading ? "as-loading" : "";
    const saleBtn = showSellInput ?
        <DivContentBetween style={{ margin: "0.5rem 0.5rem", minWidth: "45%" }}>
            <Input ref={priceInput} placeholder='Price' className="as-text-size-n" style={{ width: "75%" }} />
            <button className={`${classes} as-btn as-bg-danger`} style={{ width: "20%" }}>Sale</button>
        </DivContentBetween>
        :
        <button className={`${classes} as-btn as-bg-danger`}
            style={{ margin: "0.5rem 0.5rem", minWidth: "45%" }}
            onClick={() => { setShowSellInput(true) }}>
            Set For Sale
        </button>;
    return (
        <DivContentCenterResponsive>
            <button className={`${classes} as-btn as-btn-primary`} style={{ margin: "0.5rem 0.5rem", minWidth: "45%" }}>Update</button>
            {
                data && data.eq(ethers.BigNumber.from('0')) ?
                    saleBtn
                    :
                    <button className={`${classes} as-btn as-bg-danger`} style={{ margin: "0.5rem 0.5rem", minWidth: "45%" }}>Cancel Sale</button>
            }
        </DivContentCenterResponsive>
    )
}

function BuyBtn({ forSale, ownerAddress, ansId, chainId, chainSymbol, inputs, query }) {
    const minted = !ethers.BigNumber.from(ansId ? ansId.toString() : '0').isZero()
    return (
        <DivContentStartCol>
            {
                minted ?
                    <TotalFee chainId={chainId} chainSymbol={chainSymbol}
                        ansId={ansId} ownerAddress={ownerAddress} forSale={forSale} inputs={inputs} />
                    :
                    <MintFee chainId={chainId} chainSymbol={chainSymbol} inputs={inputs} query={query} />
            }
        </DivContentStartCol>
    )
}

function MintFee({ chainSymbol, chainId, inputs, query }) {
    const contract_fee = useANS1155Read(chainId, "get_min_dev_fee", []);
    const [newCid, setNewCid] = useState('');
    const mint = useANSWrite(chainId, "mint_ans",
        [contract_fee.data ? contract_fee.data.toString() : '0', `${query}`, newCid],
        { value: contract_fee.data ? contract_fee.data.toString() : '0' });
    const [progress, setProgress] = useState(0);
    const [showLoading, setShowLoading] = useState(false);
    const handelBuy = () => {
        const toUpload = getUserANSInput(inputs);
        setShowLoading(true)
        hosqUpload({
            ...toUpload, wrapInDir: true, setResponse: (r) => {
                setShowLoading(false)
                setNewCid(r.Hash);
            }, setProgress, setError: () => { setShowLoading(false) }
        })
    }

    useEffect(() => {
        if (newCid === '') return
        mint.write();
    }, [newCid])

    return (
        <>
            <ContractFee fee={`${chainSymbol} ${ethers.utils.formatEther(contract_fee.data ? contract_fee.data.toString() : '0')}`}
                className={contract_fee.isLoading ? "as-loading" : ""}
                style={{ margin: "0 1rem" }} />
            <DivContentCenter>
                <button className={`as-btn as-btn-primary`} style={{ width: "100%", margin: "0 1rem" }}
                    onClick={handelBuy}>Buy</button>
            </DivContentCenter>
            {
                showLoading ? <Loading progress={progress} /> : <></>
            }
        </>
    )
}

function TotalFee({ chainSymbol, chainId, ownerAddress, ansId, forSale }) {
    const { data, isLoading } = forSale;
    const classes = isLoading ? "as-loading" : "";
    const not_for_sale = data && data.isZero();
    const price = useANS1155Read(chainId, "get_nft_price", [ansId ? ansId.toString() : '0', ownerAddress]);
    // const contract_fee = useANS1155Read(chainId, "get_deployer_fee", [price.data?.toString(), 1]);
    const total_fee = useANS1155Read(chainId, "get_total_fee", [ansId ? ansId.toString() : '0', 1, ownerAddress]);

    return (
        <>
            <ContractFee name='Owners'
                style={{ margin: "0 1rem" }}
                fee={`${chainSymbol} ${ethers.utils.formatEther(price.data ? price.data.toString() : '0')}`}
                className={price.isLoading ? "as-loading" : ""} />
            <ContractFee fee={`${chainSymbol} ${ethers.utils.formatEther(total_fee.data ? total_fee.data.toString() : '0')}`}
                className={total_fee.isLoading ? "as-loading" : ""}
                style={{ margin: "0 1rem" }} />
            {/* <ContractFee name="Total" fee={`${chainSymbol} ${ethers.utils.formatEther(total_fee.data?.toString())}`}
                className={total_fee.isLoading && "as-loading"}
                style={{ margin: "0.2rem 1rem" }} /> */}
            <DivContentCenter>
                <button className={`${classes} as-btn as-btn-primary`} style={{ width: "100%", margin: "0 1rem" }}
                    disabled={not_for_sale}>{not_for_sale ? "Not Available" : "Buy"}</button>
            </DivContentCenter>
        </>
    )
}

function getUserANSInput(inputs) {
    let info = {};
    info.name = inputs.name.current.value;
    info.about = inputs.about.current.value;
    info.color = inputs.color.current.value;
    info.background_color = inputs.background_color.current.value;
    info.image = inputs.image.current.files[0]?.name;
    info.website = inputs.website.current.value;
    info.twitter = inputs.twitter.current.value;
    info.github = inputs.github.current.value;
    info.background_art = '';
    info["nft_type"] = "ans";
    info["type"] = "dir";
    const blob = new Blob([JSON.stringify(info)])
    const files = inputs.image.current.files[0] ? [inputs.image.current.files[0]] : []; //just passing the files causes an error
    return { files, blobs: [{ blob, name: "info.json" }] }
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

function Loading({ isIndeterminate, progress }) {
    return (
        <DivFixedCenterFullBgBlur>
            <CircularProgress size='80px' color="var(--as-primary)" isIndeterminate={isIndeterminate || progress === 100} value={progress}>
                <CircularProgressLabel>{isIndeterminate ? "Loading" : `${progress}%`}</CircularProgressLabel>
            </CircularProgress>
        </DivFixedCenterFullBgBlur>
    )
}

function ContractFee({ fee, name, ...props }) {
    return (
        <span className='as-text-dark as-text-size-xs' {...props}>
            {name ? name : 'Contract'} fee
            <span className='as-text-bold' style={{ margin: "0 0.5rem" }} >{fee}</span>
        </span>
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
