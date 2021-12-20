import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup; // Video 303
    this._clear(); // emptying the container
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  // Video 301
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup); // to convert from string to a virtual dom object
    const newElements = Array.from(newDom.querySelectorAll('*')); // Array.form convert to array
    const curElements = Array.from(this._parentElement.querySelectorAll('*')); // '*' select all tags (nods)
    //console.log(newElements);
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      //console.log(curEl, newEl.isEqualNode(curEl));
      // Update changed text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('💖', newEl.firstChild?.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }
      // Update changed attributes
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      // console.log(newEl.attributes);
    });
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderSpinner() {
    const markup = `
        <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div>
        `;
    this._clear(); // emptying the container
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  // Errors handler Video 294
  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
        </div>`;
    this._clear(); // emptying the container
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  // success message
  renderMessage(message = this._message) {
    const markup = `
        <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
        </div>`;
    this._clear(); // emptying the container
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
