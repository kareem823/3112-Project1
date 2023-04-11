import { createTheme } from "@mui/material/styles";
export default createTheme({
 typography: {
 useNextVariants: true,
 },
 "palette":{"common":{"black":"#000","white":"#fff"},"background":{"paper":"#fff","default":"#fafafa"},"primary":{"light":"rgba(248, 248, 251, 1)","main":"rgba(181, 162, 63, 1)","dark":"rgba(2, 5, 24, 1)","contrastText":"rgba(56, 231, 231, 1)"},"secondary":{"light":"rgba(237, 147, 243, 1)","main":"rgba(12, 227, 159, 1)","dark":"rgba(65, 9, 34, 1)","contrastText":"#fff"},"error":{"light":"rgba(224, 126, 81, 1)","main":"rgba(243, 24, 9, 1)","dark":"rgba(255, 80, 0, 1)","contrastText":"#fff"},"text":{"primary":"rgba(0, 0, 0, 0.87)","secondary":"rgba(0, 0, 0, 0.54)","disabled":"rgba(0, 0, 0, 0.38)","hint":"rgba(0, 0, 0, 0.38)"
}}
});