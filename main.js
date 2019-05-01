const editCalorieContainer = document.querySelector('#edit-form-container')
const editCalorieForm = document.querySelector('#edit-calorie-form')
const newCalorieForm = document.querySelector("#new-calorie-form")
const bmrCalculator = document.querySelector('#bmr-calculator')
const lowerBMR = (w, h, a) => parseInt(655 + (4.35*w) + (4.7*h) - (4.7*a))
const upperBMR = (w, h, a) => parseInt(66 + (6.23*w) + (12.7*h) - (6.8*a))
const averageBMR = (l, u) => parseInt((l+u)/2)
const progressBar = document.querySelector(".uk-progress")
UIkit.util.on(document, 'hide', '#edit-form-container', () => state.selectedFoodToEdit = null)

const state = {
  lowerBMRvalue: null,
  upperBMRvalue: null,
  averageBMRvalue: null,
  progressValue: 0,
  selectedFoodToEdit: null
}

const makeFoodLiHTML = (target, food) => {
  target.innerHTML = `
  <div class="uk-grid">
    <div class="uk-width-1-6">
      <strong>${food.calorie}</strong>
      <span>kcal</span>
    </div>
    <div class="uk-width-4-5">
      <em class="uk-text-meta">${food.note}</em>
    </div>
  </div>
  <div class="list-item-menu">
    <a class="edit-button" uk-icon="icon: pencil" uk-toggle="target: #edit-form-container"></a>
    <a class="delete-button" uk-icon="icon: trash"></a>
  </div>
  `
}

const addListenerToEditBtn = (target, food) => {
  const editBtn = target.querySelector('.edit-button')
  editBtn.addEventListener('click', () => {
    state.selectedFoodToEdit = food
    editCalorieForm["edit-calorie"].value = state.selectedFoodToEdit.calorie
    editCalorieForm["edit-note"].value = state.selectedFoodToEdit.note
  })
}

const addListenerToDeleteBtn = (target, food) => {
  const deleteBtn = target.querySelector(".delete-button")
  deleteBtn.addEventListener('click', () => {
    state.progressValue -= parseInt(food.calorie)
    renderProgressValue()
    deleteFood(food)
    target.remove()
  })
}

// render a food row on load (li.calories-list-item) + // delete calorie intake + //edit button event listener
const renderFood = (food) => {
  const caloriesList = document.querySelector("#calories-list")
  const foodLi = document.createElement('li')
  foodLi.className = "calories-list-item"
  foodLi.id = `food${food.id}`
  makeFoodLiHTML(foodLi,food)
  addListenerToEditBtn(foodLi,food)
  addListenerToDeleteBtn(foodLi,food)
  caloriesList.prepend(foodLi)
  state.progressValue += parseInt(food.calorie)
}

// render all food rows on load
const renderFoods = (foods) => foods.forEach(renderFood)

// create a new calorie entry + prepend + event listener for form #new-calorie-form + run calculation function
const addEventListenerToNewCalorieForm = () => {
  newCalorieForm.addEventListener('submit', event => {
  event.preventDefault()

  const food = {
    calorie: newCalorieForm.calorie.value,
    note: newCalorieForm.note.value
  }

  createFood(food)
  .then(renderFood)
  renderProgressValue()

  newCalorieForm.reset();
})}

// calculate the calories and show on #uk-progress
const renderProgressValue = () => {
  progressBar.value = state.progressValue
}

// clicking the 'Save Changes' button in the modal form will update that entry on the front-end as well as the backend, we would like this to happen pessimistically.
const addEventListenerToEditCalorieForm = () => {
  editCalorieForm.addEventListener('submit', event => {
    event.preventDefault()
    UIkit.modal(editCalorieContainer).hide()
    const targetRow = document.querySelector(`#food${state.selectedFoodToEdit.id}`)

    const updatedFood = {
      id: state.selectedFoodToEdit.id,
      calorie: editCalorieForm["edit-calorie"].value,
      note: editCalorieForm["edit-note"].value
    }

    updateFood(updatedFood)
    targetRow.className = "calories-list-item"
    targetRow.id = `food${updatedFood.id}`
    makeFoodLiHTML(targetRow, updatedFood)
    addListenerToEditBtn(targetRow,updatedFood)
    addListenerToDeleteBtn(targetRow,updatedFood)

    state.progressValue -= state.selectedFoodToEdit.calorie
    state.progressValue += parseInt(updatedFood.calorie)
    renderProgressValue()

    state.selectedFoodToEdit = null
  })
}

// Clicking the "Calculate BMR" button should update the span#lower-bmr-range and span#higher-bmr-range with the appropriate values" + set the #progress-bar's max attribute to the average of the two numbers above.
const addEventListenerToBMRCalculator = () => {
  bmrCalculator.addEventListener('submit', event => {
    event.preventDefault()
    const w = bmrCalculator.weight.value
    const h = bmrCalculator.height.value
    const a = bmrCalculator.age.value

    const lowerBMRspan = document.querySelector("#lower-bmr-range")
    const upperBMRspan = document.querySelector("#higher-bmr-range")

    const lowerBMRvalue = lowerBMR(w,h,a)
    const upperBMRvalue = upperBMR(w,h,a)
    const averageBMRvalue = averageBMR(lowerBMRvalue, upperBMRvalue)
    state.lowerBMRvalue = lowerBMRvalue
    state.upperBMRvalue = upperBMRvalue
    state.averageBMRvalue = averageBMRvalue
    lowerBMRspan.innerText = lowerBMRvalue
    upperBMRspan.innerText = upperBMRvalue
    progressBar.attributes.max.value = averageBMRvalue

    bmrCalculator.reset()
})}

const init = () => {
  getFoods()
  .then(renderFoods)
  renderProgressValue(state.progressValue)
  addEventListenerToNewCalorieForm()
  addEventListenerToEditCalorieForm()
  addEventListenerToBMRCalculator()
}

init()
