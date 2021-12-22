import {DOMElements, maxLengthTitle, numberRecipesPerPage} from "../utils"

class SidebarView {

    currentPage = 1
    
    shortenTitle(title, length) {
      return title.length <= length ? title : title.substr(0,length) + "...";
    }

    // render initial page
    renderInitialPage(recipes) {
      this.currentPage = 1;
      this.renderPage(recipes);
    }

    renderPageInDirection(direction, recipes) {
      direction === "forwards" ? this.currentPage++ : this.currentPage --
      this.renderPage(recipes)
    }

    renderPage(recipes) {
      this.clearPaginationButtons();
      this.clearAllRecipes();
      this.renderRecipes(recipes)
      this.renderPaginationButtons(recipes)
    }

    // render pagination Buttons
    renderPaginationButtons(recipes) {
      if (this.currentPage == 1 && recipes.length > numberRecipesPerPage) {
        this.renderNextButton(this.currentPage + 1)
        return
      } 
      this.renderPreviousButton(this.currentPage - 1)
      // render previous button

      if (this.currentPage * numberRecipesPerPage < recipes.length) {
        this.renderNextButton(this.currentPage + 1)
      }
    }

    clearPaginationButtons() {
      while(DOMElements.pagination.lastElementChild) {
        DOMElements.pagination.lastElementChild.remove();
      }
    }

    renderNextButton(pageNumber) {
      const htmlString = `
        <button class="btn--inline pagination__btn--next">
        <span>Page ${pageNumber}</span>
        <svg class="search__icon">
          <use href="./img/icons.svg#icon-arrow-right"></use>
        </svg>
      </button>
      `
      DOMElements.pagination.insertAdjacentHTML("beforeend", htmlString)
    }

    renderPreviousButton(pageNumber) {
      const htmlString = `
      <button class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="./img/icons.svg#icon-arrow-left"></use>
        </svg>
        <span>Page ${pageNumber}</span>
      </button>
      `
      DOMElements.pagination.insertAdjacentHTML("afterbegin", htmlString);
    }

    getRecipesOnCurrentPage(recipes) {
      return recipes.slice((this.currentPage - 1) * numberRecipesPerPage, this.currentPage * numberRecipesPerPage)
    }
    
    // Renders the recipes for the current page
    renderRecipes(recipes) {
        const recipesCurrentPage = this.getRecipesOnCurrentPage(recipes);
        recipesCurrentPage.forEach(recipe => {
            recipe.title = this.shortenTitle(recipe.title, maxLengthTitle)
            this.renderSingleRecipe(recipe)
        })

    }
    
    renderSingleRecipe(recipe) {
      const recipeString = 
      `<li class="preview" data-id="${recipe.id}">
          <a class="preview__link " href="##">
            <figure class="preview__fig">
              <img src="${recipe.imageUrl}" alt="Test" />
            </figure>
            <div class="preview__data">
              <h4 class="preview__title">${recipe.title}</h4>
              <p class="preview__publisher">${recipe.publisher}</p>
              <div class="preview__user-generated hidden">
                <svg>
                  <use href="./img/icons.svg#icon-user"></use>
                </svg>
              </div>
            </div>
          </a>
        </li>`
        DOMElements.results.insertAdjacentHTML("afterbegin",recipeString)
    }    


    highlightRecipe(recipeDomElement) {
      recipeDomElement.classList.add(DOMElements.highlightRecipeSidebar)
    }

    removeAllHighlights() {
      const highlightedElements = Array.from(document.querySelectorAll("."+DOMElements.highlightRecipeSidebar))
      highlightedElements.forEach(el => el.classList.remove(DOMElements.highlightRecipeSidebar))
    }

    clearAllRecipes() {
      while(DOMElements.results.lastElementChild) {
        DOMElements.results.lastElementChild.remove();
      }
    }

    displayRecipesNotFound() {
      const htmlCode = ` <div class="error">
      <div>
        <svg>
          <use href="./img/icons.svg#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>No recipes found for your query. Please try again!</p>
    </div>`
      DOMElements.results.insertAdjacentHTML("afterbegin", htmlCode)
    }

}

export const sidebarView = new SidebarView();