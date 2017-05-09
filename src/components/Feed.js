var React = require('react');
var Tweet = require('./Tweet');
var PayloadStates = require('../constants/PayloadStates');
var InfiniteScrolling = require('../decorators/InfiniteScrolling');
var LoadMoreButton = require('./LoadMoreButton');

module.exports = lore.connect(function(getState, props){
  return {
    tweets: getState('tweet.find', {
      pagination: {
        page: props.location.query.page || '1',
        populate: 'user'
      }
    })
  }
})(
InfiniteScrolling({ propName: 'tweets', modelName: 'tweet' })(
React.createClass({
  displayName: 'Feed',

  propTypes: {
    pages: React.PropTypes.array.isRequired,
    onLoadMore: React.PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    var tweet = {
      id: 1,
      cid: 'c1',
      state: 'RESOLVED',
      data: {
        id: 1,
        user: 1,
        text: 'Nothing can beat science!',
        createdAt: '2016-10-04T05:10:49.382Z'
      }
    };

    return {
      tweets: {
        state: 'RESOLVED',
        data: [tweet]
      }
    }
  },

  renderTweet: function(tweet) {
    return (
      <Tweet key={tweet.id || tweet.cid} tweet={tweet} />
    );
  },

  render: function() {
    var pages = this.props.pages;
    var numberOfPages = pages.length;
    var firstPage = pages[0];
    var lastPage = pages[pages.length - 1];

    if (numberOfPages === 1 && lastPage.state === PayloadStates.FETCHING) {
      return (
        <h1 className="loading-text">
          Loading...
        </h1>
      );
    }

    var tweetListItems = _.flatten(pages.map(function(tweets) {
      return tweets.data.map(this.renderTweet);
    }.bind(this)));

    return (
      <div className="feed">
        <h2 className="title">
          Feed
        </h2>
        <ul className="media-list tweets">
          {tweetListItems}
        </ul>
        <LoadMoreButton
          lastPage={lastPage}
          onLoadMore={this.props.onLoadMore}
          nextPageMetaField="nextPage" />
      </div>
    );
  }

})
)
);
