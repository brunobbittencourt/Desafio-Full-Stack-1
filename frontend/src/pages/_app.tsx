import type { AppProps } from "next/app";
import "react-toastify/dist/ReactToastify.css";
import { Providers } from "../providers";
import { ToastContainer } from "react-toastify";
import "@/styles/globals.css";
import { GlobalStyle } from "@/styles/global";
import { ChakraProvider } from "@chakra-ui/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <ToastContainer theme="dark" autoClose={2000} />
      <ChakraProvider>
        <GlobalStyle />
        <Component {...pageProps} />
      </ChakraProvider>
    </Providers>
  );
}
