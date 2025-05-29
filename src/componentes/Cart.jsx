// Cart.jsx
export const Cart = ({ cart, removeFromCart }) => {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="cart">
      <h2>Carrito ({cart.length})</h2>
      {cart.map((item) => (
        <div key={item.id}>
          {item.name} - ${item.price}
          <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
        </div>
      ))}
      <h3>Total: ${total}</h3>
    </div>
  );
};