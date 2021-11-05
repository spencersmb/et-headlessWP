import React, { ReactNode } from 'react'
import { Helmet } from 'react-helmet';
interface IProps {
  children: ReactNode
}
function Layout ({children}: IProps){
  const helmetSettings = {}
  return (
    <div>
      <Helmet {...helmetSettings} />
      <nav>Navigation</nav>
      <main>
        {children}
      </main>
      <footer>
        Create footer
      </footer>
    </div>
  )
}
