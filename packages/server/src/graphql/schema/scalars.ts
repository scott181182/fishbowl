import { JSONResolver } from "graphql-scalars";
import { asNexusMethod } from "nexus";



export const Json = asNexusMethod(JSONResolver, "json");
