import {cardsCollection, contentFilter, priority, status, cardPlace} from "./main.js";


let renderCards = (arr) => {
    const df = new DocumentFragment();
    arr.forEach(card => df.append(card.createCardFromVisit()));
    cardPlace.append(df);
};


export const filter  = () => {
            cardPlace.innerHTML = " ";

        let input = contentFilter.value.toLocaleLowerCase();
        console.log(input.length);
        let selectPriority = priority.options[priority.selectedIndex].value;
        console.log(selectPriority.length);
        let selectStatus = status.options[status.selectedIndex].value;
        console.log(selectStatus.length);

            if((input.length !== 0) && (selectPriority.length !== 0) && (selectStatus.length !== 0)){
                let filterCards = cardsCollection.filter(item =>
                    Object.values(item).toString().toLocaleLowerCase().includes(input) &&
                    (item.priority === selectPriority) &&
                     item.status === selectStatus);
                    cardPlace.innerHTML = " ";
                    renderCards(filterCards);}

            if(selectPriority.length === 0){
                let filterCards = cardsCollection.filter(item =>
                    Object.values(item).toString().toLocaleLowerCase().includes(input) &&
                    item.status === selectStatus);
                cardPlace.innerHTML = " ";
                renderCards(filterCards);}

            if((input.length === 0)){
                let filterCards = cardsCollection.filter(item =>
                    (item.priority === selectPriority) &&
                    item.status === selectStatus);
                cardPlace.innerHTML = " ";
                renderCards(filterCards);}

            if((selectStatus.length === 0)){
                let filterCards = cardsCollection.filter(item =>
                    Object.values(item).toString().toLocaleLowerCase().includes(input) &&
                    (item.priority === selectPriority));
                cardPlace.innerHTML = " ";
                renderCards(filterCards);}

            if((input.length === 0) && (selectPriority.length === 0)){
                let filterCards = cardsCollection.filter(item =>
                    item.status === selectStatus);
                cardPlace.innerHTML = " ";
                renderCards(filterCards);}

            if((input.length === 0) && (selectStatus.length === 0)){
                let filterCards = cardsCollection.filter(item =>
                    (item.priority === selectPriority));
                cardPlace.innerHTML = " ";
                renderCards(filterCards);}

            if((selectPriority.length === 0) && (selectStatus.length === 0)){
                let filterCards = cardsCollection.filter(item =>
                    Object.values(item).toString().toLocaleLowerCase().includes(input));
                cardPlace.innerHTML = " ";
                renderCards(filterCards);}

            if((input.length === 0) && (selectPriority.length === 0) && (selectStatus.length === 0)){
                cardPlace.innerHTML = " ";
                renderCards(cardsCollection)}

        };

