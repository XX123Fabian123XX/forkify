// import all of  the views

import {searchView} from "./views/searchView";
import {sidebarView}  from "./views/sidebarView";
import {recipeDetailView} from "./views/recipeDetailView";
import { booksmarksView } from "./views/booksmarksView";
import { addRecipeView } from "./views/addRecipeView";

// import the recipeModel
import {recipeModel} from "./RecipeModel"

// utils
import {DOMElements} from "./utils";

const setupSearchBarListener = () => {
  // event handler click submit event
  DOMElements.searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const input = searchView.getInputData();
    if (!input) return


    searchView.clearInput();


    // search for the input data in the recipeModel
    const recipes = await recipeModel.fetchNewRecipes(input)

    sidebarView.clearAllRecipes();

    if (recipes.length == 0) {
      // display that no recipes have been found for the search keyword
      sidebarView.displayRecipesNotFound()
      return;
    }

    // for the first pagination
    sidebarView.renderInitialPage(recipes);

  })
  
  }

const setupBookmarksListener = () => {

}

const setupSidebarListener = () => {
  // event handler for click event
  DOMElements.results.addEventListener("click", async (event) => {
     // get the id of the clicked elemetn
    const recipeElement = event.target.closest(DOMElements.previewRecipe);
    // 
    sidebarView.removeAllHighlights();

    // highlight clicked recipe
    sidebarView.highlightRecipe(recipeElement)

    // get the id of the clicked Recipe
    const id = recipeElement.getAttribute("data-id");
    
    // clear the recipe
    recipeDetailView.clearRecipe();


    // display loader icon in the recipeDetailView
    recipeDetailView.renderLoader();

    // send search request to the model
    const recipeDetail = await recipeModel.fetchNewRecipeById(id)

    // remove the loader 
    recipeDetailView.removeLoader();


    // if the recipe detail is in the bookmarks list highlight it
    const isRecipeBookmarked = recipeModel.isRecipeInBookmarksList(recipeDetail);
    

    // render new recipe
    recipeDetailView.renderRecipe(recipeDetail, isRecipeBookmarked)

  })
   

    // listen for clicks on the pagination
    DOMElements.pagination.addEventListener("click", (event) => {
      if(event.target.closest(DOMElements.paginationNextButton)) {

        // render the next items
        sidebarView.renderPageInDirection("forwards", recipeModel.getRecipesSidebar())

      } else if (event.target.closest(DOMElements.paginationPrevButton)) {
        
        // render the previous items
        sidebarView.renderPageInDirection("backwards", recipeModel.getRecipesSidebar())
      }

    })
}

const setupAddRecipeListener = () => {
  // event handler for the click event
    // open the popup

  // event handler for the close event
    // close the popup

  // event handler for the submit event
    // get the data
    // send the data to the backend
    // clear all of the inputs
    // ? should the popup be closed
}

const setupRecipeDetailListener = () => {
  // when the user clickes on the bookmark functionality
  DOMElements.recipe.addEventListener("click", (e) => {
    const closestElement = e.target.closest(DOMElements.btnBookmark)
    if (closestElement) {
       if (recipeModel.isRecipeInBookmarksList(recipeModel.getRecipeDetail())) {
          console.log("recipe list is in bookmarks")
    //     // remove recipe from recipe list
        recipeModel.removeRecipeFromBookmarksList(recipeModel.getRecipeDetail());
    //     // remove highlight
        recipeDetailView.removeBookmarkHighlight();
        return
      }

      // add recipe to list
      recipeModel.addRecipeToBookmarksList(recipeModel.getRecipeDetail());
      // add hightlighting
      recipeDetailView.addBookmarkHighlight();

    }
  })


  
  
}

const renderRecipesFromLocalStorage = () => {
  const recipes = recipeModel.getRecipesSidebar();
  const recipeDetail = recipeModel.getRecipeDetail();

  if (recipes && recipes.length > 0) {
    sidebarView.renderInitialPage(recipes)
  }
  console.log(recipeDetail)
  if (recipeDetail) {
    recipeDetailView.renderRecipe(recipeDetail)
  }

}



export const init = async function() {

  // Set up event listener for the app
    // for the searchbar
    setupSearchBarListener()
    // for the booksmark section
    setupBookmarksListener()
    // for the sidebar
    setupSidebarListener()
    // for add recipe
    setupAddRecipeListener()
    // setupRecipeDetailListener
    setupRecipeDetailListener();

    // render the recipes from localStorage
    renderRecipesFromLocalStorage()

}


