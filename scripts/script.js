const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector('aside header h2')

amount.oninput = () => {
  const onlyNumbers = /\D+/g
  let value = amount.value.replace(onlyNumbers, "")

  value = Number(value) / 100

  amount.value = formatCurrencyBRL(value)
}

const formatCurrencyBRL = (value) => {
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  return value
}

form.onsubmit = (e) => {
  e.preventDefault()

  const newExpense = {
    id: new Date().getTime(),
    name: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }

  expenseAdd(newExpense)
}

const expenseAdd = (newExpense) => {
  try {
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.name

    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`

    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "img/remove.svg")
    removeIcon.setAttribute("alt", "remover")

    expenseInfo.append(expenseName, expenseCategory)

    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

    expenseList.append(expenseItem)

    formClear()

    updateTotals()
  } catch (error) {
    alert("Erro desconhecido!")
    console.log(error)
  }
}

const updateTotals = () => {
  try {
    const items = expenseList.children

    expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

    let total = 0

    for (let index = 0; index < items.length; index++) {
      const element = items[index].querySelector('.expense-amount')

      let value = element.textContent.replace(/[^\d,]/g, '').replace(',', '.')
      value = parseFloat(value)
      
      if (isNaN(value)) {
          return alert('Erro ao calcular o total.')
      }
      total += Number(value)
  }

  const symbolBRL = document.createElement('small')
  symbolBRL.textContent = 'R$'

  total = formatCurrencyBRL(total).toUpperCase().replace('R$', '').trim()

  expensesTotal.innerHTML = ''
  expensesTotal.append(symbolBRL, total)
  } catch (error) {
    alert("Não foi possível atualizar os totais")
    console.log(error)
  }
}

expenseList.addEventListener("click", (e) => {
  if(e.target.classList.contains("remove-icon")) {
    const item = e.target.closest(".expense")
    item.remove()
  }
  updateTotals()
})

const formClear = () => {
  expense.value = ""
  category.value = ""
  amount.value = ""

  expense.focus()
}