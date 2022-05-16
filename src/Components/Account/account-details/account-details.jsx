import React, {useEffect, useState} from "react";
import styles from "./account-details.module.css";

import {NavLink, Route, Routes} from "react-router-dom";
import DinamicOfBalance from "./dinamicsOfBalace/dinamicOfBalance";
import TransactionHistory from "./transactionHistory/transactionHistory";
import NewTransactionForm from "./newTransactionForm/newTransactionForm";
import axios from "axios";
import ErrorOnLoadPage from "../../errorOnDowlandPage/errorOnLoadPage";
import style from './../account.module.css'

function AccountDetails() {
    const id = sessionStorage.getItem('detailsId');
    const [detailsInfoObj, setDetailsInfoObj] = useState(null)
    sessionStorage.setItem('clickability', true)


    const [visibilityLoaderPage, setVisibilityLoaderPage] = useState(true);// Лоадер при загузке старницы
    const [serverError, setServerError] = useState('');// Ошибка если страница не загрузилась
    const [addedAccounts, setAddedAccouts] = useState([]); // Добавляемый аккаунт для перерисовки компонента

    useEffect(() => {

        axios.get(`http://localhost:3000/account/${id}`, {
            headers: {
                authorization: `Basic ${sessionStorage.getItem('authorizationToken')}`,
                'Content-Type': 'application/json;charset=utf-8'
            },
        }).then(res => {
            if (res.data.error === '') {
                sessionStorage.setItem('detailInfoOfAccount', JSON.stringify(res.data.payload))
                setDetailsInfoObj(res.data.payload)
                setVisibilityLoaderPage(false)
            }else{
                setServerError(res.data.error)
            }
        }).catch(e=>{
            setVisibilityLoaderPage(false)
            setServerError(e.message)
        })
    }, [addedAccounts])

    console.log(detailsInfoObj)
    return (
        <main className={styles.main__container}>
            {visibilityLoaderPage === true ? <div className={style.loader}
                                                  style={visibilityLoaderPage === true ? {display: 'block'} : {display: 'none'}}></div>
                :
                <div>
                    <ErrorOnLoadPage serverError={serverError} setAddedAccouts={setAddedAccouts}
                                     setVisibilityLoaderPage={setVisibilityLoaderPage}/>
                    <div  className={styles.details__containerMain} style={serverError !== '' ? {display: 'none'} : {display: 'flex'}}>
                        <div className={styles.details__topContainer}>
                            <div className={styles.details__heading_containr}>
                                <Routes>
                                    <Route path={"/"}
                                           element={<h1 className={styles.details__heading}>Просмотр счета</h1>}/>
                                    <Route path={"/history"}
                                           element={<h1 className={styles.details__heading}>История баланса</h1>}/>
                                </Routes>
                                № {detailsInfoObj ? detailsInfoObj.account : ''}
                            </div>
                            <div className={styles.details__container_balanceAndButton}>
                                <Routes>
                                    <Route path={"/"}
                                           element={<NavLink to={'/accounts'} className={styles.details__button_back}>К списку счетов</NavLink>}/>
                                    <Route path={"/history"}
                                           element={<NavLink to={'/account-details'}
                                                             className={styles.details__button_back}>К просмотру счета</NavLink>}/>
                                </Routes>

                                <div className={styles.details__balance_container}>Баланс
                                    <span className={styles.details__balance}>
                            {detailsInfoObj ? Math.round(detailsInfoObj.balance) : ''} ₽</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <Routes>
                                <Route path={"/"} element={<div className={styles.details__container_dynamicAndNew}>
                                    <NewTransactionForm setDetailsInfoObj={setDetailsInfoObj}
                                                        balance={detailsInfoObj ? detailsInfoObj.balance : 0}/>
                                    <DinamicOfBalance value={6} detailsInfoObj={detailsInfoObj}/>
                                </div>}/>
                                <Route path={"/history"} element={<div>
                                    <DinamicOfBalance value={12} detailsInfoObj={detailsInfoObj}/>
                                    <DinamicOfBalance value={12} ratio={'ratio'} detailsInfoObj={detailsInfoObj}/>
                                </div>}/>
                            </Routes>

                            <TransactionHistory detailsInfoObj={detailsInfoObj}/>
                        </div>
                    </div>

                </div>
            }

        </main>
    );
}

export default AccountDetails;