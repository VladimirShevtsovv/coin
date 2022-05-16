import React, {useEffect, useState} from "react";

import style from './ratesChanging.module.css'


function RatesChanging(props) {

    let listWithChangeRate = [];
    let infoOfCurrencyRates = JSON.parse(sessionStorage.getItem('arrayYourCurrenciesInfo'))
    console.log(infoOfCurrencyRates)
    const [arrayWithChangeRate, setArrayWithChangeRate] = useState([])
    const [varribleForRebootPage, setVarribleForRebootPage] = useState('')

    if (props.selectedCurrencyLeft !== '' && props.selectedCurrencyRight !== '') {
        console.log(props.selectedCurrencyLeft, props.selectedCurrencyRight)
        let searchPair = `${props.selectedCurrencyLeft} / ${props.selectedCurrencyRight}`
        for (let i = 0; i < infoOfCurrencyRates.length; i++) {
            if (infoOfCurrencyRates[i].pairName === searchPair) {
                console.log(infoOfCurrencyRates[i])
                if (infoOfCurrencyRates[i].arrayForChangeRatio.length === 0) {
                    listWithChangeRate.push(infoOfCurrencyRates[i])
                    console.log(listWithChangeRate)
                    break
                } else {
                    let obj ={}
                    for (let j = 0; j < infoOfCurrencyRates[i].arrayForChangeRatio.length; j++) {
                        let obj ={};
                        obj[`pairName`] = infoOfCurrencyRates[i].pairName;
                        obj['ratio'] = infoOfCurrencyRates[i].arrayForChangeRatio[j].rate;
                        obj['change'] = infoOfCurrencyRates[i].arrayForChangeRatio[j].change;
                        listWithChangeRate.push(obj)


                    }
                }
            }
        }
    }


    props.socket.onmessage = function (event) {
        console.log(`[message] Данные получены с сервера:`);
        console.log(event.data)
        let objWithInfoAboutNewChangeRate = JSON.parse(event.data)
        console.log(objWithInfoAboutNewChangeRate)
        // {"type":"EXCHANGE_RATE_CHANGE","from":"NZD","to":"UAH","rate":5.49,"change":-1}
        for (let i = 0; i < infoOfCurrencyRates.length; i++) {
            if (infoOfCurrencyRates[i].pairName === `${objWithInfoAboutNewChangeRate.from} / ${objWithInfoAboutNewChangeRate.to}`) {
                infoOfCurrencyRates[i].arrayForChangeRatio.push({rate:objWithInfoAboutNewChangeRate.rate,change:objWithInfoAboutNewChangeRate.change});
                console.log(infoOfCurrencyRates[i])
                sessionStorage.setItem('arrayYourCurrenciesInfo', JSON.stringify(infoOfCurrencyRates))
                break
            }
        }

        setVarribleForRebootPage(1)

    }

    useEffect(()=>{

    }, [varribleForRebootPage])



    listWithChangeRate = listWithChangeRate.map(item => {
        console.log(item)
        let borderColorStyle = {};
        if (item.change){
            if(item.change === 1){
                borderColorStyle = {borderColor : '#76CA66'}
            } else {
                borderColorStyle = {borderColor : '#FD4E5D'}
            }
        }
        return <li className={style.rates__list_item}>
            <div className={style.rates__nameOfChangedCurrensies}>{item.pairName}</div>
            <div className={style.rates__list_itemDashed} style={borderColorStyle}></div>
            <div className={style.rates__rateOfCurrencyChange}>{item.defoltRatio ? `${item.defoltRatio}`:`${item.ratio}`}</div>

            {item.change ? <div>{item.change === 1 ?
                <svg width="20" height="10" viewBox="0 0 20 10" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 10L10 0L0 10L20 10Z" fill="#76CA66"/>
                </svg>
                : <svg width="20" height="10" viewBox="0 0 20 10" fill="none"
                       xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0L10 10L20 0H0Z" fill="#FD4E5D"/>
                </svg>}</div> : ''}

        </li>
    })


    return (
        <div className={style.rates__container}>
            <h2 className={style.rates__heading}>Изменение курсов в реальном времени</h2>
            {(props.selectedCurrencyLeft !== '' && props.selectedCurrencyRight !== '') ?  <ul className={style.rates__list}>
                {listWithChangeRate}
            </ul>:`Выберите валюты для отображения курса`}

        </div>
    );
}

export default RatesChanging;