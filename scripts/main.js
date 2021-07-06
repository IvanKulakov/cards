import {CreateVisitModal, EditVisitModal, MoreInfoModal} from "./modalsClasses.js";
import {fetchMethods} from "./fetchMethods.js";
import {Visit,Cardiologist, Dentist, Therapist} from "./visitClasses.js";
import {filter} from "./filter.js";
export const docTypeMap = {
    'Cardiologist': Cardiologist,
    'Therapist': Therapist,
    'Dentist': Dentist,
};
export let cardsCollection = [];

const newCardButton = document.getElementById('create-visit');
newCardButton.addEventListener('click', () => {
    new CreateVisitModal();
})
const urlCards = 'https://ajax.test-danit.com/api/v2/cards';
const email = document.getElementById('email');
const pass = document.getElementById('pass');
const btnEnter = document.getElementById('enter');
export const cardPlace = document.getElementById('cardPlace');
export const contentFilter = document.getElementById('content-filter');
export const priority = document.getElementById('priority');
export const status = document.getElementById('status');


window.logCards = () => console.log(cardsCollection);


(async () => {
    //показываем поле входа и вешаем листенер на кнопку

    //если токен есть - отправить запрос на карточки
    //если запрос ок - отренденрить страницу
    //если запрос не ок - ждем токен из кнопки

    //если нет токена - ждем токен из кнопки

    async function getCards() {
        //делает запрос с токеном, если все ок, то в коллекции у нас актуальные карточки
        return await fetch(urlCards, fetchMethods.methodGetCards)
            .then(resp => {
                if (!resp.ok) {
                    return Promise.reject(resp);
                }
                return resp.json();
            })
            .then(data => (cardsCollection = [...data]) && true)
            .catch(resp => console.error)
    }


    function makeVisitsClassInstances() {
        //поскольку с сервака приваливают просто объекты, а мне нужны экземпляры классов, я их тут пересоздаю.
        return cardsCollection.map(card => new docTypeMap[card.doctor](card))
    }

    async function renderPage() {
        //отрисовывает страницу, если получила карточки
        if (await getCards()) {
            newCardButton.classList.remove('vis');
            document.getElementById('cardsBlock').classList.remove('vis');
            document.getElementById('passBlock').classList.add('vis');

            const df = new DocumentFragment();
            cardsCollection = makeVisitsClassInstances();
            cardsCollection.forEach(card => df.append(card.createCardFromVisit()))
            cardPlace.append(df);
        }
    }

    btnEnter.addEventListener('click', e => {
        //функция отправляет запрос на получение токена и если все ок, то отрисовывает страницу
        e.preventDefault();

        fetchMethods.methodFetchLogin.body = JSON.stringify({
            email: email.value,
            password: pass.value
        });

        fetch(urlCards + '/login', fetchMethods.methodFetchLogin)
            .then(resp => {
                if (!resp.ok) {
                    return Promise.reject(resp);
                }
                return resp.text();
            })
            .then(token => {
                localStorage.setItem('token', token);
                Object.keys(fetchMethods).forEach(method => {
                    Object.assign(fetchMethods[method].headers, {'Authorization': `Bearer ${token}`})
                })
                renderPage();
            })
            .catch(fail => console.log(fail) || alert('Authorization failed, try again('));
    });

    if (localStorage.getItem('token')) {
        await renderPage();
    }

    // Один листенер на всю картотеку, ибо вешать на каждую кнопку - неправильно,
    // да и при добавлении карточек у них этих листенеров нет.
    cardPlace.addEventListener('click', event => {
        const elem = event.target;
        const isElemOfType = (classname) => elem.classList.contains(classname);

        if (isElemOfType('del-card')) {
            const cardElem = elem.closest('.cards-collection__item');
            const visitId = cardElem.dataset.id;
            Visit.prototype.syncVisitWithServer('DELETE', visitId)
                .then(res => {
                    if (res.status === 200) {
                        cardsCollection.splice(cardsCollection.indexOf(card => card.id.toString() === visitId), 1);
                        cardElem.remove();
                    }
                })
                .catch(err => console.error('catch logs:', err))
        }
        if (isElemOfType('edit-card')) {
            const visitId = elem.closest('.cards-collection__item').dataset.id;
            new EditVisitModal(cardsCollection.find(card => `${card.id}` === visitId));
        }
        if (isElemOfType('more')) {
            const visitId = elem.closest('.cards-collection__item').dataset.id;
            new MoreInfoModal(cardsCollection.find(card => `${card.id}` === visitId));
        }
    });



    contentFilter.addEventListener('input', filter);

    priority.addEventListener('change', filter);

    status.addEventListener('change', filter);

})();

