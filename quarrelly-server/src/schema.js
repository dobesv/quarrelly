const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

module.exports = makeExecutableSchema({
    typeDefs: `
        scalar Date
        type Comment {
            id: ID!
            created: Date!
            modified: Date!
            text: String!
            userId: ID!
        }
        type Topic {
            id: ID!
            created: Date!
            modified: Date!
            title: String!
            creator: ID!
            comments: [Comment!]!
        }
        type Query {
            topics: [Topic!]!
            topic(id: ID!): Topic
            comment(userId:ID!, topicId:ID!): Comment
        }
        type Mutation {
            addTopic(userId:ID!, title:String!): Topic
            comment(userId:ID!, topicId:ID!, text:String!): Comment
        }
        schema {
            query: Query
            mutation: Mutation
        }  
        `,
    resolvers: resolvers
});

