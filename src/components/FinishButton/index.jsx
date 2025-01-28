import styles from './finishButton.module.css'

const FinishButton = ( { disabled, onFinish } ) => {
  return (
    <div className={styles.container}>
      <button className={disabled ? styles.disabled: ""} disabled={disabled} onClick={onFinish}>finalizar</button>
    </div>
  )
}

export default FinishButton