// your code here, it may be worth it to ensure this file only runs AFTER the dom has loaded.
document.addEventListener('DOMContentLoaded', () => {
    init()
})

const url = 'http://localhost:3000/api/v1/calorie_entries'
const ul = document.querySelector('#calories-list')

let calorieCount = 0

const state = {
    intakes: []
}

const calCounter = () => {
    calorieCount = 0
    state.intakes.forEach(intake => calorieCount += intake.calorie)
    updateProgress()
}

const updateProgress = () => {
    const progress = document.querySelector('.uk-progress')
    progress.value = calorieCount
}

const renderIntake = intake => {
    const li = document.createElement('li')
    li.className = 'calories-list-item'
    li.innerHTML = `
    <div class="uk-grid">
    <div class="uk-width-1-6">
      <strong>${intake.calorie}</strong>
      <span>kcal</span>
    </div>
    <div class="uk-width-4-5">
      <em class="uk-text-meta">${intake.note}</em>
    </div>
  </div>
  <div class="list-item-menu">
    <a class="edit-button" uk-icon="icon: pencil" uk-toggle="target: #edit-form-container"></a>
    <a class="delete-button" uk-icon="icon: trash"></a>
  </div>
    `

    ul.prepend(li)

    const delBtn = li.querySelector('.delete-button')
    delBtn.addEventListener('click', () => {
        deleteIntake(intake)
        li.remove()
        state.intakes = state.intakes.filter(test => test.id !== intake.id)
        calCounter()
    })

    const editBtn = li.querySelector('.edit-button')
    editBtn.addEventListener('click', () => {
        const editForm = document.querySelector('.uk-modal-dialog ')
        let cals = editForm.querySelector('.uk-input')
        let note = editForm.querySelector('.uk-textarea')
        cals.value = intake.calorie
        note.value = intake.note

        editClick = editForm.querySelector('.uk-button')
        editClick.addEventListener('click', () => {
            const newIntake = {
                api_v1_calorie_entry: {
                    id: intake.id,
                    calorie: cals.value,
                    note: note.value
                }
            }
            li.remove()
            updateIntake(newIntake)
                .then(renderIntake(newIntake.api_v1_calorie_entry))
        })
    })
}

const addIntake = () => {
    const formEl = document.querySelector('#new-calorie-form')
    const cals = formEl.querySelector('.uk-input')
    const note = formEl.querySelector('.uk-textarea')

    // def api_v1_calorie_entry_params
    //     params.require(:api_v1_calorie_entry).permit(:calorie, :note)
    // end
    //! Above causes errors because the post request needs to be in a nested hash
    formEl.addEventListener('submit', event => {
        event.preventDefault()
        const intake = {
            api_v1_calorie_entry: {
                calorie: cals.value,
                note: note.value
            }
        }

        createIntake(intake)
            .then((data) => {
                state.intakes.push(data)
                renderIntake(data)
                calCounter()
            })

        formEl.reset()
    })
}

const renderIntakes = intakes => {
    intakes.forEach(renderIntake)
}

//! Init

const init = () => {
    getIntake()
        .then((intakes) => {
            state.intakes = intakes
            renderIntakes(intakes)
            calCounter()
        })
    addIntake()
}