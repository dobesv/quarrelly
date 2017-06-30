import * as db from './db';
import { DateScalarType } from './gqlutil';
import asyncIteratorMap from './async-iterator-map';

// GraphQL resolver functions
module.exports = {
    Query: {
        topics: () => db.listTopics(),
        topic: (r, q) => db.getTopicById(q.id),
        comment: (r, {topicId, userId}) => db.getUserCommentForTopicId(topicId, userId)
    },
    Mutation: {
        addTopic: (obj, {userId, title}) => db.addTopic(userId, title),
        comment: (obj, {userId, topicId, text}) => db.setUserCommentForTopicId(topicId, userId, text)
    },
    Subscription: {
        topics: {
            subscribe: () => asyncIteratorMap(
                (topic) => ({topics: topic}),
                db.watchTopics()
            )
        },
        topic: {
            subscribe: (obj, {topicId}) => asyncIteratorMap(
                (topic) => ({topic: topic}),
                db.watchTopicWithId(topicId)
            )
        },
        comment: {
            subscribe: (obj, {topicId, userId}) => asyncIteratorMap(
                (comment) => ({comment: comment}),
                db.watchComment(topicId, userId)
            )
        }
    },
    Date: DateScalarType,
};
