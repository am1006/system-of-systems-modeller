import { useContext, useEffect, useRef } from "react";
import * as neo from "neovis.js/dist/neovis.js";
import { Box } from "@chakra-ui/react";
import { theme } from "@chakra-ui/theme";
import { UserContext } from "./UserContext";
import { useRouter } from "next/router";

const VisGraph: React.FC<any> = ({ cypher }: any) => {
  const { user } = useContext(UserContext);

  const route = useRouter();

  const graphRef = useRef<HTMLDivElement>(null);
  const neoVisRef = useRef<neo.NeoVis>();

  //   initial network creation
  useEffect(() => {
    if (user.uri === "" || user.username === "" || user.password === "") {
      route.push("/");
      return;
    }

    if (!graphRef.current) return;

    const config: neo.NeovisConfig = {
      containerId: graphRef.current.id,
      neo4j: {
        serverUrl: user.uri,
        serverUser: user.username,
        serverPassword: user.password,
      },
      visConfig: {
        interaction: {
          hover: true,
        },
      },
      labels: {
        // Note that id will only receive string values
        // title can do both (string and number)
        SYSTEM: {
          label: "name",
          [neo.NEOVIS_ADVANCED_CONFIG]: {
            static: {
              color: {
                border: theme.colors.teal[500],
                background: theme.colors.teal[100],
                highlight: {
                  border: theme.colors.teal[500],
                  background: theme.colors.teal[200],
                },
                hover: {
                  border: theme.colors.teal[500],
                  background: theme.colors.teal[200],
                },
              },
              title: "Vehicle",
              value: 1.5,
              shape: "dot",
              font: {
                size: 12,
              },
              //   color: {
              //     background: theme.colors.green[50],
              //     border: theme.colors.teal[500],
              //   },
            },
          },
        },

        INTERFACE: {
          label: "name",
          [neo.NEOVIS_ADVANCED_CONFIG]: {
            static: {
              color: {
                border: theme.colors.blue[500],
                background: theme.colors.blue[100],
                highlight: {
                  border: theme.colors.blue[500],
                  background: theme.colors.blue[200],
                },
                hover: {
                  border: theme.colors.blue[500],
                  background: theme.colors.blue[200],
                },
              },
              title: "RAS",
              value: 1.5,
              shape: "dot",
              font: {
                size: 12,
              },
            },
          },
        },

        PLATFORM: {
          label: "name",
          [neo.NEOVIS_ADVANCED_CONFIG]: {
            static: {
              color: {
                border: theme.colors.red[500],
                background: theme.colors.red[100],
                highlight: {
                  border: theme.colors.red[500],
                  background: theme.colors.red[200],
                },
                hover: {
                  border: theme.colors.red[500],
                  background: theme.colors.red[200],
                },
              },
              title: "Soldier",
              value: 1.5,
              shape: "dot",
              font: {
                size: 12,
              },
            },
          },
        },
      },
      relationships: {
        CONNECTS: {
          [neo.NEOVIS_ADVANCED_CONFIG]: {
            static: {
              label: "CONNECTS",
            },
          },
        },
      },
      //   initialCypher: "MATCH (n1)-[r]->(n2) RETURN r, n1, n2",
      //   initialCypher: initial,
      initialCypher: cypher,
    };

    console.log(user);

    const vis = new neo.NeoVis(config);

    neoVisRef.current = vis;

    vis.render();

    console.log(vis);
  }, [user, cypher, route]);

  return (
    <>
      <Box
        bgColor="gray.50"
        width="100vw"
        height="100vh"
        id="graph"
        ref={graphRef}
      ></Box>
    </>
  );
};

export default VisGraph;
