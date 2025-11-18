import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import './Header.css'

export default function Header({ onSearch }) {
  const { cartCount } = useCart()
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchValue)
    }
    // Scroll to products section
    const productsSection = document.getElementById('collections')
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="nav nav--stacked">
      <div className="nav__top">
        <button className="icon-button" aria-label="Open menu">
          <span className="icon-button__bar"></span>
          <span className="icon-button__bar"></span>
          <span className="icon-button__bar"></span>
        </button>
        <Link to="/" className="nav__logo" style={{ textDecoration: 'none', color: 'inherit' }}>
          <img src="/assets/brand-logo.jpeg" alt="Indiaborn logo" />
          <div>
            <strong>Indiaborn™</strong>
          </div>
        </Link>
        <div className="nav__icons">
          <a className="nav__link" href="#order-history">Sign in ›</a>
          <button
            className="icon-button icon-button--cart"
            aria-label="View cart"
            onClick={() => {
              const checkoutSection = document.getElementById('checkout')
              if (checkoutSection) {
                checkoutSection.scrollIntoView({ behavior: 'smooth' })
              }
            }}
          >
            <span className="icon-cart"></span>
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
        </div>
      </div>

      <form className="nav__search" role="search" onSubmit={handleSearch}>
        <input
          id="searchInput"
          name="search"
          placeholder="Search Indiaborn™"
          aria-label="Search products"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value)
            if (onSearch) {
              onSearch(e.target.value)
            }
          }}
        />
        <button type="submit" aria-label="Search">
          <span className="icon-search"></span>
        </button>
      </form>

      <div className="nav__subnav">
        <span>Shop by</span>
        <nav>
          <a href="#collections">Category</a>
          <a href="#collections">Deals</a>
          <Link to="/admin">Sell</Link>
          <a href="#story">Story</a>
          <a href="#order-history">Order History</a>
        </nav>
      </div>

      <div className="nav__location">
        <span>Delivering pan-India from Pimple Gurav, Pune</span>
        <button type="button">Check pin code</button>
      </div>
    </header>
  )
}

