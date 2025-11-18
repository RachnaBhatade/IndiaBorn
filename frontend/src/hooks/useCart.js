import { useState, useEffect } from 'react'

const STORAGE_KEY = 'indiaborn-cart'

export function useCart() {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id)
      if (existing) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        price: product.salePrice ?? product.price,
        quantity: 1,
        image: product.images?.[0]?.url,
      }]
    })
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.productId !== productId))
  }

  const clearCart = () => {
    setCart([])
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const taxes = subtotal * 0.05
  const total = subtotal + taxes

  return {
    cart,
    cartCount,
    subtotal,
    taxes,
    total,
    addToCart,
    removeFromCart,
    clearCart,
  }
}

