import { MongoClient } from 'mongodb';
import { PubSub, withFilter } from 'graphql-subscriptions';
import asyncIteratorFilter from './async-iterator-filter';

var url = 'mongodb://localhost:27017/quarrelly';
var connection = MongoClient.connect(url);
var topicsPromise = connection.then((db) => db.collection('topics'));

export const pubsub = new PubSub();


// List all topics, including all comments recursively
export const listTopics = async () => (await topicsPromise).find({}).toArray();

// Watch for changes to any topic
export const watchTopics = () => pubsub.asyncIterator('topics');

// Get a topic by id, or null if none exists with that id
export const getTopicById = async (id) => (await topicsPromise).findOne({id: id});

// Watch a topic for changes to any field or comment within the topic
export const watchTopicWithId = (topicId) => asyncIteratorFilter(
    (topic) => topic.id == topicId,
    pubsub.asyncIterator('topics')
);

// Get a user's comment in a topic, or null if the user hasn't left a comment on that topic yet
export const getUserCommentForTopicId = async (topicId, userId) => 
    (await topicsPromise).findOne(
        {id: topicId, "comments.userId": userId}, 
        {'comments.$': true}
    ).then((topic) => topic && topic.comments[0]);

// Set a user's comment in a topic.  Creates a new topic if one didn't exist already
export const setUserCommentForTopicId = (topicId, userId, text) => topicsPromise.then((topics) =>
    // Try to find an update the user's comment on this topic
    topics.updateOne({
        id: topicId,
        "comments.userId": userId
    },{
        $set: {
            "comments.$.text": text,
            "comments.$.modified": new Date()
        }
    }).then((updateResult) => updateResult.modifiedCount === 0 ?
        // If no comment existed before, add one instead
        topics.updateOne({
            id: topicId
        }, {
            // Add a new comment item to the end of the list
            $push: {
                comments: {
                    id: topicId+'#'+userId,
                    userId: userId,
                    created: new Date(),
                    text: text,
                    modified: new Date()
                }
            }
        }) : Promise.resolve(updateResult)
    ).then((updateResult) => 
        topics.findOne({id: topicId, "comments.userId": userId}
    )).then((topic) => {
        if(!topic || topic.comments.length == 0)
            return null;
        pubsub.publish('topics', topic);
        const comment = topic.comments.find((c) => c.userId === userId);
        pubsub.publish('comments', Object.assign({topicId}, comment));
        return comment;
    })
);

// Add a new topic with the given title/question
export const addTopic = (userId, title) => topicsPromise.then(async (topics) => {
    const newTopic = {
        id: String(Date.now()),
        title: title,
        creator: userId,
        created: new Date(),
        modified: new Date(),
        comments: []
    };
    var insertResult = await topics.insertOne(newTopic);
    pubsub.publish('topics', newTopic);
    return newTopic;
});

// Watch a particular comment for a change
export const watchComment = (topicId, userId) => asyncIteratorFilter(
    (comment) => comment.topicId == topicId && comment.userId == userId,
    pubsub.asyncIterator('comments')
);
