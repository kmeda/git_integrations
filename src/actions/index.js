import axios from 'axios';
import _ from 'lodash';


export const fetchResults = function() {
  return async (dispatch, getState) => {
        
    const {searchTerm, page, lang} = getState().appState;
    
    dispatch({type: 'IS_LOADING', flag: true});
    try {
      const res = await axios.get(`https://api.github.com/search/repositories?q=
                                  ${searchTerm}&page=${page}&per_page=10
                                  &client_id=a1ed2f74f3aac0663414&client_secret=cc0eea692a45e6bbccae22d08dbb6ae3f46bcd30`);
      if(res.statusText === 'OK') {
        
        let languages = [];
        res.data.items.forEach(repo => {
          languages.push(repo.language ? repo.language : 'Not Given');
        });
    
        let language_count = {};
    
        languages.forEach(lang => {
          language_count[lang] = (language_count[lang] || 0) + 1;
        });
    
        const arr = Object.keys(language_count).map(key => ({ [key]: language_count[key]}));
        arr.forEach(lang => lang['color'] = randomColor());
  

        dispatch({type: 'SET_REPOS', payload: res.data.items});
        dispatch({type: 'SET_LANGUAGES', payload: arr});
        dispatch({type: 'IS_LOADING', flag: false});
        
                
      }
    } catch (error) {
      console.log(error);
      dispatch({type: 'IS_LOADING', flag: false});
    }

  }
}

const randomColor = () => {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}