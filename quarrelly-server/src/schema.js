import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

// GraphQL schema
const schema = makeExecutableSchema({
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
        type Subscription {
            topics: Topic
            topic(topicId:ID!): Topic
            comment(topicId:ID!, userId:ID!): Comment
        }
        schema {
            query: Query
            mutation: Mutation
            subscription: Subscription
        }  
        `,
    resolvers: resolvers
});

export default schema;