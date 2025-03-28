// Product configuration
const PRODUCT_CONFIG = {
  options: [
    {
      id: 1,
      units: 1,
      discount: 10,
      originalPrice: 24.00,
      discountedPrice: 10.00,
      isPopular: false
    },
    {
      id: 2,
      units: 2,
      discount: 20,
      originalPrice: 24.00,
      discountedPrice: 18.00,
      isPopular: true
    },
    {
      id: 3,
      units: 3,
      discount: 30,
      originalPrice: 24.00,
      discountedPrice: 24.00,
      isPopular: false
    }
  ]
};

// DOM Elements
const DOM = {
  optionBoxes: document.querySelectorAll('.option-box'),
  radioInputs: document.querySelectorAll('.radio-input'),
  totalAmount: document.getElementById('total-amount'),
  addToCartBtn: document.getElementById('add-to-cart')
};

// State management
let state = {
  selectedOption: 1
};

// Utility functions
const utils = {
  updateTotalAmount(optionId) {
    const option = PRODUCT_CONFIG.options.find(opt => opt.id === optionId);
    if (!option) return;
    DOM.totalAmount.textContent = `$${option.discountedPrice.toFixed(2)} USD`;
  },

  showMessage(message, type = 'success') {
    const messageEl = document.createElement('div');
    messageEl.className = 'success-message';
    if (type === 'error') messageEl.style.backgroundColor = '#EF4444';
    messageEl.textContent = message;
    document.body.appendChild(messageEl);
    setTimeout(() => messageEl.remove(), 3000);
  },

  getSelectedItems(optionId) {
    const option = PRODUCT_CONFIG.options.find(opt => opt.id === optionId);
    if (!option) return [];

    const items = [];
    for (let i = 1; i <= option.units; i++) {
      const sizeSelect = document.getElementById(`option${optionId}-item${i}-size`);
      const colorSelect = document.getElementById(`option${optionId}-item${i}-color`);
      
      if (!sizeSelect || !colorSelect) continue;
      
      items.push({
        number: i,
        size: sizeSelect.value,
        color: colorSelect.value
      });
    }
    return items;
  }
};

// Event handlers
const handlers = {
  handleOptionBoxClick(event) {
    try {
      const optionBox = event.currentTarget;
      const optionId = parseInt(optionBox.dataset.option);
      
      if (isNaN(optionId)) throw new Error('Invalid option ID');
      
      state.selectedOption = optionId;
      this.updateOptionSelection(optionId);
      utils.updateTotalAmount(optionId);
    } catch (error) {
      console.error('Option box click error:', error);
      utils.showMessage('Failed to process option selection', 'error');
    }
  },

  handleRadioChange(event) {
    try {
      const radio = event.target;
      const optionId = parseInt(radio.dataset.option);
      
      if (isNaN(optionId)) throw new Error('Invalid option ID');
      
      state.selectedOption = optionId;
      this.updateOptionSelection(optionId);
      utils.updateTotalAmount(optionId);
    } catch (error) {
      console.error('Radio change error:', error);
      utils.showMessage('Failed to process option selection', 'error');
    }
  },

  handleAddToCart() {
    try {
      const option = PRODUCT_CONFIG.options.find(opt => opt.id === state.selectedOption);
      if (!option) throw new Error('Selected option not found');
      
      const items = utils.getSelectedItems(state.selectedOption);
      if (items.length !== option.units) {
        throw new Error('Missing required selections');
      }
      
      const cartItem = {
        product: `${option.units} Unit`,
        price: option.discountedPrice,
        items
      };
      
      console.log('Added to cart:', cartItem);
      utils.showMessage('Added to cart successfully!');
    } catch (error) {
      console.error('Add to cart error:', error);
      utils.showMessage('Failed to add items to cart', 'error');
    }
  },

  updateOptionSelection(optionId) {
    DOM.optionBoxes.forEach(box => {
      const isSelected = parseInt(box.dataset.option) === optionId;
      box.classList.toggle('active', isSelected);
      box.style.transform = isSelected ? 'translateY(-2px)' : 'translateY(0)';
      box.style.boxShadow = isSelected ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none';
    });
  }
};

// Initialize the component
function init() {
  try {
    // Validate DOM elements
    if (!DOM.optionBoxes.length || !DOM.radioInputs.length || !DOM.totalAmount || !DOM.addToCartBtn) {
      throw new Error('Required DOM elements not found');
    }

    // Set initial state
    DOM.optionBoxes[0].classList.add('active');
    
    // Add event listeners
    DOM.optionBoxes.forEach(box => {
      box.addEventListener('click', handlers.handleOptionBoxClick.bind(handlers));
      
      // Add hover effect
      box.addEventListener('mouseenter', () => {
        if (!box.classList.contains('active')) {
          box.style.transform = 'translateY(-2px)';
          box.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }
      });
      
      box.addEventListener('mouseleave', () => {
        if (!box.classList.contains('active')) {
          box.style.transform = 'translateY(0)';
          box.style.boxShadow = 'none';
        }
      });
    });
    
    DOM.radioInputs.forEach(radio => {
      radio.addEventListener('change', handlers.handleRadioChange.bind(handlers));
    });
    
    DOM.addToCartBtn.addEventListener('click', handlers.handleAddToCart.bind(handlers));
    
    // Initialize total amount
    utils.updateTotalAmount(state.selectedOption);
  } catch (error) {
    console.error('Initialization error:', error);
    utils.showMessage('Failed to initialize the product selector', 'error');
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);