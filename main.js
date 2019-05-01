// your code here, it may be worth it to ensure this file only runs AFTER the dom has loaded.
const CALORIE_ITEMS_URL = 'http://localhost:3000/api/v1/calorie_entries'
const editForm = document.querySelector('.uk-modal-dialog').querySelector('#new-calorie-form')
const state = {
    listItemForUpdate: null,
    listItems: []
  }
let totalCalories = 0

const renderCalorieListItem = (calorieItem) => {
    const liEl = document.createElement('li')
    liEl.className = "calories-list-item"
    liEl.innerHTML = `
    <div class="uk-grid">
    <div class="uk-width-1-6">
      <strong>${calorieItem.calorie}</strong>
      <span>kcal</span>
    </div>
    <div class="uk-width-4-5">
      <em class="uk-text-meta"> ${calorieItem.note}</em>
    </div>
    </div>
    <div class="list-item-menu">
        <a class="edit-button" uk-icon="icon: pencil" uk-toggle="target: #edit-form-container"></a>
        <a class="delete-button" uk-icon="icon: trash"></a>
    </div>
    `
    const ulEl = document.getElementById('calories-list')
    ulEl.prepend(liEl)

    liEl.querySelector('.delete-button').addEventListener('click', () => {
        deleteCalorieListItem(calorieItem.id)
        liEl.remove()
        state.listItems = state.listItems.filter(item => item.id !== calorieItem.id)
        calorieCounter() 
    })
    
    const editButton = liEl.querySelector('.edit-button')
    editButton.addEventListener('click', () => {
        editForm.querySelector('.uk-input').value = calorieItem.calorie
        editForm.querySelector('.uk-textarea').value = calorieItem.note
        state.listItemForUpdate = calorieItem
    })
}

const addEventListenertoUpdate = () => {
    editForm.addEventListener('submit', () => {
        let updatedCalorieItem = {
            calorie: editForm.querySelector('.uk-input').value,
            note: editForm.querySelector('.uk-textarea').value 
        }

        paramsCalorieItem = {api_v1_calorie_entry: {calorie: updatedCalorieItem.calorie, note: updatedCalorieItem.note}}
        updateCalorieListItem(paramsCalorieItem, state.listItemForUpdate.id)

        state.listItemForUpdate = null
    })
}

const renderCalorieListItems = (calorieItems) => {
    calorieItems.forEach(renderCalorieListItem)
}

const getCalorieItems = () => {
    return fetch(CALORIE_ITEMS_URL)
        .then(resp => resp.json())
}

const addFormEvent = () => {
    const formEl = document.getElementById('new-calorie-form')
    formEl.addEventListener('submit', (e) => {
        e.preventDefault()
        let calorieItem = {
            calorie: formEl.querySelector('.uk-input').value,
            note: formEl.querySelector('.uk-textarea').value 
        }
        createCalorieListItem(calorieItem)
            .then(data => {
                state.listItems.push(data)
                renderCalorieListItem(data)
                calorieCounter() 
            })
    
        
        formEl.reset() 
    })
}


const createCalorieListItem = (calorieItem) => {
    // def api_v1_calorie_entry_params
    // params.require(:api_v1_calorie_entry).permit(:calorie, :note)
    // end
    paramsCalorieItem = {api_v1_calorie_entry: {calorie: calorieItem.calorie, note: calorieItem.note}}

    return fetch(CALORIE_ITEMS_URL, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(paramsCalorieItem)
    }).then(resp => resp.json())

}

const updateCalorieListItem = (paramsCalorieItem, id) => {
    fetch(CALORIE_ITEMS_URL + `/${id}`, {
        method: 'PATCH',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(paramsCalorieItem)
    }).then(resp => resp.json())
}

const deleteCalorieListItem = (id) => {
    fetch(CALORIE_ITEMS_URL + `/${id}`, {
        method: 'DELETE'})
}

const addEventListenerToBMR = () => {
    const BMRForm = document.querySelector('#bmr-calulator')
    BMRForm.addEventListener('submit', (e) => {
        e.preventDefault()

        let weight = parseInt(BMRForm.querySelector('#weight-BMR').value, 10)
        let height = parseInt(BMRForm.querySelector('#height-BMR').value, 10) 
        let age = parseInt(BMRForm.querySelector('#age-BMR').value , 10)
        calculateBMR(weight, height, age)
        e.target.reset()
    })
}

const calculateBMR = (weight, height, age) => {
    let upperRange = Math.round(655 + (4.35*weight) + (4.7*height) - (4.7*age))
    let lowerRange = Math.round(66 + (4.23*weight) + (12.7*height) - (6.8*age))

    document.querySelector('#lower-bmr-range').innerText = lowerRange
    document.querySelector('#higher-bmr-range').innerText = upperRange

    let average = Math.round((lowerRange + upperRange)/2) 

    document.querySelector('.uk-progress').setAttribute("max", average) 
}

const calorieCounter = () => {
    totalCalories = 0
    state.listItems.forEach((item) => {
        totalCalories += item.calorie
    })
    document.querySelector('.uk-progress').value = totalCalories
}

const init = () => {
    getCalorieItems()
        .then((items) => {
            state.listItems = items
            renderCalorieListItems(items)
            calorieCounter() 
        })
    addFormEvent()
    addEventListenertoUpdate()
    addEventListenerToBMR()
}

init()


