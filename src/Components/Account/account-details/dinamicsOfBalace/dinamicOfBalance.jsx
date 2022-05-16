import React from "react";

import style from './dinamicOfBalance.module.css'
import {NavLink} from "react-router-dom";


function createInfoArray(mounth, year, value, deffoltArrayWithInfo, arrayForSort, balance, account) {
    for (let i = 0; i < deffoltArrayWithInfo.transactions.length; i++) {
        if (mounth <= value) {
            if (Number(deffoltArrayWithInfo.transactions[i].date.slice(0, 4)) === year) {
                for (let j = 0; j < arrayForSort.length; j++) {
                    if (Number(deffoltArrayWithInfo.transactions[i].date.slice(5, 7)) === arrayForSort[j].mounthid) {
                        arrayForSort[j].transactions.push(deffoltArrayWithInfo.transactions[i])
                    }
                }
            }

            if (Number(deffoltArrayWithInfo.transactions[i].date.slice(0, 4)) === year - 1
                && (Number(deffoltArrayWithInfo.transactions[i].date.slice(5, 7))) <= 12
                && (Number(deffoltArrayWithInfo.transactions[i].date.slice(5, 7))) > 12 - (value - mounth)) {
                for (let j = 0; j < arrayForSort.length; j++) {
                    if (Number(deffoltArrayWithInfo.transactions[i].date.slice(5, 7)) === arrayForSort[j].mounthid) {
                        arrayForSort[j].transactions.push(deffoltArrayWithInfo.transactions[i])
                    }
                }
            }
        }
        if (mounth > value) {
            if ((Number(deffoltArrayWithInfo.transactions[i].date.slice(5, 7))) <= mounth
                && (Number(deffoltArrayWithInfo.transactions[i].date.slice(5, 7))) > mounth - value) {
                for (let j = 0; j < arrayForSort.length; j++) {
                    if (Number(deffoltArrayWithInfo.transactions[i].date.slice(5, 7)) === arrayForSort[j].mounthid) {
                        arrayForSort[j].transactions.push(deffoltArrayWithInfo.transactions[i])
                    }
                }
            }
        }
    }
    let arrayForSortInfo = []; // Массив для списко месяцев по порядку за период указанный (6 или 12)

    for (let i = arrayForSort.length - 1; i >= 0; i--) {
        if (arrayForSort[i].mounthid > 12 - (value - mounth)) {
            arrayForSortInfo.unshift(arrayForSort[i])
        }
    }
    for (let i = 0; i < arrayForSort.length; i++) {
        if (arrayForSort[i].mounthid <= mounth) {
            arrayForSortInfo.push(arrayForSort[i])
        }
    }

    let lastTransArray = []; // Массив для списко всех транзакций за период (нужно для нахождения сотосяния баланса в начале периода)


    let maxValueOfMonth = 0;


    for (let i = 0; i < arrayForSort.length; i++) {
        lastTransArray = [...lastTransArray, ...arrayForSort[i].transactions]
    }

    for (let i = 0; i < lastTransArray.length; i++) {
        if (lastTransArray[i].from !== account) {
            balance = balance - lastTransArray[i].amount;
        } else {
            balance = balance + lastTransArray[i].amount;
        }
    } // Цикл находит баланс который был n месяцев назад
    balance = Math.round(balance)
    for (let i = 0; i < arrayForSortInfo.length; i++) {
        if (arrayForSortInfo[i].transactions.length > 0) {
            for (let j = 0; j < arrayForSortInfo[i].transactions.length; j++) {
                if (arrayForSortInfo[i].transactions[j].from !== account) {
                    balance = balance + arrayForSortInfo[i].transactions[j].amount
                } else {
                    balance = balance - arrayForSortInfo[i].transactions[j].amount
                }
            }
        }
        arrayForSortInfo[i].balanceAtTheEndOfMonth = Math.round(balance);
    } // Цикл находит баланс на конец каждого месяца

    for (let i = 0; i < arrayForSortInfo.length; i++) {
        if (arrayForSortInfo[i].balanceAtTheEndOfMonth > maxValueOfMonth) {
            maxValueOfMonth = arrayForSortInfo[i].balanceAtTheEndOfMonth;
        }
    }// Цикл находит максимальный баланс
    console.log(maxValueOfMonth)
    console.log(arrayForSortInfo)

    return {
        maxValueOfMonth,
        arrayForSortInfo
    }
}// Функция которая  заполняет массив информации
// (arrayForSort) на основе дефолтного ( deffoltArrayWithInfo) о транзакциях за посление (value) месяцев


function DynamicOfBalance(props) {
    console.log(props)
    if (props.value === 12) {
        sessionStorage.setItem('clickability', false)
        sessionStorage.setItem('allTransactionVisible', true)
    } else {
        sessionStorage.setItem('allTransactionVisible', false)
    }


    const currentYear = (new Date()).getFullYear();
    const currentMounth = (new Date()).getMonth() + 1;

    const arrayForInfoOfBalance = [
        {mounthid: 1, mounthName: 'Янв', transactions: [], balanceAtTheEndOfMonth: 0},
        {mounthid: 2, mounthName: 'Фев', transactions: [], balanceAtTheEndOfMonth: 0},
        {mounthid: 3, mounthName: 'Мар', transactions: [], balanceAtTheEndOfMonth: 0},
        {mounthid: 4, mounthName: 'Апр', transactions: [], balanceAtTheEndOfMonth: 0},
        {mounthid: 5, mounthName: 'Май', transactions: [], balanceAtTheEndOfMonth: 0},
        {mounthid: 6, mounthName: 'Июн', transactions: [], balanceAtTheEndOfMonth: 0},
        {mounthid: 7, mounthName: 'Июл', transactions: [], balanceAtTheEndOfMonth: 0},
        {mounthid: 8, mounthName: 'Авг', transactions: [], balanceAtTheEndOfMonth: 0},
        {mounthid: 9, mounthName: 'Сен', transactions: [], balanceAtTheEndOfMonth: 0},
        {mounthid: 10, mounthName: 'Окт', transactions: [], balanceAtTheEndOfMonth: 0},
        {mounthid: 11, mounthName: 'Ноя', transactions: [], balanceAtTheEndOfMonth: 0},
        {mounthid: 12, mounthName: 'Дек', transactions: [], balanceAtTheEndOfMonth: 0},
    ];  // Баланс 6 месяцев назад


    let bar = [];
    let month = [];
    let maxValueOfMonth = 0;
    if (props.detailsInfoObj) {


        let defoltBalance = props.detailsInfoObj.balance;
        let balanceInStartingPeriod = defoltBalance;
        const qwe = createInfoArray(currentMounth, currentYear, props.value, props.detailsInfoObj, arrayForInfoOfBalance, balanceInStartingPeriod, props.detailsInfoObj.account)
        console.log(qwe.arrayForSortInfo)
        maxValueOfMonth = qwe.maxValueOfMonth;
        console.log(maxValueOfMonth, qwe.arrayForSortInfo)
        bar = qwe.arrayForSortInfo.map(item => {
            let allTransTo = 0;
            let allTransFrom = 0;
            let allTrans = 0;
            let heigthFrom = 0;
            let heigthTo = 0;


            if (props.ratio) {
                item.transactions.forEach(item => {
                    if (item.from === props.detailsInfoObj.account) {
                        allTransTo = allTransTo + item.amount;
                    } else {
                        allTransFrom = allTransFrom + item.amount;
                    }
                })
                allTrans = allTransTo + allTransFrom;
                heigthFrom = (allTransFrom * 100) / allTrans;
                heigthTo = (allTransTo * 100) / allTrans;

            }
            console.log(heigthFrom > 0)


            let heigth = (item.balanceAtTheEndOfMonth * 100) / maxValueOfMonth;


            console.log(heigth)
            return <li style={{height: `${heigth}%`, width: `50px`}} className={style.bar}>

                {props.ratio ? <div style={(heigthFrom > 0 || heigthTo > 0) ? {height: '100%', zIndex: '10'} : {
                        height: '100%',
                        zIndex: '10',
                        background: '#F3F4F6'
                    }}>
                        <div style={{height: `${heigthFrom}%`, background: '#76CA66'}}></div>
                        <div style={{height: `${heigthTo}%`, background: '#FD4E5D'}}></div>
                    </div>
                    : ''}
            </li>

        })
        month = qwe.arrayForSortInfo.map(item => {
            return <li className={style.month__list_item}>
                {item.mounthName}
            </li>

        })


    }


    return (
        <div>
            {(props.detailsInfoObj.transactions.length === 0) ?
                <div className={`${style.dinamyc__container_emptyState}`}>
                    Здесь будет отображаться динамика вашего баланса.</div> :
                <NavLink to={'/account-details/history'} className={style.linc__container}
                         style={sessionStorage.getItem('clickability') === 'false' ? {
                             pointerEvent: 'none',
                             cursor: 'default'
                         } : {}}>
                    <div className={style.dinamyc__container} style={props.value === 6 ?
                        {width: `calc(48%-100px)`, paddingLeft: `50px`}
                        : {width: `calc(100%-100px)`, paddingLeft: `100px` , transform:'none'}}>
                        <h3 className={style.dinamyc__heading}>{!props.ratio ? `Динамика баланса` : `Соотношение входящих/исходящих транзакций`}</h3>
                        <div className={style.dinamyc__containerBarsAndMaxMin}>
                            <div className={style.container__barAndMonth} style={props.value === 6 ?
                                {marginRight: `25px`}
                                : {marginRight: `50px`}}>
                                <ul className={style.bar__container} style={props.value === 6 ?
                                    {padding: `0 35px`}
                                    : {padding: `0 50px`}}>
                                    {bar}
                                </ul>
                                <ul className={style.month__list} style={props.value === 6 ?
                                    {padding: `0 35px`}
                                    : {padding: `0 50px`}}>{month}</ul>
                            </div>
                            <div className={style.container__maxMin}>

                <span>
                {maxValueOfMonth} ₽
                </span>
                                <span>0  ₽</span>
                            </div>
                        </div>

                    </div>
                </NavLink>}
        </div>


    );
}

export default DynamicOfBalance;
