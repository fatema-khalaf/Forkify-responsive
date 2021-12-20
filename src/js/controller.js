import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
// to make the app worke on old browsers ---we need to install these pacages from npm first
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView.js';
import recipeView from './views/recipeView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
// Video 296
// this code is from parcell to not reload the page every time I edit the code
// if (module.hot) {
//   module.hot.accept();
// }
//Video 287
// async to make this function runs behind the scenes and does not stop the entire code

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    //window.location.hash.slice(1); // get id from the window
    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResaltsPage());
    bookmarksView.update(model.state.bookmarks);
    // console.log(id);
    if (!id) return;
    recipeView.renderSpinner();
    // 1) Loading recipe
    await model.loadRecipe(id); // await here because loadRecipe is async and to not excute the next line until the data recived
    // Video 288
    // 2) Rendering recpie

    //   searchView.hide();
    // recipeView.hide();
    searchView.hideSearchList();
    recipeView.showRecipe();
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;
    // 2) Load search results
    await model.loadSearchResults(query);
    // 3) Render results
    //  console.log(model.getSearchResaltsPage(1));
    searchView.showSearchList();
    resultsView.render(model.getSearchResaltsPage());
    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {}
};
//controlSearchResults();
// Video 299
const controlPagination = function (goToPage) {
  // Render new results
  resultsView.render(model.getSearchResaltsPage(goToPage));
  // Render new pagination buttons
  paginationView.render(model.state.search);
};
// Video 300
const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view
  recipeView.update(model.state.recipe);
};
// Video 302
const controlAddBookmark = function () {
  // 1) Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookMar(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // 2) Make bookmark icon fill
  recipeView.update(model.state.recipe);
  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBack = function () {
  recipeView.hideRecipe();
  searchView.showSearchList();
};

const controlhide = function () {
  searchView.hideSearchList();
  recipeView.showRecipe();
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
// Video 306
const controlAddRecipe = async function (newRecipe) {
  try {
    //console.log(newRecipe);
    // Uload recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state, recipe);
  } catch (err) {
    console.error('💥💥', err);
    addRecipeView.renderError(err.message);
  }
};
// Video 289
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addhandlerRender(controlRecipes);
  recipeView.addhandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  recipeView.addHandlerBack(controlBack);
  searchView.addHandlerSearch(controlSearchResults);
  searchView.addHandlerhide(controlhide);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};

init();
