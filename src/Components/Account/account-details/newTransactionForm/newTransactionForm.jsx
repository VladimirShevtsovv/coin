import React, {useState} from "react";
import style from './newTransactionForm.module.css'
import InputForNewTransaction from "./inputForNewTransactio/inputForNewTransaction";
import styles from "../../../Login/login.module.css";



export function validationInputs(value, setMessange, messange, event, amount) {
    console.log(value, amount)

    if (event === 'onChange') {
        if (value !== '') {
            setMessange('')
        }
        if (value[0] !== '-') {
            setMessange('')
        }
    }

    if (event === 'onBlur') {
        if (value === '' && amount !=='cur') {
            setMessange('Данное поле обязательно для заполнения')
        } else(
            setMessange('Заполните данное поле')
        )
        if (amount === 'amount') {
            if (value[0] === '-') {
                setMessange('Отрицательное число не допускается')
            }
        }
        if (value !== '' && value[0] !== '-') {
            setMessange('')
        }
        if(amount!=='cur'){
            if (isNaN(Number(value + 1))) {
                if (amount === 'amount' && value[0] !== '-') {
                    setMessange('Данное поле заполняется только цифрами')
                } else {
                    setMessange('Данное поле заполняется только цифрами')
                }

            }
        }

    }

}

//
function validationOnClickButton(valueAccountTo, valueAmount, setErrorAccountTo, setErrorAmount ) {
    if (valueAccountTo === '') {
        setErrorAccountTo('Данное поле обязательно для заполнения');
    }
    if (valueAmount === '') {
        setErrorAmount('Данное поле обязательно для заполнения')
    }
}


function NewTransactionForm(props) {
    console.log(props)

    console.log(JSON.parse(sessionStorage.getItem('arrayForAutocomplete')))
    const arrayForAutocomplete = JSON.parse(sessionStorage.getItem('arrayForAutocomplete'));

    const [tempNewTransactionNumber, setTempNewTransactionNumber] = useState('');
    const [tempNewTransactionCount, setTempNewTransactionCount] = useState('');
    console.log(tempNewTransactionNumber)


    const [errorMessangeAccountTo, setErrorMessangeAccountTo] = useState('');
    const [errorMessangeInputAmount, setErrorMessangeInputAmount] = useState('');
    const [errorMessangeServ, setErrorMessangeServ] = useState('');
    const [visibilityLoader, setVisibilityLoader] = useState(false);


    // 61253747452820828268825011
    // 05168707632801844723808510
    // 17307867273606026235887604
    // 27120208050464008002528428
    // 2222400070000005
    // 5555341244441115

    async function createNewTransaction(setDetails, infoToServ) {
        try {
            const response = await fetch('http://localhost:3000/transfer-funds', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    authorization: `Basic ${sessionStorage.getItem('authorizationToken')}`,
                },
                body: JSON.stringify(infoToServ)
            });
            const request = await response.json();
            console.log(request)

            if (request.error === '') {
                setDetails(request.payload)
                setErrorMessangeServ('')
                if (!arrayForAutocomplete.includes(infoToServ.to)) {
                    arrayForAutocomplete.push(infoToServ.to)
                    sessionStorage.setItem('arrayForAutocomplete', JSON.stringify(arrayForAutocomplete))
                }
            } else {
                if (request.error === 'Overdraft prevented') {
                    setErrorMessangeInputAmount('Недостаточно средств для перевода')
                }
                if (request.error === 'Invalid account to') {
                    setErrorMessangeAccountTo('Указан несущесвующий счет для перевода')
                } else{
                    setErrorMessangeServ(request.error)
                }
            }
        } catch (e) {
            setErrorMessangeServ(e.message)
        }finally {
            setVisibilityLoader(false)
        }

    }

    return (
        <form className={style.newTransaction__container}>
            <h3 className={style.newTransaction__heading}>Новый перевод</h3>
            <div className={style.newTransaction__containerLableAndInput}>
                <label className={style.newTransaction__lables}>Номер счёта получателя</label>
                <InputForNewTransaction setTempNewTransactionNumber={setTempNewTransactionNumber}
                                        tempNewTransactionNumber={tempNewTransactionNumber}
                                        validationInputs={validationInputs}
                                        errorMessangeAccountTo={errorMessangeAccountTo}
                                        setErrorMessangeAccountTo={setErrorMessangeAccountTo}

                />
            </div>
            <div className={style.newTransaction__container_InputAndErro}>
                <div className={style.newTransaction__containerLableAndInput}>
                    <label className={style.newTransaction__lables}>
                        Сумма перевода
                    </label>
                    <input type={'text'} className={style.newTransaction__input}
                           value={tempNewTransactionCount}
                           onChange={(e) => {
                               setTempNewTransactionCount(e.target.value)
                               validationInputs(e.target.value, setErrorMessangeInputAmount, errorMessangeInputAmount, 'onChange')
                           }}
                           onBlur={(e) => {
                               validationInputs(e.target.value, setErrorMessangeInputAmount, errorMessangeInputAmount, 'onBlur', 'amount')
                           }}
                           style={errorMessangeInputAmount === '' ? {} : {borderColor: "#BA0000"}}/>
                </div>
                <label
                    className={errorMessangeInputAmount === '' ? `${style.newTransaction__error_messange_hidden}` : `${style.newTransaction__error_messange}`}
                >{errorMessangeInputAmount}
                </label>
            </div>

            <div className={style.newTransaction__button_container}>
                <button type={'button'} className={style.newTransaction__button}
                        onClick={(e) => {
                            validationOnClickButton(tempNewTransactionNumber, tempNewTransactionCount, setErrorMessangeAccountTo, setErrorMessangeInputAmount)
                            if (errorMessangeAccountTo === '' && errorMessangeInputAmount === '' && (tempNewTransactionNumber !== '' && tempNewTransactionCount !== '')) {
                                setVisibilityLoader(true)
                                const infoToServ = {
                                    from: `${sessionStorage.getItem('detailsId')}`, // счёт с которого списываются средства
                                    to: tempNewTransactionNumber,  // счёт, на который зачисляются средства
                                    amount: tempNewTransactionCount,  // сумма для перевод
                                }
                                console.log(infoToServ)
                                createNewTransaction(props.setDetailsInfoObj, infoToServ)

                            }

                        }} style={visibilityLoader === false ? {} : {color: 'rgba(255,255,255,0)', background:'#9CA3AF'}}
                        disabled={visibilityLoader === false ? '': 'disabled'}>
                    <div className={styles.loader}
                         style={visibilityLoader === false ? {display:'none'} : {display:'block'}}>Loading...</div>Отправить
                </button>
                <label
                    className={errorMessangeServ === '' ? `${style.newTransaction__error_messange_hidden}` : `${style.newTransaction__error_server}`}
                >{errorMessangeServ}</label>
            </div>

        </form>
    );
}

export default NewTransactionForm;