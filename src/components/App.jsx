import React, {Component} from 'react';
import axios from 'axios';
import _ from 'lodash';
import {connect} from 'react-redux';

import SearchIcon from 'react-icons/lib/md/search';
import Star from 'react-icons/lib/md/star';

import styled from 'styled-components';

import { fetchResults } from '../actions/index';

import {BarChart} from 'react-easy-chart';


const Wrapper = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: 1fr;
  grid-template-rows: 455px 1fr;
`;

const Header = styled.div`
  background-color: #24292e;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: fixed;
  height: 55px;
  width: 100%;
  min-width: 640px;
`;

const inputStyle = {
  width: '400px',
  height: '30px',
  fontSize: '15px',
  borderRadius: '2px',
  border: 'none',
  outline: 'none',
  paddingLeft: '15px',
  paddingRight: '50px',
  backgroundColor: 'rgba(255,255,255,0.125)',
  color: 'rgba(255,255,255,0.75)'
    
  };

const sorterStyle = {
  height: 30,
  fontSize: '15px',  
  backgroundColor: 'rgba(255,255,255,0.125)',
  color: 'rgba(255,255,255,0.75)',
  borderRadius: 0,
  border: 0,
  outline: 'none'
}

const BarChartContainer = styled.div`
  border-bottom: 1px solid black;
  position: fixed;
  height: 400px;
  width: 100%;
  top: 55px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0,0,0,0.6);
  display: grid;
  grid-template-columns: 1fr 165px;
  
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;

`;

const Avatar = styled.div`
  background-image: url(${props => props.url});
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
`;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { width: 500};
   
  }
  
  
  componentDidMount() {
    this.search.focus();
    
  }
  
  handleChange = (e) => {
    const { dispatch } = this.props;
    const { repos, languages } = this.props.appState;
    
    dispatch({type: 'SET_SEARCH_TERM', payload: _.trim(e.target.value)});

    if(repos.length) {
      dispatch({type: 'CLEAR_REPOS'});
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    
    const { dispatch } = this.props;
    const { searchTerm, page } = this.props.appState;
      
    if (!(_.trim(this.search.value).length)) {
      return;
    }

    if (!searchTerm.length) {
      return;
    } else {
      dispatch(fetchResults());
      this.search.value = '';
    }

  }

  renderRepos = () => {
    const { languages, repos } = this.props.appState;

    if(languages.length) {
      return repos.map(repo => {
        return (
          <Card key={repo.id}>
            <Content>
              <div style={{width: '100%', height: 30, padding: '10px 15px', fontSize: 17, fontWeight: 700, overflow: 'hidden'}} >{repo.name}</div>
              <div style={{width: '100%', height: 30, padding: '10px 15px' , fontSize: 17, fontWeight: 700, overflow: 'hidden'}}>{repo.full_name}</div>
              <div style={{width: '100%', height: 105, padding: '15px 15px', overflow: 'hidden'}}>{repo.description}</div>
              <div style={{width: '100%', height: 35, padding: '5px 15px', display: 'flex', justifyContent: 'space-between'}}>
                <span style={{ 
                  backgroundColor: `${ languages.length && _.find(languages, repo.language) && (_.find(languages, repo.language)).color}`,
                  padding: '5px 5px', borderRadius: 5, border: '1px solid #6d6d6d', 
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  color: '#fff'}}>
                  {repo.language ? repo.language : 'Not Given'}
                </span>
                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} > <Star size={23} color='#f1760c'/> {repo.stargazers_count}</span>
              </div>
            </Content>
            <Avatar url={repo.owner.avatar_url || null}/>
          </Card>
        );
      })
    } 
    
  }

  handleInfiniteScroll = (e) => {
    const {dispatch} = this.props;
    let { loading, page } = this.props.appState;

    const { searchTerm } = this.props.appState;

    let scrollTop = e.target.scrollTop;
    let scrollHeight = e.target.scrollHeight;
    let clientHeight = e.target.clientHeight;

    let scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
    if (scrolledToBottom && !loading) {

        dispatch({type: 'PAGE_INC'});
        dispatch(fetchResults());
    } else {
      return
    }
  }

handleSort = (e) => {
  const { dispatch } = this.props;
  
  const {repos} = this.props.appState;
  if(repos.length) {
    dispatch({type: 'SORT_REPOS', payload: e.target.value});
  }
    
  
}


render() {
  const {repos, languages, loading } = this.props.appState;
  
  let data = {};
  languages.forEach(lang => {
    data[Object.keys(lang)[0]] = data[Object.keys(lang)[0]] ? data[Object.keys(lang)[0]] + Number(Object.values(lang)[0]) : Number(Object.values(lang)[0]);
    
  });
  let arr = Object.keys(data).map(key => ({ [key]: data[key]}));
  let barData = [];
  arr.forEach(each => {
    barData.push({x: Object.keys(each)[0], y: Object.values(each)[0]})
  })
  console.log(barData);

  return (
    <Wrapper>
      
      <Header>
        <span style={{position: 'relative', width: '400px', height: '30px'}} >
        <form onSubmit={this.handleSubmit}>
          <input 
            onChange={this.handleChange}
            className="search-input"
            style={inputStyle} 
            type="text" 
            placeholder='Search Public Repos...' 
            ref={(search) => this.search = search} 
            />
          </form>
          <SearchIcon onClick={this.handleSubmit} style={{position: 'absolute', right: 5, top: 2, cursor: 'pointer'}} size={28} color={'rgba(255,255,255,0.5)'}/>
        </span>

        <select style={sorterStyle} onChange={this.handleSort} >
          
          <option value="stargazers_count">Stars</option>
          <option value="watchers_count">Watchers</option>
          <option value="score">Score</option>
          <option value="name">Name</option>
          <option value="created_at">Created At</option>
          <option value="updated_at">Updated At</option>
        </select>
      </Header>

      { languages.length ? 
        <BarChartContainer> 
          <BarChart
            barWidth={40}
            colorBars
            axes
            width={1000}
            height={400}
            data={barData}
            margin={{top: 20, right: 40, bottom: 40, left: 40}}
            />
        </BarChartContainer> : null}
      <div></div>
      
      <div className="repo-container" ref={elem => this.repoContainer = elem} onScroll={this.handleInfiniteScroll}  >
        { loading || languages.length 
            ? loading && <div style={{textAlign: 'center', gridColumn: '1/-1', fontSize: 20}}> Loading... </div> 
            : <div style={{textAlign: 'center', gridColumn: '1/-1', fontSize: 20}} >Enter a search term to fetch results.</div> 
        }

        { this.renderRepos() }
      </div>

    </Wrapper>
  )
}
}

const mapStateToProps = (state) => {
  return {
    appState: state.appState
  }
}

export default connect(mapStateToProps)(App);
