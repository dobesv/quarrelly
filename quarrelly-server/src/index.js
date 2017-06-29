const { microGraphiql, microGraphql } = require("graphql-server-micro");
const { send } = require("micro");
const { get, post, router } = require("microrouter");
const cors = require('micro-cors')();
const schema = require('./schema');


const graphqlHandler = microGraphql({ schema });
const graphiqlHandler = microGraphiql({ endpointURL: "/graphql" });

module.exports = cors(
  router(
    get("/graphql", graphqlHandler),
    get("/graphiql", graphiqlHandler),
    post("/graphql", graphqlHandler),
    (req, res) => send(res, 404, "not found"),
  ),
);
