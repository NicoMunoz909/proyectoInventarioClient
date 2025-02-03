import { useState } from "react";
import Input from "../../components/Input";
import LoadingSpinner from "../../components/LoadingSpinner"
import styles from "./loginPage.module.css"
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useAlert } from '../../contexts/AlertContext';

const LoginPage = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  })
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({...inputs, [name]: value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    const response = await authService.login(inputs);
    if (response.status === 'OK') {
      navigate("/inventario");
    } else {
      showAlert(response.message, 'error');
    }
    setIsLoading(false);
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <Input inputStyle={{width: "300px"}} label="Email" id="input-email" name="username" required={true} onChange={(e) => handleInputChange(e)} />
        <Input inputStyle={{width: "300px"}} label="Password" id="input-password" name="password" type="password" required={true} onChange={(e) => handleInputChange(e)} />
        { isLoading ? <LoadingSpinner /> : <button type="submit" disabled={isLoading}>INGRESAR</button>}
      </form>
    </div>
  )
}

export default LoginPage