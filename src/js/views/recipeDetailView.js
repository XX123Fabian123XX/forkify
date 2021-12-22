import {DOMElements} from "../utils"
import * as fraction from "num2fraction";

class RecipeDetailView {

    // render the loader icon
    renderLoader() {
        const loaderHtml  = ` <div class="spinner">
        <svg>
          <use href="./img/icons.svg#icon-loader"></use>
        </svg>
      </div>`
        DOMElements.recipe.insertAdjacentHTML("afterbegin", loaderHtml);
    }

    // remove the loader icon
    removeLoader() {
        document.querySelector(DOMElements.loader).remove();
    }

    clearRecipe() {
      while(DOMElements.recipe.lastElementChild) {
        DOMElements.recipe.lastElementChild.remove();
      }
    }

    renderRecipeFigure(recipeTitle, recipeImageUrl) {
      const recipeFigureHtml = `
        <figure class="recipe__fig">
        <img src="${recipeImageUrl}" alt="${recipeTitle}" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${recipeTitle}</span>
          </h1>
        </figure>
      `
      DOMElements.recipe.insertAdjacentHTML("afterbegin", recipeFigureHtml)
    }

    renderRecipeDetails(cookingTime, numberServings) {
      const recipeDetailHtml = `
        <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="./img/icons.svg#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${cookingTime}</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="./img/icons.svg#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${numberServings}</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--increase-servings">
              <svg>
                <use href="./img/icons.svg#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--increase-servings">
              <svg>
                <use href="./img/icons.svg#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>


        <div class="recipe__user-generated">
        <svg>
          <use href="./img/icons.svg#icon-user"></use>
        </svg>
        </div>
        <button class="btn--round btn--bookmark">
          <svg class="">
            <use href="./img/icons.svg#icon-bookmark"></use>
          </svg>
        </button>
      </div>
      `
      DOMElements.recipe.insertAdjacentHTML("beforeend", recipeDetailHtml);
    }

    getIngredientQuantity(ingredient) {
      if (ingredient.quantity === null) {
        return ""
      } else if (ingredient.quantity % 1 == 0) {
        return ingredient.quantity
      } else {
        return fraction(ingredient.quantity);
      }
    }

    getRecipeIngredientsStartHtml() {
      return `<div class="recipe__ingredients"><h2 class="heading--2">Recipe ingredients</h2><ul class="recipe__ingredient-list">`
    }

    getIngredientHtml(ingredient) {
      const ingredientQuantity = this.getIngredientQuantity(ingredient)
      return `
      <li class="recipe__ingredient">
      <svg class="recipe__icon">
        <use href="./img/icons.svg#icon-check"></use>
      </svg>
      <div class="recipe__quantity">${ingredientQuantity === "" ? "" : ingredientQuantity}</div>
      <div class="recipe__description">
        <span class="recipe__unit">${ingredient.unit}</span>
        ${ingredient.description}
      </div>
    </li>
      `
    }

    getRecipesIngredientsBodyHtml(recipeIngredients) {
      let ingredientBodyHtml = ""
      recipeIngredients.forEach(ingredient => {
        ingredientBodyHtml+= this.getIngredientHtml(ingredient)
    })
    return ingredientBodyHtml;
    }

    renderRecipeIngredients(recipeIngredients) {
      let recipeIngredientsListHtml = this.getRecipeIngredientsStartHtml();
      recipeIngredientsListHtml += this.getRecipesIngredientsBodyHtml(recipeIngredients)
      recipeIngredientsListHtml += "</ul></div>"

      DOMElements.recipe.insertAdjacentHTML("beforeend",recipeIngredientsListHtml )
    }

    renderRecipeDirections(publisher, sourceUrl) {
      const recipeDirectionsHtml = `
        <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${publisher}</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${sourceUrl}"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="./img/icons.svg#icon-arrow-right"></use>
          </svg>
        </a>
        </div>
      `
      DOMElements.recipe.insertAdjacentHTML("beforeend", recipeDirectionsHtml);
    }

    renderRecipe(recipe, isBookmarked) {
      // render the recipe figure
      this.renderRecipeFigure(recipe.title, recipe.imageUrl)
      // render the recipe details
      this.renderRecipeDetails(recipe.cookingTime, recipe.numberServings);
      // render the recipe Ingredients
      this.renderRecipeIngredients(recipe.ingredients)      
      // render the recipe directions
      this.renderRecipeDirections(recipe.publisher, recipe.sourceUrl);

      if (isBookmarked) this.addBookmarkHighlight();
    }

    getUseElement() {
      return document.querySelector(DOMElements.btnBookmark).firstElementChild.firstElementChild
    }

    isBookmarkHighlight() {
      const useElement = this.getUseElement();

      const ending = useElement.getAttribute("href").split("#")[1];

      if (ending === "icon-bookmark") {
        return false;
      }
      return true;
    }

    toggleBookmarkHighlight() {
      if (isBookmarkHighlight) {
        const useElement = this.getUseElement();
        
        
      }


    }
    
    removeBookmarkHighlight() {
      const useElement = document.querySelector(DOMElements.btnBookmark).firstElementChild.firstElementChild;

      const href = useElement.getAttribute("href");

      const newHref = href.split("#")[0] + "#icon-bookmark";

      useElement.setAttribute("href", newHref);

    }

    addBookmarkHighlight() {
      const useElement = document.querySelector(DOMElements.btnBookmark).firstElementChild.firstElementChild;

      const href = useElement.getAttribute("href");

      const newHref = href.split("#")[0] + "#icon-bookmark-fill";

      useElement.setAttribute("href", newHref);
    }
}

export const recipeDetailView = new RecipeDetailView();