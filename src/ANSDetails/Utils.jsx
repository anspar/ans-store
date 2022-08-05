import {
    DivFixedCenterFullBgBlur
} from "./ANSDetails.styles";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/progress";

export function ContractFee({ fee, name, ...props }) {
    return (
        <span className='as-text-dark as-text-size-xs' {...props}>
            {name ? name : 'Contract'} fee
            <span className='as-text-bold' style={{ margin: "0 0.5rem" }} >{fee}</span>
        </span>
    )
}

export function getUserANSInput(inputs) {
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

export function Loading({ isIndeterminate, progress }) {
    return (
        <DivFixedCenterFullBgBlur>
            <CircularProgress size='80px' color="var(--as-primary)" isIndeterminate={isIndeterminate || progress === 100} value={progress}>
                <CircularProgressLabel>{isIndeterminate ? "Loading" : `${progress}%`}</CircularProgressLabel>
            </CircularProgress>
        </DivFixedCenterFullBgBlur>
    )
}