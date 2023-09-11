import { Outlet } from 'react-router-dom'

import Footer from './footer'

const AppLayout = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-between">
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default AppLayout
