import React, {useState} from "react";
import style from './exchangeCurrency.module.css'
import DropDownMenuCurensies from "./dropDown/dropDown";
import {validationInputs} from '../../Account/account-details/newTransactionForm/newTransactionForm'
import styles from "../../Login/login.module.css";


function validationOnClickButton(valueCurrencyFrom, valueCurrenсyTo, valueAmount, setErrorCurrencyFrom, setErrorCurrencyTo, setErrorAmount) {
    if (valueCurrencyFrom === '') {
        setErrorCurrencyFrom('Заполните данное поле');
    }
    if (valueCurrenсyTo === '') {
        setErrorCurrencyTo('Заполните данное поле');
    }
    if (valueAmount === '') {
        setErrorAmount('Данное поле обязательно для заполнения')
    }
}

function ExchangeCurrencyForm(props) {

    const [inputAmountValue, setInputAmountValue] = useState('')
    const [visibilityDropDownLeft, setVisibilityDropDownLeft] = useState(false)
    const [visibilityDropDownRight, setVisibilityDropDownRight] = useState(false)


    const [errorMessangeCurrensyFrom, setErrorMessangeCurrensyFrom] = useState('');
    const [errorMessangeCurrensyTo, setErrorMessangeCurrensyTo] = useState('');
    const [errorMessangeInputAmount, setErrorMessangeInputAmount] = useState('');
    const [errorMessangeServ, setErrorMessangeServ] = useState('');


    const [visibilityLoader, setVisibilityLoader] = useState(false);


    async function currencyBuy() {
        try {
            const objInfo = {
                from: props.selectedCurrencyLeft, // код валютного счёта, с которого списываются средства
                to: props.selectedCurrencyRight,// код валютного счёта, на который зачисляются средства
                amount: inputAmountValue,
            }
            console.log(objInfo)

            const response = await fetch('http://localhost:3000/currency-buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    authorization: `Basic ${sessionStorage.getItem('authorizationToken')}`,
                },
                body: JSON.stringify(objInfo)
            });
            const request = await response.json();
            console.log(request)
            if (request.error === '') {
                props.setArrayYourCurrencies(Object.values(request.payload).map(item => {
                        return <li className={style.exchangeCurrency__list_item}>
                            <div className={style.exchangeCurrency__nameOfCurrency}>{item.code}</div>
                            <div className={style.exchangeCurrency__borderBottomDashed}></div>
                            <div className={style.exchangeCurrency__valueOfCurrency}>{(item.amount).toFixed(4)}</div>
                        </li>
                    })
                )
            } else {
                if (request.error === 'Not enough currency' || request.error === 'Overdraft prevented') {
                    setErrorMessangeServ('Недостаточно средств')
                }
            }
        } catch (e) {
            setErrorMessangeServ(e.message)
        } finally {
            setVisibilityLoader(false)
        }


    } // Функция запроса пользователя и если ответ положительный запоминает token и то, что пользователь вошел (true)


    return (
        <div className={style.exchangeCurrency__container}>
            <h2 className={style.exchangeCurrency__heading}>Обмен валюты</h2>
            <form className={style.exchangeCurrency__form}>

                <div className={style.exchangeCurrency__form_leftContainer}>
                    <div className={style.exchangeCurrency__form_leftContainer_item}>
                        <div className={style.exchangeCurrency__form_leftContainer_item_nameCurency}>
                            <label className={style.exchangeCurrency__lables}>Из</label>
                            <div style={{position: 'relative'}}>
                                <input className={style.exchangeCurrency__inputsNameCurrensie}
                                       value={props.selectedCurrencyLeft}
                                       onFocus={() => {
                                           setVisibilityDropDownLeft(true)
                                       }}
                                       onBlur={(e) => {
                                           validationInputs(e.target.value, setErrorMessangeCurrensyFrom, errorMessangeCurrensyFrom, 'onBlur', 'cur')
                                           setTimeout(setVisibilityDropDownLeft, 100, false)
                                       }}
                                       style={errorMessangeCurrensyFrom === '' ? {} : {borderColor: "#BA0000"}}/>
                                <DropDownMenuCurensies visibility={visibilityDropDownLeft}
                                                       setSelectedCurrenсy={props.setSelectedCurrencyLeft}
                                                       selectedCurrencyRight={props.selectedCurrencyRight}
                                                       selectedCurrencyLeft={props.selectedCurrencyLeft}
                                                       setErrorMessangeCurrensy={setErrorMessangeCurrensyFrom}

                                />
                                <label
                                    className={errorMessangeCurrensyFrom === '' ? `${style.exchangeCurrency__error_messange_hidden}` : `${style.exchangeCurrency__error_messange}`}
                                    style={{right: '20px'}}
                                >{errorMessangeCurrensyFrom}
                                </label>
                            </div>
                        </div>
                        <div className={style.exchangeCurrency__form_leftContainer_item_nameCurency}>
                            <label className={style.exchangeCurrency__lables}>в</label>
                            <div style={{position: 'relative'}}>
                                <input className={style.exchangeCurrency__inputsNameCurrensie}
                                       value={props.selectedCurrencyRight}
                                       onFocus={() => {
                                           setVisibilityDropDownRight(true)
                                       }}
                                       onBlur={(e) => {
                                           validationInputs(e.target.value, setErrorMessangeCurrensyTo, errorMessangeCurrensyTo, 'onBlur', 'cur')
                                           setTimeout(setVisibilityDropDownRight, 100, false)
                                       }} style={errorMessangeCurrensyTo === '' ? {marginRight: 0} : {
                                    borderColor: "#BA0000",
                                    marginRight: 0
                                }}/>
                                <DropDownMenuCurensies visibility={visibilityDropDownRight}
                                                       setSelectedCurrenсy={props.setSelectedCurrencyRight}
                                                       selectedCurrencyLeft={props.selectedCurrencyLeft}
                                                       selectedCurrencyRight={props.selectedCurrencyRight}
                                                       setErrorMessangeCurrensy={setErrorMessangeCurrensyTo}
                                />
                                <label
                                    className={errorMessangeCurrensyTo === '' ? `${style.exchangeCurrency__error_messange_hidden}` : `${style.exchangeCurrency__error_messange}`}
                                >{errorMessangeCurrensyTo}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className={style.exchangeCurrency__container_InputAndErro}>
                        <div className={style.exchangeCurrency__form_leftContainer_item}>
                            <label className={style.exchangeCurrency__lables}>Сумма</label>
                            <input value={inputAmountValue} onChange={(e) => {
                                setInputAmountValue(e.target.value)
                                validationInputs(e.target.value, setErrorMessangeInputAmount, errorMessangeInputAmount, 'onChange', 'amount')
                            }} onBlur={(e) => {
                                validationInputs(e.target.value, setErrorMessangeInputAmount, errorMessangeInputAmount, 'onBlur', 'amount')
                                console.log(errorMessangeInputAmount)
                            }}
                                   className={style.exchangeCurrency__inputAmount}
                                   style={errorMessangeInputAmount === '' ? {} : {borderColor: "#BA0000"}}/>

                        </div>
                        <label
                            className={errorMessangeInputAmount === '' ? `${style.exchangeCurrency__error_messange_hidden}` :
                                `${style.exchangeCurrency__error_messange_inputAmount}`} style={{right: 0}}
                        >{errorMessangeInputAmount}
                        </label>
                    </div>

                </div>
                <div className={style.exchangeCurrency__containerButtonAndError}>
                    <label
                        className={errorMessangeServ === '' ? `${style.exchangeCurrency__error_messange_hidden}` : `${style.exchangeCurrency__error_messange_button}`}
                    >{errorMessangeServ}
                    </label>
                    <button type={'button'} className={style.exchangeCurrency__button} onClick={() => {
                        validationOnClickButton(props.selectedCurrencyLeft, props.selectedCurrencyRight, inputAmountValue, setErrorMessangeCurrensyFrom, setErrorMessangeCurrensyTo, setErrorMessangeInputAmount)
                        if (inputAmountValue !== '' && props.selectedCurrencyLeft !== '' && props.selectedCurrencyRight !== ''
                            && errorMessangeCurrensyFrom === '' && errorMessangeCurrensyTo === '' && errorMessangeInputAmount === '') {
                            setVisibilityLoader(true)
                            currencyBuy()
                        }

                    }}
                            style={visibilityLoader === false ? {} : {
                                color: 'rgba(255,255,255,0)',
                                background: '#9CA3AF'
                            }}
                            disabled={visibilityLoader === false ? '' : 'disabled'}>
                        <div className={styles.loader}
                             style={visibilityLoader === false ? {display: 'none'} : {display: 'block'}}>Loading...
                        </div>
                        Обменять
                    </button>
                </div>


            </form>
        </div>
    );
}

export default ExchangeCurrencyForm;