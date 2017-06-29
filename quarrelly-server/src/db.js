const MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/quarrelly';
var connection = MongoClient.connect(url);
var topicsPromise = connection.then((db) => db.collection('topics'));


// List all topics, including all comments recursively
exports.listTopics = async () => (await topicsPromise).find({}).toArray();

// Get a topic by id, or null if none exists with that id
exports.getTopicById = async (id) => (await topicsPromise).findOne({id: id});

// Get a user's comment in a topic, or null if the user hasn't left a comment on that topic yet
exports.getUserCommentForTopicId = async (topicId, userId) => 
    (await topicsPromise).findOne(
        {id: topicId, "comments.userId": userId}, 
        {'comments.$': true}
    ).then((topic) => topic && topic.comments[0]);

// Set a user's comment in a topic.  Creates a new topic if one didn't exist already
exports.setUserCommentForTopicId = (topicId, userId, text) => topicsPromise.then((topics) =>
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
    ).then((updateResult) => exports.getUserCommentForTopicId(topicId, userId))
);

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
