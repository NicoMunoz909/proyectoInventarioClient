import styles from './loadingSpinner.module.css';
import { ImSpinner9 } from "react-icons/im";

const LoadingSpinner = ( { style } ) => {
  return (
    <div style={style} className={styles.container}>
      <ImSpinner9 />
    </div>
  )
}

export default LoadingSpinner