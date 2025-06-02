/** @type {import('houdini').ConfigFile} */
const config = {
    "plugins": {
        "houdini-svelte": {}
    },
    schemaPath: "../server/src/generated/schema.graphql",
    scalars: {
        JSON: {
            type: "any",
            unmarshal: (value) => JSON.parse(value),
            marshal: (value) => JSON.stringify(value)
        }
    }
};

export default config;
