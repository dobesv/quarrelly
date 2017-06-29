import React, { Component } from 'react';
import { gql, graphql, compose } from 'react-apollo';
import Comment from './Comment';
import './Topic.css';

// Helper for editing the user's comment on the given topic
class CommentEditor extends Component {
    changeComment(text) {
        this.props.mutate({
            variables: {
                topicId: this.props.topicId, 
                userId: this.props.userId,
                text: text
            },
            optimisticResponse: { comment: {
                __typename: 'Comment',
                id: this.props.topicId+'#'+this.props.userId,
                created: new Date(),
                modified: new Date(),
                userId: this.props.userId,
                text: text
            }},
            refetchQueries: [
                {
                    query:gql`
                        query GetComment($topicId: ID!, $userId: ID!) {
                            comment(userId:$userId, topicId:$topicId) {
                                __typename
                                id
                                userId
                                created
                                modified
                                text
                            }
                        }`,
                        variables: {
                            topicId: this.props.topicId,
                            userId: this.props.userId
                        }
                    },
                {
                    query: gql`
                        query TopicQuery($topicId: ID!) {
                            topic(id: $topicId) {
                                __typename
                                id
                                title
                                creator
                                comments {
                                    __typename
                                    id
                                    userId
                                    created
                                    modified
                                    text
                                }
                            }
                        }
                    `,
                    variables: {
                        topicId: this.props.topicId
                    }
                }
            ]
        });
    }

    render() {
        return <form>
            <textarea
                placeholder={this.props.data.loading ? 'Loading...' : "Enter your comment here"}
                value={this.props.data.comment ? this.props.data.comment.text : ''}
                onChange={(event) => this.changeComment(event.target.value)}
                disabled={this.props.data.loading || this.props.data.error}
                />
        </form>
    }

}

// GrpahQL augmentation for CommentEditor
const CommentEditorWithMutate = compose(
    graphql(gql`
        query GetComment($topicId: ID!, $userId: ID!) {
            comment(userId:$userId, topicId:$topicId) {
                __typename
                id
                userId
                created
                modified
                text
            }
        }
    `),
    graphql(gql`
        mutation UpdateComment($userId: ID!, $topicId:ID!, $text:String!) {
            comment(userId:$userId, topicId:$topicId, text:$text) {
                __typename
                id
                userId
                created
                modified
                text
            }
        }
    `)
)(CommentEditor)

// Topic display component
class Topic extends Component {
  render() {
        if(this.props.data.loading) {
            return <p>...</p>;
        } else if(this.props.data.error) {
            return <p className="error">{'Error loading topic: '+this.props.data.error}</p>;
        }
        const topic = this.props.data.topic;
        return <div className="Topic">
            <h2>{topic.title}</h2>
            <ul>{topic.comments.map((comment) => 
                <Comment key={comment.id} topicId={topic.id} userId={comment.userId}/>)}</ul>
            <CommentEditorWithMutate
                userId={this.props.userId}
                topicId={this.props.topicId}
                />
        </div>;
  }

}

export default graphql(gql`
    query TopicQuery($topicId: ID!) {
        topic(id: $topicId) {
            __typename
            id
            title
            creator
            comments {
                __typename
                id
                userId
                created
                modified
                text
            }
        }
    }
`)(Topic);
