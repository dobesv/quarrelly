const MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/quarrelly';


// In-memory database for now
const db = {
    topics: [{
        id: "t1",
        title: 'iOS or Android?',
        creator: 'dobesv@gmail.com',
        created: new Date(),
        modified: new Date(),
        comments: [{
            id: 1,
            created: new Date(),
            modified: new Date(),
            userId: 'dobesv@gmail.com',
            text: 'Android, I guess.  I like it better, anyway.'
        }]
    }]
};

var connection = MongoClient.connect(url);
var topicsPromise = connection.then((db) => db.collection('topics'));


// List all topics, including all comments recursively
exports.listTopics = () => topicsPromise.then((topics) => 
    topics.find({}).toArray());

// Get a topic by id, or null if none exists with that id
exports.getTopicById = (id) => topicsPromise.then((topics) => 
    topics.findOne({id: id}));

// Get a user's comment in a topic, or null if the user hasn't left a comment on that topic yet
exports.getUserCommentForTopicId = (topicId, userId) => exports.getTopicById(topicId).then((topic) =>
    topic && topic.comments.find((c) => c.userId === userId));

// Set a user's comment in a topic.  Creates a new topic if one didn't exist already
exports.setUserCommentForTopicId = async (topicId, userId, text) =>  {
    const topic = await exports.getTopicById(topicId)
    if(!topic)
        return null;
    const comment = Object.assign({}, topic.comments.find((c) => c.userId == userId) ||
        {
            id: topicId+'#'+userId,
            userId: userId,
            created: new Date(),
        }, {
            text: text,
            modified: new Date()
        });
    const comments = [comment].concat(topic.comments.filter((c) => c.userId !== userId));
    const topics = await topicsPromise;
    const newTopic = Object.assign({}, topic, {
        comments: comments,
        modified: new Date()
    });
    const replaceResult = await topics.replaceOne({id: topicId}, newTopic);
    return comment;
};

// Add a new topic with the given title/question
exports.addTopic = (userId, title) => topicsPromise.then(async (topics) => {
    const newTopic = {
        id: String(Date.now()),
        title: title,
        creator: userId,
        created: new Date(),
        modified: new Date(),
        comments: []
    };
    var insertResult = await topics.insertOne(newTopic);
    return newTopic;;
});
