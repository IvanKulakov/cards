const authToken = localStorage.getItem('token');
const urlCards = 'https://ajax.test-danit.com/api/v2/cards';

export class Visit {
    constructor(baseParams) {
        Object.assign(this, baseParams);
    }

    syncVisitWithServer(method,id) {
        return fetch(
            urlCards + (id ? `/${id}` : ''), //если передан id, подставить его в ссылку
            {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(this)
            });
    }

    createCardFromVisit() {
        const card = document.createElement('div');
        card.dataset.id = this.id;
        card.classList.add("cards-collection__item","card");
        card.innerHTML =
            `<div class="card__container">
                    <div class="card__main-info">
                        <p class="card__client-name">${this.name}</p>
                        <p class="card__doctor-name">${this.doctor}</p>
                    </div>
                    <div class="card__control-icons-container">
                        <img class="card__control-icon icon edit-card" src="imgs/editIcon.png" alt="edit">
                        <img class="card__control-icon icon del-card" src="imgs/closeIcon.png" alt="close">
                    </div>
                </div>
                <button class="card__btn btn more">Показать больше</button>`;
        return card;
    }
    get visitClass() {
        return this.__proto__.constructor;
    }
}

export class Cardiologist extends Visit {
    constructor({pressure, bmi, diseases, age, ...baseParams}) {
        super(baseParams);
        Object.assign(this, {
            pressure,
            bmi,
            diseases,
            age,
        });
    }

}

export class Dentist extends Visit {
    constructor({lastVisit, ...baseParams}) {
        super(baseParams);
        this.lastVisit = lastVisit;
    }

}

export class Therapist extends Visit {
    constructor({age, ...baseParams}) {
        super(baseParams);
        this.age = age;
    }

}
