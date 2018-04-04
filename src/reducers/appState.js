import _ from 'lodash';


const template = {
  searchTerm: '', 
  repos: [], 
  languages: [],
  barchartData: [],
  loading: false, 
  page: 1
};

export const AppStateReducer = (state=template, action) => {
  switch (action.type) {
    case 'SET_SEARCH_TERM':
      return {
        ...state,
        searchTerm: action.payload
      }; 
    
    case 'SET_REPOS':
      return {
        ...state,
        repos: _.uniqBy(state.repos.concat(action.payload), 'id')
      };
    
    case 'SORT_REPOS':
    return {
      ...state,
      repos: _.orderBy(state.repos, action.payload).reverse()
    };

    case 'SET_LANGUAGES':
      return {
        ...state,
        languages: state.languages.concat(action.payload)
      };
    
    case 'CLEAR_REPOS':
      return {
        ...state,
        repos: [],
        languages: [],
        page: 1
      }
    case 'PAGE_INC':
      return {
        ...state,
        page: state.page + 1
      }
    case 'IS_LOADING':
      return {
        ...state,
        loading: action.flag
      }
        
    default:
      return state;
  }
}

