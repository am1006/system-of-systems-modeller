import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { UserContext, UserProps } from "../components/UserContext";
import { useRef, useState } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<UserProps>({
    uri: "",
    username: "",
    password: "",
  });

  const userRef = useRef<UserProps>(user);

  return (
    <ChakraProvider>
      <UserContext.Provider value={{ user, setUser }}>
        <Component {...pageProps} />
      </UserContext.Provider>
    </ChakraProvider>
  );
}

export default MyApp;
