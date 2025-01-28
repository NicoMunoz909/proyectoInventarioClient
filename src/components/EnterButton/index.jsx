import styles from './enterButton.module.css'
import { FaArrowCircleRight } from "react-icons/fa";

const EnterButton = ( { onClick, isDisabled } ) => {
  return (
    <button type='submit' className={styles.container} onClick={onClick} disabled={isDisabled}>
      <FaArrowCircleRight />
    </button>
  )
}

export default EnterButton