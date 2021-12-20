// Video 295
class SearchView {
  #parentEl = document.querySelector('.search');
  _resultsEl = document.querySelector('.search-results');
  _resultsElement = document.querySelector('.results');
  showSearchList() {
    this._resultsEl.classList.remove('hidden-2');
  }
  hideSearchList() {
    this._resultsEl.classList.add('hidden-2');
  }

  addHandlerhide(handler) {
    this._resultsElement.addEventListener('click', function (e) {
      // const btn = e.target.closest('.btn--back');
      // if (!btn) return;
      handler();
    });
  }
  getQuery() {
    const query = this.#parentEl.querySelector('.search__field').value;
    //this.ShowSearchList();
    this.#clearInput();
    return query;
  }
  #clearInput() {
    this.#parentEl.querySelector('.search__field').value = '';
  }
  addHandlerSearch(handler) {
    this.#parentEl.addEventListener('submit', function (e) {
      e.preventDefault(); // prevent the page from being reloaded after hitting submit
      handler();
    });
  }
}
export default new SearchView();
