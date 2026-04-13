import React from "react";
import { product } from "../global-data/booking";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "./redux/actions/cartActions";

function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const handleAdd = (item) => {
    dispatch(addToCart(item));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const getItemCount = (id) => {
    const foundItem = cartItems.find((item) => item.id === id);
    return foundItem ? foundItem.quantity : 0;
  };

  console.log("cartItems", cartItems);
  return (
    <div className="row">
      <div className="row col-md-6">
        {product.map((item, index) => (
          <div className="col-md-4" key={index}>
            <div
              style={{
                width: "150px",
                height: "150px",
                border: "1px solid #d5d5d5",
                marginBottom: "10px",
                backgroundColor: "white",
                borderTopRightRadius: "10px",
                borderTopLeftRadius: "10px",
              }}
            >
              <img
                src="https://img.freepik.com/free-photo/grilled-gourmet-burger-with-cheese-tomato-onion-french-fries-generated-by-artificial-intelligence_25030-63181.jpg"
                alt="..."
                style={{
                  width: "100%",
                  borderTopRightRadius: "10px",
                  borderTopLeftRadius: "10px",
                }}
              />
              <div
                className="p-2 d-flex"
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "15px",
                      fontFamily: "monospace",
                      fontWeight: "600",
                    }}
                  >
                    {item.name}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontFamily: "monospace",
                      fontWeight: "600",
                    }}
                  >
                    ₹{item.price}
                  </div>
                </div>
                <div>
                  {getItemCount(item.id) > 0 ? (
                    <div className="d-flex">
                      <div>
                        <button
                          style={{
                            borderWidth: 0,
                            backgroundColor: "#63ebd8",
                            borderRadius: "5px",
                            fontSize: "15px",
                            fontFamily: "monospace",
                          }}
                          onClick={() => handleRemove(item.id)}
                        >
                          -
                        </button>
                      </div>
                      <div
                        style={{
                          fontSize: "15px",
                          fontFamily: "monospace",
                          margin: "3px",
                        }}
                      >
                        {" "}
                        {getItemCount(item.id)}{" "}
                      </div>
                      <div>
                        <button
                          style={{
                            borderWidth: 0,
                            backgroundColor: "#63ebd8",
                            borderRadius: "5px",
                            fontSize: "15px",
                            fontFamily: "monospace",
                          }}
                          onClick={() => handleAdd(item)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      style={{
                        borderWidth: 0,
                        backgroundColor: "#63ebd8",
                        borderRadius: "5px",
                        fontSize: "15px",
                        fontFamily: "monospace",
                      }}
                      onClick={() => handleAdd(item)}
                    >
                      +Add
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="col-md-4">
        <div className="card">
          <div className="card-header">
            <h3>Cart Items</h3>
            <small className="text-muted">
              Subtotal:
              {/* {cartTotal} */}
            </small>
            <div className="card-body">
              {cartItems.map((item, index) => (
                <div key={index}>
                  <div>{item.name}</div>
                  <div>₹{item.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
