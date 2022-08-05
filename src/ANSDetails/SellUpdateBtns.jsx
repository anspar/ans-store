import React, { useEffect, useRef, useState } from 'react'
import { useANS1155Write, useANSWrite, useANS1155Read, hosqUpload } from "@anspar/ans-wallet";
import { ethers } from "ethers";
import {
    DivContentBetween,
    Input,
    DivContentCenterResponsive
} from "./ANSDetails.styles";
import { getUserANSInput, Loading } from "./Utils";

export function SellUpdateBtns(props) {
    const [showSellInput, setShowSellInput] = useState(false);
    const {data, isLoading} = useANS1155Read(props.chainId, "get_amount_for_sale", [props.ansId ? props.ansId : "0", 
                            props.ownerAddress ? props.ownerAddress : "0"]);
    const classes = isLoading ? "as-loading" : "";
    const saleBtn = showSellInput ?
        <ForSale ansId={props.ansId} chainSymbol={props.chainSymbol} chainId={props.chainId} />
        :
        <button className={`${classes} as-btn as-bg-danger`}
            style={{ margin: "0.5rem 0.5rem", minWidth: "45%" }}
            onClick={() => { setShowSellInput(true) }}>
            Set For Sale
        </button>;
    return (
        <DivContentCenterResponsive>
            <Update chainId={props.chainId} inputs={props.inputs} query={props.query} />
            {
                data && data.eq(ethers.BigNumber.from('0')) ?
                    saleBtn
                    :
                    <CancelSale ansId={props.ansId} chainId={props.chainId} />
            }
        </DivContentCenterResponsive>
    )
}

function Update({ chainId, inputs, query }) {
    const [newCid, setNewCid] = useState('');
    const mint = useANSWrite(chainId, "update_ans", [`${query}`, newCid]);
    const [progress, setProgress] = useState(0);
    const [showLoading, setShowLoading] = useState(false);
    const handelUpdate = () => {
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
        console.log("qq", query)
        mint.write();
    }, [newCid])

    return (
        <>
            <button
                className={`as-btn as-btn-primary`} style={{ margin: "0.5rem 0.5rem", minWidth: "45%" }}
                onClick={() => { handelUpdate() }}>Update</button>
            {
                showLoading ? <Loading progress={progress} /> : <></>
            }
        </>
    )
}

function ForSale({ ansId, chainId, chainSymbol }) {
    const priceInput = useRef();
    const [price, setPrice] = useState('0');
    const sale = useANS1155Write(chainId, "set_for_sale", [ansId, 1, price]);
    useEffect(()=>{
        if(price==="0") return;
        sale.write()
    }, [price])
    return (
        <DivContentBetween style={{ margin: "0.5rem 0.5rem", minWidth: "45%" }}>
            <Input ref={priceInput} placeholder={`Price ${chainSymbol}`} className="as-text-size-n" style={{ width: "75%" }} />
            <button className={`as-btn as-bg-danger`} style={{ width: "20%" }}
                onClick={() => setPrice(ethers.utils.parseEther(priceInput.current?.value ? priceInput.current.value : "0").toString())}
                >
                    Sale
                </button>
            {sale.isLoading ? <Loading isIndeterminate={true} /> : <></>}
        </DivContentBetween>
    )
}

function CancelSale({ ansId, chainId }) {
    const notSale = useANS1155Write(chainId, "set_not_for_sale", [ansId, 1]);
    return (
        <>
            <button className={`as-btn as-bg-danger`}
                style={{ margin: "0.5rem 0.5rem", minWidth: "45%" }}
                onClick={() => notSale.write()}>Cancel Sale</button>
            {notSale.isLoading ? <Loading isIndeterminate={true} /> : <></>}
        </>
    )
}

