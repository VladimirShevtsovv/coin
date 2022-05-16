import React, {useState} from "react";
import style from "../Account/account.module.css";
import styles from "../Login/login.module.css";


function ErrorOnLoadPage(props) {

    const [click, setClick] = useState(false)
console.log(props)
    return (
        <div style={props.serverError === '' ? {display: 'none'} : {display: 'flex'}}
             className={style.account__serverError_container}>
            Не удалось загрузить данные
            <div className={style.account__serverError_discription}>Попробуйте обновить страницу. Если
                ошибка сохраняется, повторите позже</div>
            <button type={"button"} onMouseUp={(e) => {
                setClick(true)
                props.setVisibilityLoaderPage(true)
                props.setAddedAccouts([])
            }} className={style.account__list_Item_Button}
                    style={(click === true) ? {
                        color: 'rgba(255,255,255,0)',
                        background: '#9CA3AF'
                    } : {}}
                    disabled={(click === true) ? 'disabled' : ''}>
                <div
                    className={styles.loader}
                    style={(click === true) ? {display: 'block'} : {display: 'none'}}>
                </div>
                Нажмите для перезагрузки страницы
            </button>
        </div>
    );
}

export default ErrorOnLoadPage;