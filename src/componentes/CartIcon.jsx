import { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import './CartIcon.css'; // Asegúrate de tener un archivo CSS para estilos
import Cart from './Cart';

const CartIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState([]); // Estado del carrito

  const toggleCart = () => setIsOpen(!isOpen);
  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

  return (
    <div className="cart-icon-container">
      <div className="cart-icon" onClick={toggleCart}>
        <FaShoppingCart />
        {cart.length > 0 && (
          <span className="cart-count">{cart.length}</span>
        )}
      </div>
      
      {isOpen && (
        <div className="cart-dropdown">
          <Cart cart={cart} removeFromCart={removeFromCart} />
        </div>
      )}
    </div>
  );
};

export default CartIcon;