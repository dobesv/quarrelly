const db = require('./db');
const { DateScalarType } = require('./gqlutil');

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
    Date: DateScalarType,
};
