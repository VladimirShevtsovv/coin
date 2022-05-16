import React, {useEffect, useState} from "react";
import style from './account.module.css'
import axios from "axios";
import Select from "./select/select";
import {useNavigate} from "react-router-dom";
import styles from "../Login/login.module.css";
import ErrorOnLoadPage from "../errorOnDowlandPage/errorOnLoadPage";


function sorting(arrayForSort, sortingValue, setSortAcc) {
    console.log(sortingValue)
    console.log(arrayForSort)
    let arrayAfterSort = [];
    let sortingValuesArray = [];
    switch (sortingValue) {
        case 'По номеру':
            for (let i = 0; i < arrayForSort.length; i++) {
                sortingValuesArray.push(arrayForSort[i].account);
            }
            sortingValuesArray.sort();
            console.log(sortingValuesArray)
            for (let i = 0; i < sortingValuesArray.length; i++) {
                for (let j = 0; j < arrayForSort.length; j++) {
                    if (sortingValuesArray[i] === arrayForSort[j].account) {
                        arrayAfterSort.push(arrayForSort[j])
                    }
                }
            }
            console.log(arrayAfterSort)
            setSortAcc(arrayAfterSort)
            break;
        case 'По балансу':
            for (let i = 0; i < arrayForSort.length; i++) {
                sortingValuesArray.push(arrayForSort[i].balance);
            }
            sortingValuesArray.sort().reverse();
            for (let i = 0; i < sortingValuesArray.length; i++) {
                for (let j = 0; j < arrayForSort.length; j++) {
                    if (sortingValuesArray[i] === arrayForSort[j].balance) {
                        arrayAfterSort.push(arrayForSort[j]);
                        sortingValuesArray.splice(i, 1)
                    }
                }
            }
            setSortAcc(arrayAfterSort)
            break;
        case 'По последней транзакции':
            let arrayForEmptyDate = [];
            let arrayForItemWithDate = [];
            for (let i = 0; i < arrayForSort.length; i++) {
                if (arrayForSort[i].transactions.length > 0) {
                    sortingValuesArray.push(arrayForSort[i].transactions[0].date.slice(0, 10));
                } else {
                    sortingValuesArray.push('');
                }

            }
            sortingValuesArray.sort().reverse();
            console.log(sortingValuesArray)
            console.log(sortingValuesArray)
            for (let i = 0; i < sortingValuesArray.length; i++) {
                for (let j = 0; j < arrayForSort.length; j++) {
                    if (arrayForSort[j].transactions.length > 0 && sortingValuesArray[i] === arrayForSort[j].transactions[0].date.slice(0, 10)) {
                        arrayForItemWithDate.push(arrayForSort[j])
                    } else {
                        arrayForEmptyDate.push(arrayForSort[j])
                    }
                    sortingValuesArray.splice(i, 1)
                    // console.log( arrayForItemWithDate,  arrayForEmptyDate)
                }
            }
            arrayAfterSort = [...arrayForItemWithDate, ...arrayForEmptyDate]
            setSortAcc(arrayAfterSort)
            console.log(arrayAfterSort)
            break;
        default:

            console.log("Sorry");
    }

}

function Accounts(props) {
    props.setActiveLink('Счета')
    sessionStorage.setItem('detailsId', '')
    sessionStorage.setItem('detailInfoOfAccount', null)

    let navigateToDetails = useNavigate()

    const [accountsFromServ, setAccountsFromServ] = useState([]); // Аккаунты при первой загурзке
    const [addedAccounts, setAddedAccouts] = useState([]); // Добавляемый аккаунт для перерисовки компонента
    const [sortedAccounts, setSortedAccounts] = useState([]); // Отсортированные аккаунты

    const [visibilityLoaderPage, setVisibilityLoaderPage] = useState(true);// Лоадер при загузке старницы
    const [serverError, setServerError] = useState('');// Ошибка если страница не загрузилась

    const [visibilityLoaderNewAccount, setVisibilityLoaderNewAccount] = useState(false);//  Лоадер при создании нового аккаунта
    const [serverErrorNewAccount, setServerErrorNewAccount] = useState('');// Ошибка если не удалось создать новый аккаунт

    const [visibilityLoaderAccountDetails, setVisibilityLoaderAccountDetails] = useState(false);// Лоадер при переходе не детали аккаунта
    const [serverErrorAccountDetails, setServerErrorAccountDetails] = useState('');// Ошибка если не удалось создать новый аккаунт

    const [idAccountDetails, setIdAccountDetails] = useState('');// ID аккаунта, детали которого мы хоти получить


    useEffect(() => {
        console.log(123)
        axios.get('http://localhost:3000/accounts', {
            headers: {
                authorization: `Basic ${sessionStorage.getItem('authorizationToken')}`,
                'Content-Type': 'application/json;charset=utf-8'
            },
        }).then(res => {
            console.log(res)
            if (res.data.error === '') {
                setAccountsFromServ(res.data.payload)
                setSortedAccounts(res.data.payload)
                setVisibilityLoaderPage(false)
                setServerError('')
            }
        }).catch(e => {
            setVisibilityLoaderPage(false)
            setServerError(e.message)
        })


    }, [addedAccounts]) // Эффект отрисовывает счета в зависимости от сортировки, при первом запуске без сортировки
    function fetchAccountDetails(e) {

        const id = e.target.id;
        axios.get(`http://localhost:3000/account/${id}`, {
            headers: {
                authorization: `Basic ${sessionStorage.getItem('authorizationToken')}`,
                'Content-Type': 'application/json;charset=utf-8'
            },
        }).then(res => {

            setVisibilityLoaderAccountDetails(false)
            if (res.data.error === '') {
                sessionStorage.setItem('detailsId', id)
                navigateToDetails('/account-details');
            } else {
                setServerErrorAccountDetails('Не удалось загрузить данные')
            }
        }).catch(e => {
            setVisibilityLoaderAccountDetails(false)
            setServerErrorAccountDetails('Не удалось загрузить данные')
        })


    } //Функция делает запрос на сервер с id счета и если овтет положительный , то перенаправяет на страницу с деталями

    async function fetchNewAccount() {
        try {
            const response = await fetch('http://localhost:3000/create-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    authorization: `Basic ${sessionStorage.getItem('authorizationToken')}`,
                },
            });
            const request = await response.json();
            if (request.error === '') {
                setAddedAccouts(request.payload.account)
            }
        } catch (e) {
            setServerErrorNewAccount('Произошла ошибка при создании нового аккаунта')
        } finally {
            setVisibilityLoaderNewAccount(false)
        }

    } //Функция добавляет новый аккаунт

    let accountsItem = sortedAccounts.map(item => {
        return (
            <li className={style.account__list_Item} id={item.account}>
                <div className={style.account__list_Item_Left}>
                    <h3 className={style.account__list_Item_Heading}>{item.account.slice(0, 15)}</h3>
                    <span className={style.account__list_Item_Balance}>{item.balance} ₽</span>
                    <div className={style.account__list_Item_LastTrans}>Последняя транзакция
                        <span>{item.transactions[item.transactions.length - 1] ? item.transactions[item.transactions.length - 1].date.slice(0, 10) : '-'}</span>
                    </div>
                </div>
                <div className={style.account__list_Item_Right}>
                    <button type={'button'} className={style.account__list_Item_Button} id={item.account}
                            onClick={(e) => {
                                setIdAccountDetails(e.target.id)
                                setVisibilityLoaderAccountDetails(true)
                                fetchAccountDetails(e)
                                console.log(idAccountDetails, visibilityLoaderAccountDetails)
                            }}
                            style={(visibilityLoaderAccountDetails === true && item.account === idAccountDetails) ? {
                                color: 'rgba(255,255,255,0)',
                                background: '#9CA3AF'
                            } : {}}
                            disabled={(visibilityLoaderAccountDetails === true && item.account === idAccountDetails) ? 'disabled' : ''}>
                        <div
                            className={styles.loader}
                            style={(visibilityLoaderAccountDetails === true && item.account === idAccountDetails) ? {display: 'block'} : {display: 'none'}}>
                        </div>
                        Открыть
                    </button>
                    <label
                        className={(serverErrorAccountDetails !== '' && item.account === idAccountDetails) ? `${styles.login__error_messange}` : `${styles.login__error_messange_hidden}`}
                        style={{width: '100px', right: '-4px', top:'20px'}}>{serverErrorAccountDetails}
                    </label>
                </div>
            </li>
        )
    }) // Создание карточек счетов

    return (
        <div className={style.account__container}>
            {visibilityLoaderPage === true ? <div className={style.loader}
                                                  style={visibilityLoaderPage === true ? {display: 'block'} : {display: 'none'}}></div> :
                <div>
                   <ErrorOnLoadPage serverError={serverError} setAddedAccouts={setAddedAccouts} setVisibilityLoaderPage={setVisibilityLoaderPage}/>
                    <div style={serverError !== '' ? {display: 'none'} : {display: 'block'}}>
                        <div className={style.account__container_TopContainer}>
                            <div className={style.account__container_ContainerWithHeadingAndSelct}>
                                <h1 className={style.account__container_Heading}>Ваши счета</h1>
                                <Select sorting={sorting}
                                        setSortedAccounts={setSortedAccounts}
                                        accountsFromServ={accountsFromServ}
                                />
                            </div>
                            <div className={style.account__container_TopContainer_Button_container}>
                                <button type={'button'} className={style.account__container_TopContainer_Button}
                                        onClick={() => {
                                            setVisibilityLoaderNewAccount(true)
                                            fetchNewAccount()
                                        }}
                                        style={visibilityLoaderNewAccount === false ? {} : {
                                            color: 'rgba(255,255,255,0)',
                                            background: '#9CA3AF'
                                        }}
                                        disabled={visibilityLoaderNewAccount === false ? '' : 'disabled'}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 4.00001L12 12M12 12L12 20M12 12L20 12M12 12L4 12"
                                              stroke={visibilityLoaderNewAccount === false ? "white" : 'rgba(255,255,255,0)'}
                                              strokeWidth="2"/>
                                    </svg>
                                    <div className={styles.loader}
                                         style={visibilityLoaderNewAccount === false ? {display: 'none'} : {display: 'block'}}>Loading...
                                    </div>
                                    Создать новый счет
                                </button>
                                <label
                                    className={serverErrorNewAccount === '' ? `${styles.login__error_messange_hidden}` : `${styles.login__error_messange}`}
                                    style={{width: 'auto', right: 0}}>{serverErrorNewAccount}
                                </label>
                            </div>

                        </div>
                        <div>
                            <ul className={style.account__list}>
                                {accountsItem}
                            </ul>
                        </div>
                    </div>
                </div>

            }
        </div>


    );
}

export default Accounts;