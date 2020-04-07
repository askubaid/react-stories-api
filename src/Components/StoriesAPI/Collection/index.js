import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

import Collection from '../../Collection';
import StoriesAPIClient from '../client';


/**
* Collection generated by the Stories-API endpoint.
*/
export default class StoriesAPICollection extends Component {
  static propTypes = {
    /** API Key to interact with the StoriesAPI */
    apiKey: PropTypes.string.isRequired,
    /** Override `StoriesAPI` data fetching to use custom data */
    data: PropTypes.object,
    /** `StoriesAPI` endpoint URL */
    endpoint: PropTypes.string.isRequired,
    /** Current Browsing Page Number */
    page: PropTypes.number,
    /** StoriesAPI collection id */
    id: PropTypes.number.isRequired,
    /** Props to pass to the `Story` component */
    options: PropTypes.object,

  };

  static defaultProps = {
    data: null,
    endpoint: process.env.STORIES_API_URL,
    options: {},
    page: 1,
  };

  constructor(props) {
    super(props);
    const { apiKey, data, page, endpoint, q } = props;
    this.state = {
      loading: data ? false : true,
      data: data,
      count: null,
      stories: [],
      page: page || 1,
      search: q,
      q: q,
      error: false,
    };

    this.client = new StoriesAPIClient(endpoint, apiKey);
    this.handleChange = this.handleChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.setError = this.setError.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchInput = this.handleSearchInput.bind(this);
  };

  componentDidMount() {
    if (!this.state.data) {
      this.setState({ loading: true }, () => {
        this.fetchData(() => {
          this.fetchStories(() => {
            this.setState({loading: false});
          });
        })
      });
    }
  };

  setError() {
    this.setState({error: true})
  };

  fetchData(callback) {
    const { id, onLoad } = this.props;
    return this.client.collection(id, data => {
       this.setState({data: data});
       onLoad && onLoad(data);
       return callback(data);
     }, this.setError);
  };

  fetchStories(callback) {
    const {  endpoint, id } = this.props;
    const { page, search } = this.state;
    return this.client.story('', id, page, search, data => {
       this.setState({
         stories: data.items,
         page: data.page,
         pageCount: data.last_page,
         totalCount: data.total_count,
         q: data.q, //use q to keep the value persistent while a user is typing
       });
       return callback(data);
     }, this.setError);
  };

  handleChange(){
    // Used for a public interface of capturing key events
    const { onChange } = this.props;
    const { page, q } = this.state;
    onChange && onChange({ page, q });
  };

  handlePageChange({ selected }) {
    const newPage = selected + 1;
    if (newPage == this.state.page) return;
    this.setState({page: newPage, loading: true}, () => {
      this.fetchStories(() => {
        this.handleChange();
        this.setState({loading: false});
      })
    })
  }

  handleSearchInput(event){
    this.setState({search: event.target.value});
  }

  handleSearch(event) {
    event.preventDefault(); // prevent form from reloading page
    const searchQuery = this.state.search;
    this.setState({page: 1, loading: true},
      () => {
      this.fetchStories(() => {
        this.handleChange();
        this.setState({loading: false});
      })
    })
  }

  renderError(){
    const { errorComponent } = this.props;
    return errorComponent || (
        <Typography>
          Something went wrong while loading this collection... <br/>
          Try Refreshing or Check Back Soon
        </Typography>
    );
  }

  render() {
    const { urlFormatter } = this.props;
    const {
      error, totalCount, data, loading, page, options, search, stories, pageCount, q
    } = this.state;

    return error ? this.renderError() : (
      <Collection
        loading={loading}
        stories={stories}
        {...data}
        count={totalCount}
        page={page}
        pageCount={pageCount}
        urlFormatter={urlFormatter}
        onPageChange={this.handlePageChange}
        search={search}
        q={q}
        onSearchInput={this.handleSearchInput}
        onSearch={this.handleSearch}
        {...options}
      />
    );
  }
};
