import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div>
      <Header onSearch={setSearchQuery} />
      <main>
        <Outlet context={{ searchQuery }} />
      </main>
      <Footer />
    </div>
  )
}

