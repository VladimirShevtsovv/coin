import React, {useState} from "react";
import style from './transactionHistory.module.css'
import {NavLink} from "react-router-dom";

function alternativeDate(date) {
    let typeDate = `${date.slice(8, 10)}.${date.slice(5, 7)}.${date.slice(0, 4)}`;
    return typeDate
}

function createOagination(length, array, selectedPage, setSelectedPage) {
    let pageCount = Math.ceil(length / 25);
    console.log(length)
    for (let i = 1; i <= pageCount; i++) {

        array.push(<li className={i == selectedPage ? `${`${style.pagination__list_item} ${style.selected__page}`}` : `${style.pagination__list_item}`}
                       onMouseUp={(e) => {
                           setSelectedPage(Number(e.target.textContent))
                           console.log(e.target.textContent)
                       }}>{i}</li>);
    }

}

function TransactionHistory(props) {

    const info = JSON.parse(sessionStorage.getItem('detailInfoOfAccount'))
    let lasttransactions = [];

    let lengthArrayTrans = 0;
    let lengthTableRows = 5;
    let arrayForPagination = [];

    const [selectedPage, setSelectedPage] = useState(1)
    if (props.detailsInfoObj) {
        const transactions = props.detailsInfoObj.transactions;
        const lastTransactionsArray = [];
        lengthArrayTrans = transactions.length;
        let endOfRange = lengthArrayTrans;
        if (sessionStorage.getItem('allTransactionVisible') === 'true') {
            if (lengthArrayTrans > 25) {
                if(lengthArrayTrans - (25 * (selectedPage-1))<25){
                    lengthTableRows = lengthArrayTrans - (25 * (selectedPage-1));
                }else{
                    lengthTableRows = 25;
                }
                endOfRange = lengthArrayTrans - (25 * (selectedPage-1))
                console.log(lengthArrayTrans, selectedPage)
            } else {
                lengthTableRows = lengthArrayTrans;
                endOfRange = lengthArrayTrans;
            }
        }
        createOagination(lengthArrayTrans, arrayForPagination, selectedPage, setSelectedPage);

        for (let i = endOfRange - 1; i >= endOfRange - lengthTableRows; i--) {
            lastTransactionsArray.push(transactions[i])
        }

        lasttransactions = lastTransactionsArray.map(item => {
            if(item){
                const date = alternativeDate(item.date.slice(0, 10))
                return <tr className={style.transactions__body}>
                    <td className={style.transactions__body_item}>{item.from.slice(0, 15)}</td>
                    <td className={style.transactions__body_item}>{item.to.slice(0, 15)}</td>
                    <td className={item.from !== props.detailsInfoObj.account ? `${style.transaction__plus}` : `${style.transaction__minus}`}>
                        {item.from !== props.detailsInfoObj.account ? '+' : '-'}{item.amount} ₽
                    </td>
                    <td className={style.transactions__body_item} style={{textAlign: "start"}}>{date}</td>
                </tr>
            }

        })
    }
console.log(props.detailsInfoObj)

    return (
        <div>
            {(props.detailsInfoObj.transactions.length === 0) ? <div className={`${style.transaction__container_emptyState}`}>
                    Здесь будет отображаться история ваших транзакций. На данный момент вы не совершили ни одной транзакции.</div>:
                <NavLink to={'/account-details/history'} className={style.link__container}
                         style={sessionStorage.getItem('clickability') === 'false' ? {
                             pointerEvent: 'none',
                             cursor: 'default'
                         } : {}}>

                    <div className={style.transaction__container}
                         style={sessionStorage.getItem('clickability') === 'false' ? {
                             transform: "none"
                         } : {}}>
                        <h3 className={style.transactions__heading}>История переводов</h3>
                        {(sessionStorage.getItem('allTransactionVisible') === 'true' && lengthArrayTrans > 25)
                            ? <ul className={style.pagination__list}>{arrayForPagination}</ul> : ''}
                        <table className={style.transactions}>
                            <thead>
                            <tr className={style.transactions__head}>
                                <th className={style.transactions__head_item} style={{width: `${20}%`}}>Счет отправителя</th>
                                <th className={style.transactions__head_item} style={{width: `${20}%`}}>Счет получателя</th>
                                <th className={style.transactions__head_item} style={{width: `${18}%`}}>Сумма</th>
                                <th className={style.transactions__head_item} style={{textAlign: "start"}}>Дата</th>
                            </tr>
                            </thead>
                            <tbody>
                            {lasttransactions}
                            </tbody>
                        </table>
                    </div>
                </NavLink>
            }
        </div>



    );
}

export default TransactionHistory;
