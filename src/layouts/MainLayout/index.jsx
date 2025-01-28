import styles from './mainLayout.module.css'
import Sidebar from '../../components/Sidebar'

const MainLayout = ({children}) => {
  return (
    <div className={styles.container}>
      <aside> <Sidebar /> </aside>
      <main> {children} </main>
    </div>
  )
}

export default MainLayout