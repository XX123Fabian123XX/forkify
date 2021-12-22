import {API_KEY} from "./utils";

// holds only the ingredient data
class Ingredient {
    constructor(quantity, description, unit) {
        this.quantity = quantity
        this.description = description
        this.unit = unit;
    }
}

// holds only the recipe data
class Recipe {
    constructor(id,title,  publisher, imageUrl, {numberServings, cookingTime, ingredients, sourceUrl} ) {
        this.id = id;
        this.title = title;
        this.publisher = publisher;
        this.imageUrl = imageUrl;
        this.numberServings = numberServings;
        this.cookingTime = cookingTime;
        this.ingredients = ingredients;
        this.sourceUrl = sourceUrl;
    }
}

// holds the data
class RecipeStorage {
    constructor({recipesSidebar, recipeDetail, recipesBookmark}) {
        this.recipesSidebar = recipesSidebar;
        this.recipeDetail = recipeDetail;
        this.recipesBookmark = recipesBookmark ?? [];
    }

    isRecipeInBookmarksList(recipe) {
        if (!this.recipesBookmark) return false;
        const result =  this.recipesBookmark.find(rec => rec.id === recipe.id) ? true : false;
        console.log(`Das Ergebnis ist ${result}`);
        return result;
    }

    removeFromBookmarksList(recipe) {
        const index = this.recipesBookmark.findIndex(rec => rec.id === recipe.id);
        this.recipesBookmark.splice(index,1)
    }
}
// get the recipeData
class RecipeService {
    async fetchNewRecipes(searchKeyword) {
        const searchForRecipesUrl = `https://forkify-api.herokuapp.com/api/v2/recipes?search=${searchKeyword}&key=${API_KEY}`
        let recipeData = await fetch(searchForRecipesUrl);
        return await recipeData.json();
    }

    async fetchRecipeById(id) {
        const searchForRecipeUrl = `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
        let recipeData = await fetch(searchForRecipeUrl);
        return recipeData.json();
    }
}

// process the data
class RecipeProcessor {
    processRecipeIngredients(recipeRawData) {
        return recipeRawData.ingredients.map(ing => {
            return new Ingredient(ing.quantity, ing.description, ing.unit)
        })  
    }

    processRecipeData(recipeRawData) {
        if (recipeRawData.status === "success") {
            return recipeRawData.data.recipes.map(recipe => this.createRecipe(recipe))
        }
        return null;
    }

    processSingleRecipe(recipeRawData) {
        if (recipeRawData.status === "success") {
            return this.createRecipe(recipeRawData.data.recipe)
        }
        return null
     }

    createRecipe(recipeObject) {
        return new Recipe(recipeObject.id, recipeObject.title, recipeObject.publisher, recipeObject.image_url,
            {
               numberServings: recipeObject.servings ?? null,
               cookingTime:recipeObject.cooking_time ?? null,
               sourceUrl: recipeObject.source_url ?? null,
               ingredients: recipeObject.ingredients ?? null
            })
    }

     processLocalStorageData(localStorageData) {

     }
}

// loads data from localStorage
class RecipeLocalStorage {
    // store data in localStorage
    storeDataInLocalStorage({recipesSidebar, recipeDetail, recipesBookmarks}) {
        if (recipesSidebar) {
            window.localStorage.setItem("recipesSidebar", JSON.stringify(recipesSidebar));
        }

        if (recipeDetail) {
            window.localStorage.setItem("recipesDetail", JSON.stringify(recipeDetail))
        }

        if (recipesBookmarks) {
            window.localStorage.setItem("recipesBookmark", JSON.stringify(recipesBookmarks))
        }
    }

    loadDataFromLocalStorage() {
        const localStorageData = {}
        // TODO: FIGURE OUT WHY I HAVE TO DEFINE THE ARRAY HERE AND CANNOT DO THIS [1,2,3,4].forEach
        const items = ["recipesSidebar", "recipesDetail", "recipesBookmark"]
        items.forEach(key => {
            localStorageData[key] = JSON.parse(window.localStorage.getItem(key))
        })
        return localStorageData;
    }
}


class RecipeModel {
    // holds all of the data
    constructor(recipeLocalStorage, recipeProcessor, recipeService, recipeStorage) {
        this.recipeLocalStorage =  new recipeLocalStorage()
        this.recipeProcessor = new recipeProcessor();
        this.recipeService = new recipeService()

        const localStorageData = this.recipeLocalStorage.loadDataFromLocalStorage();
        this.recipeStorage = new recipeStorage(localStorageData);
    }

    isRecipeInBookmarksList(recipe) {
        return this.recipeStorage.isRecipeInBookmarksList(recipe)
    }

    getRecipesSidebar() {return this.recipeStorage.recipesSidebar};
    getRecipeDetail() {return this.recipeStorage.recipeDetail};
    getRecipeBookmark() {return this.recipeStorage.recipesBookmark}


    addRecipeToBookmarksList(recipe) {
        this.recipeStorage.recipesBookmark.push(recipe);
        this.recipeLocalStorage.storeDataInLocalStorage({
            recipesBookmarks:this.getRecipeBookmark()
        });
    }

    removeRecipeFromBookmarksList(recipe) {
        this.recipeStorage.removeFromBookmarksList(recipe);
        this.recipeLocalStorage.storeDataInLocalStorage({
            recipesBookmarks:this.getRecipeBookmark()
        });
    }

    async fetchNewRecipes(searchKeyword) {
        const recipesRawData = await this.recipeService.fetchNewRecipes(searchKeyword)

        this.recipeStorage.recipesSidebar = this.recipeProcessor.processRecipeData(recipesRawData)

        this.recipeLocalStorage.storeDataInLocalStorage({recipesSidebar: this.recipeStorage.recipesSidebar})

        return this.recipeStorage.recipesSidebar;
    }

    async fetchNewRecipeById(id) {
        const recipeRawData = await this.recipeService.fetchRecipeById(id);

        this.recipeStorage.recipeDetail =  this.recipeProcessor.processSingleRecipe(recipeRawData);

        this.recipeLocalStorage.storeDataInLocalStorage({recipeDetail: this.recipeStorage.recipeDetail})

        return this.recipeStorage.recipeDetail;
    }

}

export const recipeModel = new RecipeModel(RecipeLocalStorage, RecipeProcessor, RecipeService, RecipeStorage)
