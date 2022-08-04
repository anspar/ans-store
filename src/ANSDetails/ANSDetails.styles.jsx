import styled from "styled-components";

export const Input = styled.input`
    width: 100%;
    border-style: none;
    border-radius: 0.5rem;
    padding: 0.2rem 0;
    margin: 0 0.2rem;
    text-align: center;
    outline-width: 0;
    background-color: var(--as-dark-dim);
    color: var(--as-dark);
    ::-webkit-file-upload-button{
        border-style: none;
        border-radius: 0.5rem;
        background-color: var(--as-light);
        color: var(--as-dark);
        margin: 0 0.2rem;
    }
`;

export const TextArea = styled.textarea`
    width: 100%;
    border-style: none;
    border-radius: 0.5rem;
    padding: 0.2rem 0;
    margin: 0 0.2rem;
    text-align: center;
    outline-width: 0;
    background-color: var(--as-dark-dim);
    color: var(--as-dark);
`;

export const DivContentBetween = styled.div`
    width: 100%;
    display: flex;
    justify-content: between;
    align-items: center;
    margin-bottom: 0.5rem;
`;

export const DivContentBetweenResponsive = styled(DivContentBetween)`
    @media only screen and (max-width: 375px) {
        justify-content: center;
        flex-direction: column;
    }
`;

export const DivContentCenter = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 0.5rem;
`;

export const DivContentCenterResponsive = styled(DivContentCenter)`
    @media only screen and (max-width: 375px) {
        flex-direction: column;
    }
`;

export const DivContentStartCol = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: start;
    margin-bottom: 0.5rem;
`;

export const DivFixedCenterFull = styled.div`
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
`;