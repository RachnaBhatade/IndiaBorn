import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { orderApi, configApi } from '../services/api'
import { useCart } from '../hooks/useCart'
import Cart from './Cart'
import './Checkout.css'

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const { cart, clearCart, subtotal, taxes } = useCart()
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (cart.length === 0) {
      setMessage('Add at least one product to your bag.')
      return
    }
    if (!stripe || !elements) {
      setMessage('Stripe is not loaded.')
      return
    }

    setIsLoading(true)
    setMessage('Creating order...')

    const formData = new FormData(e.target)
    const payload = {
      email: formData.get('email'),
      fullName: formData.get('fullName'),
      phoneNumber: formData.get('phone'),
      whatsAppNumber: formData.get('whatsapp') ?? '',
      messengerId: formData.get('messenger') ?? '',
      shipping: {
        fullName: formData.get('fullName'),
        addressLine1: formData.get('address1'),
        addressLine2: formData.get('address2') ?? '',
        city: formData.get('city'),
        state: formData.get('state'),
        postalCode: formData.get('zip'),
        country: formData.get('country'),
        phoneNumber: formData.get('phone'),
      },
      items: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      shippingFee: 0,
      taxes: subtotal * 0.05,
    }

    try {
      const summary = await orderApi.create(payload)
      const cardElement = elements.getElement(CardElement)

      const payment = await stripe.confirmCardPayment(summary.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: payload.fullName,
            email: payload.email,
            phone: payload.phoneNumber,
          },
        },
      })

      if (payment.error) {
        setMessage(payment.error.message ?? 'Payment failed.')
        setIsLoading(false)
        return
      }

      await orderApi.confirm({
        orderId: summary.order.id,
        paymentIntentId: payment.paymentIntent.id,
      })

      setMessage('Order confirmed! Check your WhatsApp, Messenger, phone, and email for updates.')
      clearCart()
      e.target.reset()
    } catch (error) {
      console.error(error)
      setMessage('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form id="checkoutForm" onSubmit={handleSubmit}>
      <h3>Shipping & Contact</h3>
      <div className="grid">
        <label>
          Full name
          <input required name="fullName" />
        </label>
        <label>
          Email
          <input required type="email" name="email" />
        </label>
        <label>
          Phone
          <input required name="phone" />
        </label>
        <label>
          WhatsApp
          <input name="whatsapp" />
        </label>
        <label>
          Messenger ID
          <input name="messenger" />
        </label>
      </div>
      <div className="grid">
        <label>
          Address line 1
          <input required name="address1" />
        </label>
        <label>
          Address line 2
          <input name="address2" />
        </label>
        <label>
          City
          <input required name="city" />
        </label>
        <label>
          State
          <input required name="state" />
        </label>
        <label>
          Postal code
          <input required name="zip" />
        </label>
        <label>
          Country
          <input required name="country" defaultValue="India" />
        </label>
      </div>
      <div className="card-element">
        <label>Card details</label>
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      <button className="button" type="submit" disabled={isLoading || !stripe}>
        {isLoading ? 'Processing...' : 'Pay securely'}
      </button>
      <p id="checkoutMessage" className="feedback">{message}</p>
    </form>
  )
}

export default function Checkout() {
  const [stripePromise, setStripePromise] = useState(null)

  useEffect(() => {
    configApi.getStripe().then(config => {
      if (config.publishableKey) {
        setStripePromise(loadStripe(config.publishableKey))
      } else {
        setStripePromise(Promise.resolve(null))
      }
    })
  }, [])

  if (!stripePromise) {
    return (
      <section className="section" id="checkout">
        <div className="section__header">
          <h2>Effortless checkout</h2>
          <p>Loading payment configuration...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="section" id="checkout">
      <div className="section__header">
        <h2>Effortless checkout</h2>
        <p>
          Secure payments with Stripe, instant notifications via WhatsApp,
          Messenger, phone, and email.
        </p>
      </div>
      <div className="checkout">
        {stripePromise ? (
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        ) : (
          <div className="card-element">
            <p className="feedback">Stripe key missing. Ask admin to configure payments.</p>
          </div>
        )}
        <Cart />
      </div>
    </section>
  )
}

