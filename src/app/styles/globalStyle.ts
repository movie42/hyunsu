"use client";

import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`

html, body{
    font-family: 'SUIT Variable', "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
    font-size:10px;
    
}
html, body, a, ul, ol, table,thead, tbody,  
th, tr, td, li, a, h1, h2, h3, h4, h5, h6, p,
form, input, select, label, pre, code {
    margin:0;
    padding:0;   
    
}
a {
    text-decoration:none;
    color:black;
}
input{
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active  {
        -webkit-box-shadow: 0 0 0 30px #ffffff inset !important;
    }
}
ul,li {
    list-style:none ;
}
h1,h2,h3,h4,h5,h6,p{
    word-spacing: -0.3rem;
    word-break: keep-all;
}
`;
