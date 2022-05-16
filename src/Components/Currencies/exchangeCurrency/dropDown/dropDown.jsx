import React from "react";

import style from './dropDown.module.css'


function DropDownMenuCurensies(props) {

    let allCurrencies = JSON.parse(sessionStorage.getItem('yourCurrensies'))
    let listWithAllCurrensies =[]
    if(allCurrencies){
        listWithAllCurrensies = allCurrencies.map(item => {
            return <li onClick={(e) => {
                props.setSelectedCurrenсy(e.target.textContent)
                props.setErrorMessangeCurrensy('')
            }
            }
                       className={item === props.selectedCurrencyRight || item === props.selectedCurrencyLeft ? `${style.list__container_item_hidden}` : `${style.list__container_item}`}>
                {item}
            </li>
        })
    }



    return (
        <ul className={props.visibility === false ? `${style.list__container_hidden}` : `${style.list__container}`}>
            {listWithAllCurrensies}
        </ul>
    );
}

export default DropDownMenuCurensies;
