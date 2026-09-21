import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved =
        localStorage.getItem("honeyglow_cart");

      return saved
        ? JSON.parse(saved)
        : [];
    } catch {
      return [];
    }
  });

  /* SAVE CART */
  useEffect(() => {
    localStorage.setItem(
      "honeyglow_cart",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  /* ADD PRODUCT */
  const addToCart = (
    product,
    quantity = 1
  ) => {
    if (!product) return;

    setCartItems((current) => {
      const existing =
        current.find(
          (item) =>
            item.id === product.id
        );

      if (existing) {
        return current.map((item) => {
          if (
            item.id !== product.id
          ) {
            return item;
          }

          const nextQuantity =
            item.quantity + quantity;

          const safeQuantity =
            Math.min(
              nextQuantity,
              Number(
                product.stock || 0
              )
            );

          return {
            ...item,
            quantity:
              safeQuantity,
          };
        });
      }

      return [
        ...current,
        {
          ...product,
          quantity: Math.min(
            quantity,
            Number(
              product.stock || 0
            )
          ),
        },
      ];
    });
  };

  /* UPDATE QUANTITY */
  const updateQuantity = (
    productId,
    quantity
  ) => {
    setCartItems((current) =>
      current.map((item) => {
        if (
          item.id !== productId
        ) {
          return item;
        }

        const stock =
          Number(item.stock || 0);

        const safeQuantity =
          Math.max(
            1,
            Math.min(
              Number(quantity),
              stock
            )
          );

        return {
          ...item,
          quantity:
            safeQuantity,
        };
      })
    );
  };

  /* REMOVE PRODUCT */
  const removeFromCart = (
    productId
  ) => {
    setCartItems((current) =>
      current.filter(
        (item) =>
          item.id !== productId
      )
    );
  };

  /* CLEAR CART */
  const clearCart = () => {
    setCartItems([]);
  };

  /* TOTAL ITEM COUNT */
  const itemCount =
    useMemo(() => {
      return cartItems.reduce(
        (total, item) =>
          total +
          Number(
            item.quantity || 0
          ),
        0
      );
    }, [cartItems]);

  /* SUBTOTAL */
  const subtotal =
    useMemo(() => {
      return cartItems.reduce(
        (total, item) => {
          const price =
            Number(
              item.discountPrice ??
                item.originalPrice
            ) || 0;

          return (
            total +
            price *
              Number(
                item.quantity || 0
              )
          );
        },
        0
      );
    }, [cartItems]);

  const value = {
    cartItems,
    itemCount,
    subtotal,

    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}