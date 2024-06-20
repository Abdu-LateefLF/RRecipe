const ingBtn = document.querySelector('#addIng')
const ingText = document.querySelector('#ingText')
const ingList = document.querySelector('#ingList')

const submitBtn = document.querySelector('#submitBtn')
const form = document.querySelector('form')

const list = []

let ingIndex = 0

ingBtn.addEventListener('click', function (e) {
    e.preventDefault()

    if (ingText.value !== '') {

        // Create a new ingredient
        const ingredient = document.createElement('button')
        ingredient.innerText = ingText.value
        ingredient.classList.add('list-group-item', 'list-group-item-action', 'ingredient')
        ingredient.name = `ingredient[]`
        ingredient.id = ingIndex
        ingredient.innerHTML = `                                    
            <p style="display: inline;">${ingText.value}</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
            </svg>`

        list.push(ingText.value)

        // Delete the ingredient on click
        ingredient.addEventListener('click', function (ev) {
            ev.preventDefault()
            list.splice(this.id, 1)
            this.remove()
        })

        // Add to list
        ingList.appendChild(ingredient)
        ingText.value = ''
    }
})

submitBtn.addEventListener('click', function (e) {
    e.preventDefault()

    for (let ingredient of list) {
        let input = document.createElement('input')
        input.type = 'hidden'
        input.name = 'ingredients[]'
        input.value = ingredient

        form.appendChild(input)
    }

    form.submit()
})