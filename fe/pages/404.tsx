import { NextPage } from "next";
import { Divider, Flex, Heading, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

const Custom404: NextPage = () => {
  const router = useRouter();

  return (
    <Flex
      direction="column"
      height="100vh"
      alignItems="center"
      justifyContent="center"
      gap={8}
    >
      <Flex alignItems="center" justifyContent="center" gap={4}>
        <Heading as="h2" color="teal">
          404
        </Heading>

        <Divider orientation="vertical" my={4} />
        <Heading as="h2">Page Not Found</Heading>
      </Flex>

      <Button colorScheme="teal" variant="outline" onClick={router.back}>
        Go Back
      </Button>
    </Flex>
  );
};

export default Custom404;
