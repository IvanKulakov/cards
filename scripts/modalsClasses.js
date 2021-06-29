import {Cardiologist, Dentist, Therapist} from "./visitClasses.js";
import {cardsCollection, docTypeMap} from "./main.js";


class Modal {
    constructor(id) {
        this.DOMlink = document.createElement('aside');
        this.DOMlink.classList.add('modal');
        this.DOMlink.id = id;
        this.DOMlink.innerHTML = `
            <form class="modal__body group">
                <h2 class="modal__title"></h2>
                <label class="modal__doc-type-label visit-param">Специальность врача: 
                <select
                    class="modal__doc-type-select input" data-param-type="doctor">
                    <option disabled selected>-</option>
                    <option value="Cardiologist">Кардиолог</option>
                    <option value="Dentist">Стоматолог</option>
                    <option value="Therapist">Терапевт</option>
                </select>
                </label>
                <div class="modal__param-container"></div>
                <a role="button" class="modal__close-button close-modal" aria-label="close this modal">
                    <img class="modal__close-icon" src="imgs/closeIcon.png" alt="close">
                </a>
            </form>
            <a class="modal__outside-close-trigger close-modal" role="button" aria-label="close this modal"></a>`;
        this.docTypeSelect = this.DOMlink.querySelector(`#${id} .modal__doc-type-select`);
        this.title = this.DOMlink.querySelector(`#${id} .modal__title`);
        this.paramContainer = this.DOMlink.querySelector(`#${id} .modal__param-container`);

        this.DOMlink.querySelectorAll(`#${id} .close-modal`)
            .forEach(elem => elem.addEventListener('click', () => this.closeModal()));
        document.body.prepend(this.DOMlink);
    }

    renderModalContent(docType, visitData = {}) {
        if (!docType) return;

        const universalVisitParams =
            `<label class="new-visit-modal__purpose-label visit-param">Цель визита: <input class="new-visit-modal__visit-purpose input" data-param-type="target" type="text" value="${visitData.target || ''}" ></label>
        <label class="new-visit-modal__description-label visit-param">Описание визита: <textarea class="new-visit-modal__visit-description input textarea-fixed" data-param-type="description" >${visitData.description || ''}</textarea></label>
        <label class="new-visit-modal__priority-label visit-param">Приоритет: <select class="new-visit-modal__visit_priority input" data-param-type="priority">
            <option value="low" ${visitData.priority === 'low' && 'selected'}>Low</option>
            <option value="high" ${visitData.priority === 'high' && 'selected'}>High</option>
            <option value="normal" ${visitData.priority === 'normal' && 'selected'}>Normal</option>
        </select ></label>
        <label class="new-visit-modal__status-label visit-param">Статус: <select class="new-visit-modal__visit_status input" data-param-type="status">
            <option value="open" ${visitData.status === 'open' && 'selected'}>Open</option>
            <option value="done" ${visitData.status === 'done' && 'selected'}>Done</option>
        </select ></label>

        <label class="new-visit-modal__patient-name-label visit-param">ФИО пациента: <input class="new-visit-modal__patient-name input" data-param-type="name" type="text" value="${visitData.name || ''}" ></label>`
        let additionalParams;

        this.paramContainer.innerHTML = '';
        switch (docType) {
            case 'Cardiologist':
                additionalParams = `
                <label class="new-visit-modal__pressure-label visit-param">Обычное давление: <input class="new-visit-modal__pressure-param input" data-param-type="pressure" type="number" value="${visitData.pressure || ''}" ></label>
                <label class="new-visit-modal__bmi-label visit-param">ИМТ: <input class="new-visit-modal__bmi-param input" type="number" data-param-type="bmi" value="${visitData.bmi || ''}" ></label>
                <label class="new-visit-modal__diseases-label visit-param">Перенесенные заболевания серд.-сосуд. системы: <textarea class="new-visit-modal__diseases-param textarea-fixed input" data-param-type="diseases" >${visitData.diseases || ''}</textarea></label>
                <label class="new-visit-modal__age-label visit-param">Возраст: <input class="new-visit-modal__age-param input" type="number" data-param-type="age" value="${visitData.age || ''}" ></label>
            `;
                break;
            case 'Therapist':
                additionalParams = `
                <label class="new-visit-modal__age-label visit-param">Возраст: <input class="new-visit-modal__age-param input" data-param-type="age" type="number" value="${visitData.age || ''}" ></label>
            `;
                break;
            case 'Dentist':
                additionalParams = `
                <label class="new-visit-modal__last-visit-label visit-param">Дата последнего визита: <input class="new-visit-modal__last-visit-param input" type="date" data-param-type="lastVisit" value="${visitData.lastVisit || ''}"></label>
            `;
                break;
        }
        this.paramContainer.innerHTML = universalVisitParams + additionalParams;
    }

    get selectedDocType() {
        return this.docTypeSelect.selectedOptions[0].value;
    }

    closeModal() {
        this.DOMlink.remove();
        delete this;
    }

    gatherVisitData() {
        //возвращает данные визита, если все поля заполнены, либо undefined
        const params = [...this.DOMlink.querySelectorAll(`#${this.DOMlink.id} .visit-param [data-param-type]`)]
            .reduce((paramsObj, paramElem) => {
                return {
                    ...paramsObj,
                    [paramElem.dataset.paramType]: paramElem.value.trim(),
                }
            }, {});
        return !Object.values(params).some(param => !param.toString()) && params;
    }


}

export class CreateVisitModal extends Modal {
    constructor() {
        super('create-visit-modal');
        this.title.innerText = 'Новый визит';

        this.docTypeSelect.addEventListener('change', () => {
            this.docTypeSelect.addEventListener('change', e => {
                this.renderModalContent(this.selectedDocType)
            })

            this.renderModalContent(this.selectedDocType);

            this.actionButton = document.createElement(`button`);
            this.actionButton.classList.add(`modal__action-button`, `btn`, `btn--large`)
            this.actionButton.innerText = 'Создать визит';
            this.actionButton.addEventListener('click', e => {
                e.preventDefault();
                this.createVisit(this.selectedDocType)
            })
            this.DOMlink.querySelector(`#${this.DOMlink.id} .modal__body`).append(this.actionButton);
        }, {once: true})


    }

    createVisit(docType) {
        const visitClass = docTypeMap[docType];

        const visitData = this.gatherVisitData();
        if (visitData) {
            const newVisit = new visitClass(visitData);
            newVisit.syncVisitWithServer('POST')
                .then(res => res.json())
                .then(({id}) => {
                    this.closeModal();
                    newVisit.id = id;
                    cardsCollection.unshift(newVisit);
                    cardPlace.prepend(newVisit.createCardFromVisit());
                })
                .catch(err => {
                    alert('Ошибка создания визита');
                    console.error(err);
                });
        } else {
            setTimeout(() => alert('Заполните все поля, пожалуйста'), 300);
        }
    }
}

export class EditVisitModal extends Modal {
    constructor(visitObj) {
        super('edit-visit-modal');
        this.docTypeSelect.options.selectedIndex = [...this.docTypeSelect.options].findIndex(option => option.value === visitObj.doctor);

        this.renderModalContent(this.selectedDocType, visitObj);
        this.title.innerText = 'Изменить данные визита';

        this.docTypeSelect.addEventListener('change', e => {
            e.preventDefault();
            this.renderModalContent(this.selectedDocType, visitObj)
        })


        this.actionButton = document.createElement(`button`);
        this.actionButton.classList.add(`modal__action-button`, `btn`, `btn--large`)
        this.actionButton.innerText = 'Сохранить изменения';
        this.actionButton.addEventListener('click', e => {
            e.preventDefault();
            this.updateVisit(visitObj)
        });
        this.DOMlink.querySelector(`#${this.DOMlink.id} .modal__body`).append(this.actionButton);
    }

    updateVisit(visit) {
        const oldVisitClass = visit.visitClass;
        const oldVisitData = {...visit};
        const visitId = visit.id;

        const newVisitData = this.gatherVisitData();
        if (newVisitData) {
            visit = new docTypeMap[visit.doctor](newVisitData);
            visit.syncVisitWithServer('PUT', visitId)
                .then(res => res.json())
                .then(() => {
                    visit.id = visitId;
                    cardsCollection[cardsCollection.findIndex(card => card.id === visit.id)] = visit;
                    this.closeModal();
                    document.querySelector(`[data-id="${visit.id}"]`).replaceWith(visit.createCardFromVisit());
                })
                .catch(resp => {
                    alert('Ошибка изменения визита')
                    visit = new oldVisitClass(oldVisitData);
                    visit.id = visitId;
                    console.error(resp)
                });
        } else {
            alert('Заполните все поля, пожалуйста');
        }
    }
}

export class MoreInfoModal extends Modal {
    constructor(visitObj) {
        super('more-info-modal');
        this.docTypeSelect.options.selectedIndex = [...this.docTypeSelect.options].findIndex(option => option.value === visitObj.doctor);

        this.renderModalContent(this.selectedDocType, visitObj);
        this.title.innerText = 'Карта визита';
        document.querySelectorAll(`#more-info-modal .visit-param > *`)
            .forEach(field => field.setAttribute('disabled', 'true'));
    };

}
