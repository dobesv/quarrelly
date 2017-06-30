import React, { Component } from 'react';
import md5 from 'md5';
import { gql, graphql } from 'react-apollo';
import PropTypes from 'prop-types';
import './Comment.css';

const comment_subscription_gql = gql`
    subscription Comment($topicId: ID!, $userId: ID!) {
        comment(topicId: $topicId, userId: $userId) {
            __typename
            id
            modified
            text
        }
    }
`;

const comment_gql = gql`
    query Comment($topicId: ID!, $userId: ID!) {
        comment(topicId: $topicId, userId: $userId) {
            __typename
            id
            modified
            text
        }
    }
`;

class Comment extends Component {
    static propTypes = {
        subscribeToChanges: PropTypes.func.isRequired,
    }

    gravatar(email) {
        return '//www.gravatar.com/avatar/'+md5(email.trim().toLowerCase());
    }

    componentWillMount() {
        this.props.subscribeToChanges();
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
            <img className="avatar" src={this.gravatar(this.props.userId)} alt=""/>
            <p className="comment">{comment.text}</p>
            <div className="meta">
                <span className="userId">{this.props.userId}</span>
            </div>
        </div>
    }
}

export default graphql(comment_gql, {
    name: 'data',
    props: props => ({
        subscribeToChanges: params => props.data.subscribeToMore({
            document: comment_subscription_gql,
            variables: {
                topicId: props.ownProps.topicId,
                userId: props.ownProps.userId
            },
        }),
        ...props
    })
})(Comment);
