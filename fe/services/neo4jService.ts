import { BaseNeovisConfig } from "neovis.js/dist/neovis.js";

const neo4jLogin: BaseNeovisConfig["neo4j"] = {
  serverUrl: process.env.NEO4J_URI,
  serverUser: process.env.NEO4J_USERNAME,
  serverPassword: process.env.NEO4J_PASSWORD,
};

export default neo4jLogin;
