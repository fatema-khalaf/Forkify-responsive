import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config';
import { getJSON, sendJSON } from './helpers';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  // this to reformat the respons object
  const img = recipe.image_url;
  //console.log(img.substr(0, 4) + 's');
  //console.log(img.substr(4));
  const imgUrl = img.substr(0, 4) + 's' + img.substr(4);
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceURL: recipe.source_url,
    image: imgUrl,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);
    state.recipe = createRecipeObject(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe, (bookmarked = false);
  } catch (err) {
    throw err;
  }
};
// Video 295
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);
    // console.log(data);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};
export const getSearchResaltsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;

  return state.search.results.slice(start, end);
};
// Video 300
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    // newQT = oldQt* newServings / oldServings
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};
// Video 304
// Add bookmarks to the local storage
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
// Video 302
export const addBookMar = function (recipe) {
  // add bookmark
  state.bookmarks.push(recipe);
  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  //console.log(recipe);
  persistBookmarks();
};
export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  // Mark current recipe as unbookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};
// Video 304
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage); //parse to convert to object
};
init();
// Developer function to clear storage
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
//clearBookmarks();

// Video 307
export const uploadRecipe = async function (newRecipe) {
  //console.log(Object.entries(newRecipe)); // convert from object to array
  const ingredients = Object.entries(newRecipe)
    .filter(
      entry => entry[0].startsWith('ingredient') && entry[1] !== '' // filter the data to get only filled ingredient fields
    )
    .map(ing => {
      const ingArr = ing[1].replaceAll(' ', '').split(',');
      if (ingArr.length !== 3)
        throw new Error(
          'Wrong ingredient format! Please use the correct format :)'
        );
      const [quantity, unit, description] = ingArr;
      return { quantity: quantity ? +quantity : null, unit, description };
    });
  const recipe = {
    title: newRecipe.title,
    source_url: newRecipe.sourceUrl,
    image_url: newRecipe.image,
    publisher: newRecipe.publisher,
    cooking_time: +newRecipe.cookingTime,
    servings: +newRecipe.servings,
    ingredients,
  };
  //const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
  //state.recipe = createRecipeObject(recipe);
  console.log(recipe);
};
