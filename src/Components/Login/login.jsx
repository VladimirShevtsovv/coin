import React, {useState} from 'react'
import styles from './login.module.css'
import {useNavigate} from "react-router-dom";


async function fetchToServ(loginValue, passwordValue, nav ,setErrorServ, setVisLoader) {
    try{
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                    login: loginValue,
                    password: passwordValue
                }
            )
        });
        const request = await response.json();
        console.log(request)
        if (request.payload !== null) {
            sessionStorage.setItem('isAuthorized', true)
            sessionStorage.setItem('authorizationToken', request.payload.token)
            sessionStorage.setItem('activeLink', 'Счета')
            console.log(request.payload.token, sessionStorage.getItem('isAuthorized'))
            nav('/accounts')
        } else {
            sessionStorage.setItem('isAuthorized', false)
            if(request.error==='No such user' || request.error==='Invalid password'){
                setErrorServ('Неверный логин или пароль')
            }else{
                setErrorServ(request.error)
            }
        }
    } catch(e){
        console.log(e)
        setErrorServ(e.message)
    }finally {
        setVisLoader(false)
    }


} // Функция запроса пользователя и если ответ положительный запоминает token и то, что пользователь вошел (true)

function validationInputs(value, setMessange, messange, event) {
    if (event === 'onChange') {
        if (value !== '' && messange !== 'Минимальная длина - 6 символов') {
            setMessange('')
        } else {
            if (messange === 'Минимальная длина - 6 символов' && value.length >= 6) {
                setMessange('')
            }
        }
    }
    if (event === 'onBlur') {
        if (value === '') {
            setMessange('Данное поле обязательно для заполнения')
        } else {
            if (value.length < 6) {
                setMessange('Минимальная длина - 6 символов')
            }
        }
    }
}

function validationOnClickButton (valuePassword, valueLogin , setErrorPassword, setErrorLogin){
    if(valuePassword===''){
        setErrorPassword('Данное поле обязательно для заполнения');
    }if(valueLogin===''){
        setErrorLogin('Данное поле обязательно для заполнения')
    }
}

function Login(props) {

    props.setActiveLink('')

    sessionStorage.setItem('isAuthorized', false)
    sessionStorage.setItem('authorizationToken', '')

    const [tempSearchLogin, setTempSearchLogin] = useState('');
    const [tempSearchPassword, setTempSearchPassword] = useState('');
    let navigate = useNavigate();
    const [errorMessangePassword, setErrorMessangePassword] = useState('');
    const [errorMessangeLogin, setErrorMessangeLogin] = useState('');
    const [errorMessangeServ, setErrorMessangeServ] = useState('');
    const [visibilityLoader, setVisibilityLoader] = useState(false);
    return (
        <div className={styles.login__container}>
            <form className={styles.login__form}>
                <h1 className={styles.login__form_Heading}>Вход в аккаунт</h1>
                <div className={styles.login__container_InputAndErro}>
                    <div className={styles.login__form_ContainerWithInputs}>
                        <label className={styles.login__form_lables}>Логин</label>
                        <input type={'text'} placeholder={'Логин'} value={tempSearchLogin}
                               onChange={(e) => {
                                   setTempSearchLogin(e.currentTarget.value)
                                   validationInputs(e.target.value, setErrorMessangeLogin, errorMessangeLogin, 'onChange')
                               }} onBlur={(e) => {
                            validationInputs(e.target.value, setErrorMessangeLogin, errorMessangeLogin, 'onBlur')
                        }} className={styles.login__form_Inputs}
                               style={errorMessangeLogin === '' ? {} : {borderColor: "#BA0000"}}/>
                    </div>
                    <label
                        className={errorMessangeLogin === '' ? `${styles.login__error_messange_hidden}` : `${styles.login__error_messange}`}>{errorMessangeLogin}</label>

                </div>


                <div className={styles.login__container_InputAndErro}>
                    <div>
                        <label className={styles.login__form_lables}>Пароль</label>
                        <input type={'password'} placeholder={'Пароль'} value={tempSearchPassword}
                               onChange={(e) => {
                                   setTempSearchPassword(e.currentTarget.value)
                                   validationInputs(e.target.value, setErrorMessangePassword, errorMessangePassword, 'onChange')
                               }} className={styles.login__form_Inputs}
                               onBlur={(e) => {
                                   validationInputs(e.target.value, setErrorMessangePassword, errorMessangePassword, 'onBlur')
                               }} style={errorMessangePassword === '' ? {} : {borderColor: "#BA0000"}}/>


                    </div>
                    <label
                        className={errorMessangePassword === '' ? `${styles.login__error_messange_hidden}` : `${styles.login__error_messange}`}>{errorMessangePassword}</label>
                </div>

                <div className={styles.login__form_ContainerWithButton}>

                    <button onClick={() => {

                        validationOnClickButton(tempSearchPassword, tempSearchLogin , setErrorMessangePassword, setErrorMessangeLogin)
                        if(errorMessangePassword==='' && errorMessangeLogin==='' && (tempSearchPassword!=='' && tempSearchLogin !=='')){
                            setVisibilityLoader(true)
                            fetchToServ(tempSearchLogin, tempSearchPassword, navigate, setErrorMessangeServ ,setVisibilityLoader)
                        }
                    }} type={'button'} className={styles.login__form_Button}
                   style={visibilityLoader === false ? {} : {color: 'rgba(255,255,255,0)', background:'#9CA3AF'}}
                    disabled={visibilityLoader === false ? '': 'disabled'}>
                        <div className={styles.loader}
                             style={visibilityLoader === false ? {display:'none'} : {display:'block'}}>Loading...</div>
                        Войти
                    </button>
                    <label
                        className={errorMessangeServ === '' ? `${styles.login__error_messange_hidden}` : `${styles.login__error_server}`}
                    >{errorMessangeServ}</label>
                </div>

            </form>
        </div>
    );
}

export default Login;
