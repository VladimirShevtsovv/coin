import React, {useEffect, useState} from "react";
import style from './select.module.css'


function Select(props) {


    const [selectedSort, setSelectedSort] = useState(''); // По чем сортировать
    const [choicesForSort, setChoicesForSort] = useState(['По номеру', 'По балансу', 'По последней транзакции'])

    function closeDropDown(e) {
        setSelectedSort(e.target.textContent)
        // props.sorting(props.accountsFromServ, selectedSort, props.setSortedAccounts)
        // sorting(accountsFromServ, selectedSort, setSortedAccounts)
    }

    useEffect(() => {
        props.sorting(props.accountsFromServ, selectedSort, props.setSortedAccounts)
    }, [selectedSort])

    let choicesSort = choicesForSort.map(item => {

        return <li onClick={(e) => closeDropDown(e)}
                   className={`${style.tabs__list_item} ${item === selectedSort ? style.tabs__list_itemSelected : ''}`}>
            {item}
        </li>
    })

    return (
        <div className={style.tabs__container}>
            <h2 className={style.tabs__heading}>
                Сортировать по:
            </h2>
            <ul className={style.tabs__list}>
                {choicesSort}
            </ul>
        </div>
    );
}

export default Select;
