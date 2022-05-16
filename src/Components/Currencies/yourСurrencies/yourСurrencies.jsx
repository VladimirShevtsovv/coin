import React, {useEffect, useState} from "react";

import style from './yourСurrencies.module.css'
import axios from "axios";


function YourCurrencies(props) {

console.log(1)



    return (
        <div className={style.yourCurrencies__container}>
            <h2 className={style.yourCurrencies__heading}>Ваши валюты</h2>
            <ul className={style.yourCurrencies__list}>
                {props.arrayYourCurrencies}
            </ul>
        </div>
    )
}

export default YourCurrencies;