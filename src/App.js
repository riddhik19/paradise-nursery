import React, { useState } from 'react';
import { ShoppingCart, Leaf, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';

// Redux Store Implementation
const createStore = (reducer) => {
  let state;
  let listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };

  dispatch({ type: '@@INIT' });

  return { getState, dispatch, subscribe };
};

// Action Types
const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const INCREMENT_QUANTITY = 'INCREMENT_QUANTITY';
const DECREMENT_QUANTITY = 'DECREMENT_QUANTITY';
const DELETE_FROM_CART = 'DELETE_FROM_CART';

// Action Creators
const addToCart = (plant) => ({ type: ADD_TO_CART, payload: plant });
const removeFromCart = (plantId) => ({ type: REMOVE_FROM_CART, payload: plantId });
const incrementQuantity = (plantId) => ({ type: INCREMENT_QUANTITY, payload: plantId });
const decrementQuantity = (plantId) => ({ type: DECREMENT_QUANTITY, payload: plantId });
const deleteFromCart = (plantId) => ({ type: DELETE_FROM_CART, payload: plantId });

// Initial State
const initialState = {
  cart: [],
  addedItems: []
};

// Reducer
const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
        addedItems: [...state.addedItems, action.payload.id]
      };
    case INCREMENT_QUANTITY:
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      };
    case DECREMENT_QUANTITY:
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      };
    case DELETE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload),
        addedItems: state.addedItems.filter(id => id !== action.payload)
      };
    default:
      return state;
  }
};

// Create Store Instance
const store = createStore(cartReducer);

// Plant Data
const plantsData = [
  // Flowering Plants
  { id: 1, name: 'Peace Lily', category: 'Flowering Plants', price: 25, image: '🌸' },
  { id: 2, name: 'Orchid', category: 'Flowering Plants', price: 35, image: '🌺' },
  
  // Succulents
  { id: 3, name: 'Aloe Vera', category: 'Succulents', price: 15, image: '🌵' },
  { id: 4, name: 'Jade Plant', category: 'Succulents', price: 20, image: '🪴' },
  
  // Foliage Plants
  { id: 5, name: 'Monstera', category: 'Foliage Plants', price: 40, image: '🌿' },
  { id: 6, name: 'Snake Plant', category: 'Foliage Plants', price: 30, image: '🍃' }
];

// Landing Page Component
const LandingPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center text-white">
        <div className="mb-8">
          <Leaf className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-6xl font-bold mb-4">Paradise Nursery</h1>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
          <p className="text-xl leading-relaxed">
            Welcome to Paradise Nursery, where nature meets your home! We specialize in providing 
            high-quality houseplants that bring life, beauty, and fresh air to your living spaces. 
            With over 15 years of experience, we carefully curate each plant to ensure you receive 
            only the healthiest and most vibrant greenery. Whether you're a seasoned plant parent 
            or just beginning your journey, we have the perfect plants for you.
          </p>
        </div>
        
        <button
          onClick={() => onNavigate('products')}
          className="bg-white text-green-600 px-12 py-4 rounded-full text-xl font-semibold 
                   hover:bg-green-50 transition-all transform hover:scale-105 shadow-2xl"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

// Header Component
const Header = ({ cartCount, currentPage, onNavigate }) => {
  return (
    <header className="bg-green-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
          <Leaf className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Paradise Nursery</h1>
        </div>
        
        <nav className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('products')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentPage === 'products' ? 'bg-green-700' : 'hover:bg-green-500'
            }`}
          >
            Products
          </button>
          
          <button
            onClick={() => onNavigate('cart')}
            className="relative hover:bg-green-500 p-2 rounded-lg transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold 
                           rounded-full w-6 h-6 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

// Product Card Component
const ProductCard = ({ plant, onAddToCart, isAdded }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="bg-gradient-to-br from-green-100 to-green-200 p-8 flex items-center justify-center">
        <span className="text-7xl">{plant.image}</span>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{plant.name}</h3>
        <p className="text-sm text-gray-500 mb-3">{plant.category}</p>
        <p className="text-2xl font-bold text-green-600 mb-4">${plant.price}</p>
        
        <button
          onClick={() => onAddToCart(plant)}
          disabled={isAdded}
          className={`w-full py-2 rounded-lg font-semibold transition-all ${
            isAdded
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
          }`}
        >
          {isAdded ? 'Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

// Product Listing Page Component
const ProductListingPage = ({ addedItems, onAddToCart }) => {
  const categories = [...new Set(plantsData.map(p => p.category))];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Our Plants Collection</h2>
        
        {categories.map(category => (
          <div key={category} className="mb-12">
            <h3 className="text-2xl font-semibold text-green-700 mb-6 flex items-center gap-2">
              <Leaf className="w-6 h-6" />
              {category}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plantsData
                .filter(plant => plant.category === category)
                .map(plant => (
                  <ProductCard
                    key={plant.id}
                    plant={plant}
                    onAddToCart={onAddToCart}
                    isAdded={addedItems.includes(plant.id)}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Cart Item Component
const CartItem = ({ item, onIncrement, onDecrement, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4">
      <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-lg">
        <span className="text-4xl">{item.image}</span>
      </div>
      
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
        <p className="text-gray-600">${item.price} per plant</p>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          onClick={() => onDecrement(item.id)}
          className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        
        <span className="font-semibold text-lg w-8 text-center">{item.quantity}</span>
        
        <button
          onClick={() => onIncrement(item.id)}
          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => onDelete(item.id)}
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors ml-2"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="text-right">
        <p className="text-lg font-bold text-gray-800">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

// Shopping Cart Page Component
const ShoppingCartPage = ({ cart, onIncrement, onDecrement, onDelete, onNavigate }) => {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Shopping Cart</h2>
        
        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingCart className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <p className="text-xl text-gray-500 mb-6">Your cart is empty</p>
            <button
              onClick={() => onNavigate('products')}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold 
                       hover:bg-green-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="bg-green-50 rounded-lg p-4 mb-6 flex justify-between items-center">
              <div>
                <p className="text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-green-700">{totalItems}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Total Cost</p>
                <p className="text-3xl font-bold text-green-700">${totalCost.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrement={onIncrement}
                  onDecrement={onDecrement}
                  onDelete={onDelete}
                />
              ))}
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => onNavigate('products')}
                className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold 
                         hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Continue Shopping
              </button>
              
              <button
                onClick={() => alert('Coming Soon - Checkout feature will be available shortly!')}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold 
                         hover:bg-green-700 transition-colors"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [storeState, setStoreState] = useState(store.getState());

  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setStoreState(store.getState());
    });
    return unsubscribe;
  }, []);

  const handleAddToCart = (plant) => {
    store.dispatch(addToCart(plant));
  };

  const handleIncrement = (plantId) => {
    store.dispatch(incrementQuantity(plantId));
  };

  const handleDecrement = (plantId) => {
    store.dispatch(decrementQuantity(plantId));
  };

  const handleDelete = (plantId) => {
    store.dispatch(deleteFromCart(plantId));
  };

  const totalCartItems = storeState.cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen">
      {currentPage === 'landing' ? (
        <LandingPage onNavigate={setCurrentPage} />
      ) : (
        <>
          <Header
            cartCount={totalCartItems}
            currentPage={currentPage}
            onNavigate={setCurrentPage}
          />
          
          {currentPage === 'products' && (
            <ProductListingPage
              addedItems={storeState.addedItems}
              onAddToCart={handleAddToCart}
            />
          )}
          
          {currentPage === 'cart' && (
            <ShoppingCartPage
              cart={storeState.cart}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onDelete={handleDelete}
              onNavigate={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;