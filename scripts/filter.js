import {cardsCollection, contentFilter, priority, status, cardPlace} from "./main.js";

let renderCards = (arr) => {
    const df = new DocumentFragment();
    arr.forEach(card => df.append(card.createCardFromVisit()));
    cardPlace.append(df);
};


export class Filter {
    constructor(contentFilter, priority, status, cardPlace){
        this.contentFilter = contentFilter;
        this.priority = priority;
        this.status = status;
        this.cardPlace = cardPlace;
    }

    filterByContent() {
        let input = contentFilter.value.toLocaleLowerCase();
        let filterCards = cardsCollection.filter(item =>
            Object.values(item).toString().toLocaleLowerCase().includes(input)
        );
        cardPlace.innerHTML = " ";
        renderCards(filterCards);
        if (!input){
            cardPlace.innerHTML = " ";
            renderCards(cardsCollection)}
    }

    filterByPriority() {
        let selectPriority = priority.options[priority.selectedIndex].value;
        let filterPriority = cardsCollection.filter(item => item.priority === selectPriority);
        cardPlace.innerHTML = " ";
        renderCards(filterPriority);
        if (!priority.options[priority.selectedIndex].value){
            renderCards(cardsCollection)
        }
    }

    filterByStatus() {
        let selectStatus = status.options[status.selectedIndex].value;
        let filterStatus = cardsCollection.filter(item => item.status === selectStatus);
        cardPlace.innerHTML = " ";
        renderCards(filterStatus);
        if (!status.options[status.selectedIndex].value) {
            renderCards(cardsCollection)
        }
    }

}

