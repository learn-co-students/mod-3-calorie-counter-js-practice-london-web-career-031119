const bmiForm = document.querySelector('#bmr-calulator')

bmiForm.addEventListener('submit', event => {
    event.preventDefault()
    calculateBmi()
    bmiForm.reset()
})

const calculateBmi = () => {
    const bmiForm = document.querySelector('#bmr-calulator')
    const bmiWeight = bmiForm.querySelector('#bmi-weight')
    const bmiHeight = bmiForm.querySelector('#bmi-height')
    const bmiAge = bmiForm.querySelector('#bmi-age')

    const lowerRange = 665 + (4.35 * bmiWeight.value) + (4.7 * bmiHeight.value) - (4.7 * bmiAge.value)
    const higherRange = 66 + (6.23 * bmiWeight.value) + (12.7 * bmiHeight.value) - (6.8 * bmiAge.value)

    const div = document.querySelector('#bmr-calculation-result')
    const lower = div.querySelector('#lower-bmr-range')
    const higher = div.querySelector('#higher-bmr-range')

    lower.innerText = parseInt(lowerRange)
    higher.innerText = parseInt(higherRange)

    const progress = document.querySelector('.uk-progress')
    const average = (parseInt(lowerRange) + parseInt(higherRange)) / 2
    progress.max = average
}