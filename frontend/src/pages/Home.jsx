import ProductGrid from '../components/ProductGrid'
import Checkout from '../components/Checkout'
import OrderHistory from '../components/OrderHistory'
import Story from '../components/Story'

export default function Home() {
  return (
    <>
      <ProductGrid />
      <Story />
      <Checkout />
      <OrderHistory />
    </>
  )
}

