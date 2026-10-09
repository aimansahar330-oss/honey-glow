import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "kmcares_cart_v2";
const OLD_CART_STORAGE_KEY = "honeyglow_cart";

function normalizeProductType(type) {
  return type === "SIGNATURE"
    ? "SIGNATURE"
    : "REGULAR";
}

function createCartKey(id, productType) {
  return `${normalizeProductType(productType)}-${id}`;
}

function normalizeCartItem(item) {
  const productType =
    item.productType === "SIGNATURE" ||
    item.signatureProductId
      ? "SIGNATURE"
      : "REGULAR";

  return {
    ...item,
    productType,
    cartKey: createCartKey(
      item.id,
      productType
    ),
  };
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved =
        localStorage.getItem(
          CART_STORAGE_KEY
        );

      if (!saved) {
        return [];
      }

      const parsed =
        JSON.parse(saved);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .filter(
          (item) =>
            item &&
            Number.isInteger(
              Number(item.id)
            )
        )
        .map(normalizeCartItem);
    } catch {
      return [];
    }
  });

  /* REMOVE OLD HONEYGLOW CART */
  useEffect(() => {
    localStorage.removeItem(
      OLD_CART_STORAGE_KEY
    );
  }, []);

  /* SAVE CART */
  useEffect(() => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  /* ADD PRODUCT */
  const addToCart = (
    product,
    quantity = 1
  ) => {
    if (!product) {
      return;
    }

    const id =
      Number(product.id);

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      return;
    }

    const productType =
      normalizeProductType(
        product.productType
      );

    const cartKey =
      createCartKey(
        id,
        productType
      );

    const stock =
      Number(product.stock || 0);

    if (
      !Number.isFinite(stock) ||
      stock <= 0
    ) {
      return;
    }

    const requestedQuantity =
      Math.max(
        1,
        Number(quantity) || 1
      );

    setCartItems((current) => {
      const existing =
        current.find(
          (item) =>
            item.cartKey ===
            cartKey
        );

      if (existing) {
        return current.map(
          (item) => {
            if (
              item.cartKey !==
              cartKey
            ) {
              return item;
            }

            const nextQuantity =
              Number(
                item.quantity || 0
              ) +
              requestedQuantity;

            return {
              ...item,
              stock,
              quantity:
                Math.min(
                  nextQuantity,
                  stock
                ),
            };
          }
        );
      }

      return [
        ...current,
        {
          ...product,
          id,
          productType,
          cartKey,
          quantity:
            Math.min(
              requestedQuantity,
              stock
            ),
        },
      ];
    });
  };

  /* UPDATE QUANTITY */
  const updateQuantity = (
    productId,
    quantity,
    productType = "REGULAR"
  ) => {
    const id =
      Number(productId);

    if (
      !Number.isInteger(id)
    ) {
      return;
    }

    const normalizedType =
      normalizeProductType(
        productType
      );

    const cartKey =
      createCartKey(
        id,
        normalizedType
      );

    setCartItems((current) =>
      current.map((item) => {
        if (
          item.cartKey !== cartKey
        ) {
          return item;
        }

        const stock =
          Number(item.stock || 0);

        if (stock <= 0) {
          return item;
        }

        const safeQuantity =
          Math.max(
            1,
            Math.min(
              Number(quantity) || 1,
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
    productId,
    productType = "REGULAR"
  ) => {
    const id =
      Number(productId);

    if (
      !Number.isInteger(id)
    ) {
      return;
    }

    const normalizedType =
      normalizeProductType(
        productType
      );

    const cartKey =
      createCartKey(
        id,
        normalizedType
      );

    setCartItems((current) =>
      current.filter(
        (item) =>
          item.cartKey !== cartKey
      )
    );
  };

  /* CLEAR CART */
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(
      CART_STORAGE_KEY
    );
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

          const quantity =
            Number(
              item.quantity || 0
            );

          return (
            total +
            price * quantity
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