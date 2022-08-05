import { useEffect, useState } from 'react'
import { useANS1155Read, hosqUpload, useANSWrite, useANS1155Write } from "@anspar/ans-wallet";
import { ethers } from "ethers";
import {
    DivContentStartCol,
    DivContentCenter,
} from "./ANSDetails.styles";
import { ContractFee, getUserANSInput, Loading } from "./Utils"

export function BuyBtn({ ownerAddress, ansId, chainId, chainSymbol, inputs, query }) {
    const minted = !ethers.BigNumber.from(ansId ? ansId.toString() : '0').isZero()
    return (
        <DivContentStartCol>
            {
                minted ?
                    <TotalFee chainId={chainId} chainSymbol={chainSymbol}
                        ansId={ansId} ownerAddress={ownerAddress} inputs={inputs} />
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

function TotalFee({ chainSymbol, chainId, ownerAddress, ansId }) {
    const { data, isLoading } = useANS1155Read(chainId, "get_amount_for_sale", [ansId ? ansId : "0",
        ownerAddress]);
    const classes = isLoading ? "as-loading" : "";
    const not_for_sale = data && data.isZero();
    const price = useANS1155Read(chainId, "get_nft_price", [ansId ? ansId.toString() : '0', ownerAddress]);
    // const contract_fee = useANS1155Read(chainId, "get_deployer_fee", [price.data?.toString(), 1]);
    const total_fee = useANS1155Read(chainId, "get_total_fee", [ansId ? ansId.toString() : '0', 1, ownerAddress]);
    const buy = useANS1155Write(chainId, "transfer_nft",
        [ansId ? ansId.toString() : '0', ownerAddress, 1],
        { value: total_fee.data ? total_fee.data.add(price.data).toString() : '0' });
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
                    disabled={not_for_sale}
                    onClick={() => { if (not_for_sale) return; else buy.write() }}
                >{not_for_sale ? "Not Available" : "Buy"}</button>
            </DivContentCenter>
            {buy.isLoading ? <Loading isIndeterminate={true} /> : <></>}
        </>
    )
}