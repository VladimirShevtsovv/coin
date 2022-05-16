import React, {useEffect, useState} from "react";

import styles from './Currencies.module.css'
import YourCurrencies from "./ yourСurrencies/yourСurrencies";
import ExchangeCurrencyForm from "./ exchangeCurrency/exchangeCurrency";
import RatesChanging from "./ ratesChanging/ratesChanging";
import ErrorOnLoadPage from "../errorOnDowlandPage/errorOnLoadPage";
import style from './../Account/account.module.css'
import axios from "axios";
import styless from './ yourСurrencies/yourСurrencies.module.css'
function Currencies(props) {

    props.setActiveLink('Валюта')

    let socket = new WebSocket('ws://localhost:3000/currency-feed');
    const [selectedCurrencyLeft, setSelectedCurrencyLeft] = useState('')
    const [selectedCurrencyRight, setSelectedCurrencyRight] = useState('')
    let [arrayYourCurrencies, setArrayYourCurrencies] = useState([])



    const [visibilityLoaderPage, setVisibilityLoaderPage] = useState(true);// Лоадер при загузке старницы
    const [serverError, setServerError] = useState('');// Ошибка если страница не загрузилась
    const [addedAccounts, setAddedAccouts] = useState([]); // Добавляемый аккаунт для перерисовки компонента



    useEffect(() => {
        axios.get('http://localhost:3000/currencies', {
            headers: {
                authorization: `Basic ${sessionStorage.getItem('authorizationToken')}`,
                'Content-Type': 'application/json;charset=utf-8'
            },
        }).then(res => {
            console.log(res)
            if (res.data.error === '') {
                let arrayWirhInfoOfCurrensies = [];

                let array = Object.values(res.data.payload);
                for (let i = 0; i < array.length; i++) {
                    for (let j = 0; j < array.length; j++) {
                        if (!arrayWirhInfoOfCurrensies.includes(`${array[i].code} / ${array[j].code}`) && array[i].code !== array[j].code) {
                            let obj = {};
                            obj[`pairName`] = `${array[i].code} / ${array[j].code}`;
                            obj[`defoltRatio`] = (array[i].amount / array[j].amount).toFixed(10);
                            obj['arrayForChangeRatio'] = [];
                            arrayWirhInfoOfCurrensies.push(obj)
                        }
                    }
                }
                let arrayToSessionStorage = [];
                for (let i = 0; i < array.length; i++) {
                    arrayToSessionStorage.push(array[i].code)
                }
                console.log(arrayToSessionStorage)
                sessionStorage.setItem('yourCurrensies', JSON.stringify(arrayToSessionStorage))
                if (!sessionStorage.getItem('arrayYourCurrenciesInfo')) {
                    sessionStorage.setItem('arrayYourCurrenciesInfo', JSON.stringify(arrayWirhInfoOfCurrensies))
                }

                setArrayYourCurrencies(Object.values(res.data.payload).map(item => {
                        return <li className={styless.yourCurrencies__list_item}>
                            <div className={styless.yourCurrencies__nameOfCurrency}>{item.code}</div>
                            <div className={styless.yourCurrencies__borderBottomDashed}></div>
                            <div className={styless.yourCurrencies__valueOfCurrency}>{(item.amount).toFixed(4)}</div>
                        </li>
                    })
                )

            } else {

                setServerError(res.data.error)
            }
            setVisibilityLoaderPage(false)
        }).catch(e => {
            setVisibilityLoaderPage(false)
            setServerError(e.message)
        })

    }, [addedAccounts])


    return (
        <div>
            {visibilityLoaderPage === true ? <div className={style.loader}
                                                  style={visibilityLoaderPage === true ? {display: 'block'} : {display: 'none'}}></div> :
                <div>
                   <ErrorOnLoadPage serverError={serverError} setAddedAccouts={setAddedAccouts}
                    setVisibilityLoaderPage={setVisibilityLoaderPage}/>
                    <div className={styles.currencies__container} style={serverError !== '' ? {display: 'none'} : {display: 'flex'}}>
                    <h1 className={styles.currencies__heading}>Валютный обмен</h1>

                    <div className={styles.currencies__container_main}>
                        <div className={styles.currencies__container_left}>
                            <YourCurrencies arrayYourCurrencies={arrayYourCurrencies}
                                            />
                            <ExchangeCurrencyForm selectedCurrencyLeft={selectedCurrencyLeft}
                                                  setSelectedCurrencyLeft={setSelectedCurrencyLeft}
                                                  selectedCurrencyRight={selectedCurrencyRight}
                                                  setSelectedCurrencyRight={setSelectedCurrencyRight}
                                                  setArrayYourCurrencies={setArrayYourCurrencies}/>
                        </div>
                        <RatesChanging
                            socket={socket}
                            selectedCurrencyLeft={selectedCurrencyLeft} selectedCurrencyRight={selectedCurrencyRight}
                        />
                    </div>

                </div></div>
                }
        </div>


    );
}

export default Currencies;
