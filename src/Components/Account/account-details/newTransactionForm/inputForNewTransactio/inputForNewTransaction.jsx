import React, {useEffect, useState} from "react";
import style from './inputForNewTransaction.module.css'
import styles from './../newTransactionForm.module.css'


function InputNewTransaction(props) {

    const [visibilityDropDownMenu, setVisibilityDropDownMenu] = useState(false)

    const arrayForAutocomplete = JSON.parse(sessionStorage.getItem('arrayForAutocomplete'));
    let autoCompliteMenu = [];

    if (arrayForAutocomplete) {
        autoCompliteMenu = arrayForAutocomplete.map(item => {
            return <li className={style.newTrans__dropDownMenu_item} onClick={(e) => {
                props.setTempNewTransactionNumber(e.target.textContent)
                props.setErrorMessangeAccountTo('')
                setTimeout(setVisibilityDropDownMenu, 100, false)
            }}>
                {item}
            </li>
        })
    }

    // useEffect(()=>{
    //
    // },[(props.tempNewTransactionNumber])

    return (
        <div className={style.container__inputAndDropDown}>
            <input type={'text'} className={style.newTrans__input}
                   value={props.tempNewTransactionNumber}
                   style={props.errorMessangeAccountTo === '' ? {} : {borderColor: "#BA0000"}}
                   onFocus={() => {
                       setVisibilityDropDownMenu(true)
                   }}
                // validationInputs(e.target.value, setErrorMessangeInputAmount, errorMessangeInputAmount, 'onBlur', 'amount')
                   onChange={(e) => {
                       console.log(1)
                       props.setTempNewTransactionNumber(e.target.value)
                       props.validationInputs(e.target.value, props.setErrorMessangeAccountTo, props.errorMessangeAccountTo, 'onChange')
                   }}
                   onBlur={(e) => {

                       console.log(props.tempNewTransactionNumber)
                       props.validationInputs(props.tempNewTransactionNumber, props.setErrorMessangeAccountTo, props.errorMessangeAccountTo, 'onBlur')
                       setTimeout(setVisibilityDropDownMenu, 100, false)

                   }}
            />


            {autoCompliteMenu.length > 0 ?
                <ul className={visibilityDropDownMenu === true ? `${style.newTrans__dropDownMenu_visible}` : `${style.newTrans__dropDownMenu_hidden}`}>
                    {autoCompliteMenu}
                </ul> : ''}
            <label
                className={props.errorMessangeAccountTo === '' ? `${styles.newTransaction__error_messange_hidden}` : `${styles.newTransaction__error_messange}`}
            >{props.errorMessangeAccountTo}
            </label>
        </div>
    );
}

export default InputNewTransaction;