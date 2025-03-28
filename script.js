// Product configuration - BOGO deals
const PRODUCT_CONFIG = {
  options: [
    {
      id: 1,
      units: 2,
      discount: 10,
      originalPrice: 48.00,
      discountedPrice: 10.00,
      isPopular: false
    },
    {
      id: 2,
      units: 2,
      discount: 20,
      originalPrice: 48.00,
      discountedPrice: 18.00,
      isPopular: true  // Best value for money!
    },
    {
      id: 3,
      units: 2,
      discount: 30,
      originalPrice: 48.00,
      discountedPrice: 24.00,
      isPopular: false
    }
  ]
};

// DOM Elements - cache for better performance
const DOM = {
  optionBoxes: document.querySelectorAll('.option-box'),
  radioInputs: document.querySelectorAll('.radio-input'),
  totalAmount: document.getElementById('total-amount'),
  addToCartBtn: document.getElementById('add-to-cart')
};

// State management - keep track of user selection
let state = {
  selectedOption: 1  // Default to first option
};

// Utility functions - helper methods
const utils = {
  // Update the total amount displayed
  updateTotalAmount(optionId) {
    const option = PRODUCT_CONFIG.options.find(opt => opt.id === optionId);
    if (!option) return;
    DOM.totalAmount.textContent = `$${option.discountedPrice.toFixed(2)} USD`;
  },

  // Show success/error messages to user
  showMessage(message, type = 'success') {
    const messageEl = document.createElement('div');
    messageEl.className = 'success-message';
    if (type === 'error') messageEl.style.backgroundColor = '#EF4444';
    messageEl.textContent = message;
    document.body.appendChild(messageEl);
    setTimeout(() => messageEl.remove(), 3000);
  },

  // Get all selected items for the current option
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

// Event handlers - user interaction handlers
const handlers = {
  // Handle option box click
  handleOptionBoxClick(event) {
    try {
      const optionBox = event.currentTarget;
      const optionId = parseInt(optionBox.dataset.option);
      
      if (isNaN(optionId)) throw new Error('Invalid option ID');
      
      state.selectedOption = optionId;
      this.updateOptionSelection(optionId);
      utils.updateTotalAmount(optionId);
      
      // Update radio button state
      const radio = document.getElementById(`option${optionId}`);
      if (radio) {
        radio.checked = true;
      }
    } catch (error) {
      console.error('Option box click error:', error);
      utils.showMessage('Failed to process option selection', 'error');
    }
  },

  // Handle radio button change
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

  // Handle add to cart button click
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
      utils.showMessage('Added to cart successfully! 🎉');
    } catch (error) {
      console.error('Add to cart error:', error);
      utils.showMessage('Failed to add items to cart', 'error');
    }
  },

  // Update visual selection state
  updateOptionSelection(optionId) {
    DOM.optionBoxes.forEach(box => {
      const isSelected = parseInt(box.dataset.option) === optionId;
      box.classList.toggle('active', isSelected);
      box.style.transform = isSelected ? 'translateY(-2px)' : 'translateY(0)';
      box.style.boxShadow = isSelected ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none';
    });
  }
};

// Initialize the component when DOM is loaded
function init() {
  try {
    // Validate required DOM elements
    if (!DOM.optionBoxes.length || !DOM.radioInputs.length || !DOM.totalAmount || !DOM.addToCartBtn) {
      throw new Error('Required DOM elements not found');
    }

    // Set initial state
    DOM.optionBoxes[0].classList.add('active');
    document.getElementById('option1').checked = true;
    
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

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);