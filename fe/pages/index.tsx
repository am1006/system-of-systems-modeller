import type { NextPage } from "next";
import Head from "next/head";

import {
  Heading,
  Container,
  Flex,
  Divider,
  Button,
  InputGroup,
  Input,
  InputRightElement,
  Stack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useContext, useState } from "react";
import { UserContext, UserProps } from "../components/UserContext";

const Home: NextPage = () => {
  const { user, setUser } = useContext(UserContext);

  return (
    <Container maxW="6xl" centerContent>
      <Head>
        <title>SoS M&A</title>
        <meta name="description" content="LNIC System of Systems M&A Tool" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <Flex
        m={12}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Heading mt={24} as="h2">
          Welcome to LNIC&rsquo;s
        </Heading>
        <Heading as="h1" color="teal" size="2xl">
          System of Systems M&A
        </Heading>

        <Stack mt={24}>
          <Input
            placeholder="Enter URI"
            onChange={(e) => setUser({ ...user, uri: e.target.value })}
          />
          <Input
            placeholder="Enter Username"
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />

          <PasswordInput />
        </Stack>

        <Button mt={4} colorScheme="teal" variant="outline">
          <Link href="/app">
            <a>Getting Started</a>
          </Link>
        </Button>
      </Flex>

      <Divider mb={4} width={72} />

      <footer>Designed and Made with ♥ By LNIC</footer>
    </Container>
  );
};

export default Home;

function PasswordInput() {
  const { user, setUser } = useContext(UserContext);
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return (
    <InputGroup size="md">
      <Input
        pr="4.5rem"
        type={show ? "text" : "password"}
        placeholder="Enter password"
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
          {show ? "Hide" : "Show"}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}
