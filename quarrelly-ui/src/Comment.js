import React, { Component } from 'react';
import md5 from 'md5';
import { gql, graphql } from 'react-apollo';
import './Comment.css';

class Comment extends Component {
    gravatar(email) {
        return '//www.gravatar.com/avatar/'+md5(email.trim().toLowerCase());
    }

    render() {
        if(this.props.data.loading) {
            return <p>...</p>;
        } else if(this.props.data.error) {
            return <p className="error">{'Error: '+this.props.data.error}</p>;
        }
        const comment = this.props.data.comment;
        if(!comment || comment.text.trim() === '')
            return '';
        return <div className="Comment" key={comment.id}>
            <img className="avatar" src={this.gravatar(comment.userId)} alt=""/>
            <p className="comment">{comment.text}</p>
            <div className="meta">
                <span className="userId">{comment.userId}</span>
            </div>
        </div>
    }
}

export default graphql(gql`
    query Comment($topicId: ID!, $userId: ID!) {
        comment(topicId: $topicId, userId: $userId) {
            __typename
            id
            userId
            created
            modified
            text
        }
    }
`)(Comment);
