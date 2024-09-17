import { menuArray } from '/data.js'

const menuEl = document.getElementById("menu-list")
const orderDetailsEl = document.getElementById("order-details-el")
const paymentModal = document.getElementById("modal-container")
const orderSummHeading = document.getElementById("order-summ-heading")

const TOTAL_COST_EL_ID = 'total-cost'

let orderArray = []
let totalCost = 0
let paymentSubmitted = false

// Functions for showing & hiding modal
function showModal() {
    paymentModal.classList.remove('hidden')
}

function hideModal() {
    paymentModal.classList.add('hidden')
}

// Event listener for clicks
document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.add-btn')
    const removeBtn = e.target.closest('.remove-btn')
    const closeModalBtn = e.target.closest('.modal-close-btn')
    const orderBtn = e.target.closest("#order-btn")
    
    if (addBtn) {
        handleAddClick(addBtn.dataset.id)
    } 
    else if (removeBtn) {
        handleRemoveClick(removeBtn.dataset.id)
    }
    else if (closeModalBtn) {
        hideModal()
    }
    else if (orderBtn) {
        showModal()
    }
})

document.addEventListener('submit', (e) => {
    e.preventDefault()
    handlePaymentSubmit()
})

// Function for handling click on add button
function handleAddClick(itemId) {
    let targetObject = menuArray.find(item => item.id == itemId)
    
    if (!orderArray.includes(targetObject)) {
        orderArray.push(targetObject)
        targetObject.quantity = 1
    } else {
        targetObject.quantity++
    }

    totalCost += targetObject.price
    
    document.getElementById(TOTAL_COST_EL_ID).textContent = `$${totalCost.toFixed(2)}`

    if (orderArray.length > 0) {
        orderDetailsEl.classList.remove('hidden')
    }

    render()
}

// Function for handling click on remove button
function handleRemoveClick(itemId) {
    let targetObject = orderArray.find(item => item.id == itemId);

    if (targetObject) {
        targetObject.quantity--;
        totalCost -= targetObject.price;

        // Update total cost
        document.getElementById(TOTAL_COST_EL_ID).textContent = `$${totalCost.toFixed(2)}`;

        if (targetObject.quantity <= 0) {
            // Remove the item from the order array
            orderArray = orderArray.filter(item => item.id != itemId);
        }
        
        // Re-render the order summary
        render();

        // If the order is empty, set a timeout to hide order details & make the transition not as sudden
        if (orderArray.length === 0) {
            setTimeout(() => {
                orderDetailsEl.classList.add('hidden');
            }, 500); 
        }
    }
}

// Function for adding menu items to order summary
function addItemsToOrder() {
    let orderSummHtml = ``

    orderArray.forEach((item) => {
        orderSummHtml += `
            <div class="items-ordered">
                <span>${item.name} (x${item.quantity})</span>
                <div class="item-cost-remove-container">
                    <span>
                        <button class="remove-btn" data-id="${item.id}"><i class="fa-solid fa-trash-can"></i></button>
                    </span>
                    <span id="item-cost">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            </div>
        `
    })

    orderSummHtml += `
        <div class="total-cost-disp">
            <span>Total: </span>
            <span id="${TOTAL_COST_EL_ID}">$${totalCost.toFixed(2)}</span>
        </div>
        <button class="order-btn" id="order-btn">Place order</button>
    `

    orderDetailsEl.innerHTML = orderSummHtml
}

// Function for rendering menu items
function getMenuData() {
    let menuDataHtml = ''

    menuArray.forEach(item => {
        // Format ingredients
        const formattedIngredients = item.ingredients.join(', ')
        
        menuDataHtml += `
            <div class="menu-item">
                <div class="item-img">${item.emoji}</div>
                <div class="item-info">
                    <h4 class="item-title">${item.name}</h4>
                    <div class="item-description">${formattedIngredients}</div>
                    <div class="item-price">$${item.price}</div>
                </div>
                <button class="add-btn" data-id="${item.id}">
                    <i class="fa-solid fa-cart-plus"></i>
                </button>
            </div>
        `
    })

    return menuDataHtml
}

// Function to handle order submission
function handleOrderSubmit() {  
    showModal()
    
    document.getElementById(TOTAL_COST_EL_ID).textContent = `$${totalCost.toFixed(2)}`
    
    // Update the UI
    render()
}

function handlePaymentSubmit() {
    // Show processing order message, then hide the modal & order details after payment, update heading
    document.getElementById('order-processing').textContent = "Processing your payment...."
    
    setTimeout(() => {
        hideModal()
        orderDetailsEl.classList.add('hidden')
        
        // Clear the order
        orderArray = []
        totalCost = 0
        
        // clear the menu date
        const menuItemsContainer = document.getElementById('menu-items-container')
        menuItemsContainer.classList.add('hidden')
        
        // Update UI to show empty order & thank you
        render()
        orderSummHeading.textContent = "Your order is on the way!"
        document.getElementById('gif-container').classList.remove('hidden')
        
        paymentSubmitted = true
    }, 2000)
    
    setTimeout(() => {
        window.location.reload()
    }, 10000)
}

// Function to render the menu and order details
function render() {
    menuEl.innerHTML = getMenuData()
    addItemsToOrder()
    
    const orderBtn = document.getElementById("order-btn")

    // Only update the order summary heading if payment has NOT been submitted
    if (!paymentSubmitted) {
        if (orderArray.length > 0) {
            orderSummHeading.textContent = "Your Order"
            if (orderBtn) {
                orderBtn.addEventListener('click', handleOrderSubmit)
            }
        } else {
            orderSummHeading.textContent = "Your order is empty"
            if (orderBtn) {
                orderBtn.removeEventListener('click', handleOrderSubmit)
            }
        }
    }
    
    // Don't clear order details until payment is submitted
    if (orderArray.length > 0) {
        orderDetailsEl.classList.remove('hidden')
    }
}

render()


