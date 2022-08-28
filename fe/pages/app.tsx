import {
  Box,
  Button,
  Flex,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Divider,
  FormControl,
  FormLabel,
  FormHelperText,
  Switch,
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbItem,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { NextPage } from "next/types";
import { useState } from "react";

// https://stackoverflow.com/questions/71151005/referenceerror-self-is-not-defined-using-react-pixi-and-next-urql
// https://stackoverflow.com/questions/66096260/why-am-i-getting-referenceerror-self-is-not-defined-when-i-import-a-client-side
// https://nextjs.org/docs/advanced-features/dynamic-import

const DynamicVisGraph = dynamic(() => import("../components/VisGraph"), {
  ssr: false,
});

const AppPage: NextPage<{}> = () => {
  const [n1Value, setN1Value] = useState("8");
  const [n2Value, setN2Value] = useState("10");

  const [cypher, setCypher] = useState("MATCH (n1)-[r]->(n2) RETURN r, n1, n2");

  const template = `
MATCH (source:ELEMENT {order: ${n1Value}}),
      (destination:ELEMENT {order: ${n2Value}}),
      p = shortestPath((source)-[:CONNECTS*]-(destination))
RETURN p
`;

  return (
    <div>
      <Flex direction={{ base: "column", lg: "row" }} gap={8}>
        <Flex
          gap={4}
          direction="column"
          p={8}
          w={{ base: "100%", lg: "25%" }}
          id="Left-Panel"
        >
          <Breadcrumb
            fontWeight="semibold"
            color="teal.800"
            spacing="8px"
            separator="/"
          >
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="#">App</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Heading color="teal.600" as="h2" size="lg">
            SOS Modeller
          </Heading>

          <Divider />

          <Box>
            <FormControl>
              <FormLabel>Path Availability & Shortest Path</FormLabel>
              <NodesInput
                n1Value={n1Value}
                n2Value={n2Value}
                setN1Value={setN1Value}
                setN2Value={setN2Value}
              />
              <FormHelperText>
                Check from {n1Value} to {n2Value}
              </FormHelperText>
              <Button
                my={2}
                colorScheme="teal"
                onClick={() => {
                  setCypher(template);
                }}
                disabled={n1Value === n2Value}
              >
                Check
              </Button>

              <Button
                my={2}
                mx={4}
                colorScheme="teal"
                variant="outline"
                onClick={() =>
                  setCypher("MATCH (n1)-[r]->(n2) RETURN r, n1, n2")
                }
              >
                Reset
              </Button>
            </FormControl>
          </Box>

          <Divider />

          <FormControl>
            <FormLabel htmlFor="isDisabled">Show Systems</FormLabel>
            <Switch id="isDisabled" isDisabled defaultChecked />

            <Divider my={2} />

            <FormLabel htmlFor="isChecked">Show Interfaces</FormLabel>
            <Switch id="isChecked" isChecked />

            <Divider my={2} />

            <FormLabel htmlFor="isDisabled">Show Platforms</FormLabel>
            <Switch id="isDisabled" isDisabled defaultChecked />
          </FormControl>
        </Flex>

        <DynamicVisGraph cypher={cypher} />
      </Flex>
    </div>
  );
};
export default AppPage;

function NodesInput({ n1Value, n2Value, setN1Value, setN2Value }: any) {
  return (
    <Flex gap={4}>
      <NumberInput
        onChange={(valueString) => setN1Value(valueString)}
        size="md"
        maxW={20}
        defaultValue={n1Value}
        min={1}
        max={20}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>

      <NumberInput
        onChange={(valueString) => setN2Value(valueString)}
        size="md"
        maxW={20}
        defaultValue={n2Value}
        min={1}
        max={20}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </Flex>
  );
}
