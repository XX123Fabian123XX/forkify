import {DOMElements} from "../utils"

class SearchView {

    // clear input
    clearInput() {
        DOMElements.searchField.value = ""
    }

    // get the input Data
    getInputData() {
        const input = DOMElements.searchField.value;
        return input === "" ? null : input
    }
}

export const searchView = new SearchView();
