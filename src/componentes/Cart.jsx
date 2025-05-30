export const Cart = ({ cart, removeFromCart }) => {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="cart-dropdown-content">
      <h3>Carrito ({cart.length})</h3>
      {cart.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <span>{item.name} - ${item.price}</span>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="remove-btn"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <strong>Total: ${total.toFixed(2)}</strong>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;