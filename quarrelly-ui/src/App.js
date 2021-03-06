import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Topic from './Topic';
import { gql, graphql } from 'react-apollo';
import { List } from 'react-virtualized';

class AddTopic extends Component {
  constructor() {
    super();
    this.state = {
      newTopic: ''
    };
  }

  addTopic = () => {
    // TODO GraphQL mutation
    this.setState({newTopic: ''});
    this.props.mutate({
      variables: {
        userId: this.props.userId,
        title: this.state.newTopic
      },
      refetchQueries: [{ query: gql`
          query Topics {
            topics {
              id
              title
              creator
              created
              modified
              comments { id }
            }
          }
        `
      }],
    })
  }

  render() {
      return <div className="AddTopic">
            <textarea
              placeholder="Enter a topic..."
              value={this.state.newTopic}
              onChange={(event) => this.setState({newTopic: event.target.value})}
              />
            <button onClick={(event) => { this.addTopic(); } }>Add</button>
        </div>
  }
}

const AddTopicWithMutation = graphql(gql`
  mutation AddTopic($userId:ID!, $title:String!) {
    addTopic(userId:$userId, title:$title) {
      __typename
      id
      creator
      created
      modified
    }
  }
`)(AddTopic);

class App extends Component {
  constructor() {
    super();
    this.state = {
      userId: 'user@example.com'
    };
  }

  render() {
    if(this.props.data.loading) {
      return <p>Spinner...</p>
    }
    if(this.props.data.error) {
      return <p>{'Error: '+this.props.data.error}</p>;
    }
    const rowRenderer = ({index, isScrolling, isVisible, key, parent, style}) => {
      const topic = this.props.data.topics[index];
      if(!topic) return <p style={style} key={key}>???Missing???</p>
      return <Topic
        key={topic.id}
        topicId={topic.id}
        userId={this.state.userId}
        style={style}
        />
    };
    const rowHeightCalculator = ({index}) => {
      const topic = this.props.data.topics[index];
      return 100 * topic.comments.length + 200;
    }
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Quarrelly</h2>
        </div>
        <div className="App-body">
          <p className="App-intro">
            Join the debate!
          </p>
          <input value={this.state.userId} onChange={(event) => this.setState({userId: event.target.value})}/>
          { (/[^ @]+@[a-z]+([.][a-z]+)+/i).test(this.state.userId) ?
            <AddTopicWithMutation userId={this.state.userId}/> :
            this.state.userId ? 
            <p>Please enter a valid email address</p> :
            ''
          }
          <List
            height={500}
            rowCount={this.props.data.topics.length}
            rowHeight={rowHeightCalculator}
            rowRenderer={rowRenderer}
            width={800}
            />
        </div>
      </div>
    );
  }
}

export default graphql(gql`
  query TopicsQuery {
    topics { 
      __typename
      id 
      title
      created
      modified
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
`, {
  options: {
    pollInterval: 30000
  }
})(App);
