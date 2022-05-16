import React, {useEffect, useState} from "react";


import {YMaps, Map, Placemark} from "react-yandex-maps";
import axios from "axios";
import styles from './ATMsPage.module.css'
import ErrorOnLoadPage from "../errorOnDowlandPage/errorOnLoadPage";
import style from './../Account/account.module.css'
function ATMsPage(props) {

    props.setActiveLink('Банкоматы')

    const [coordinatesFromServ, setCoordinatesFromServ] = useState([])
    const [visibilityLoaderPage, setVisibilityLoaderPage] = useState(true);// Лоадер при загузке старницы
    const [serverError, setServerError] = useState('');// Ошибка если страница не загрузилась
    const [addedAccounts, setAddedAccouts] = useState([]); // Добавляемый аккаунт для перерисовки компонента

    useEffect(() => {
        axios.get('http://localhost:3000/banks', {
            headers: {
                authorization: `Basic ${sessionStorage.getItem('authorizationToken')}`,
                'Content-Type': 'application/json;charset=utf-8'
            },
        }).then(res => {
            console.log(res)
            if (res.data.error === '') {
                let arrayAllCoordinates = [];
                for (let i = 0; i < res.data.payload.length; i++) {
                    let arrayOneCoordinte = [];
                    arrayOneCoordinte.push(res.data.payload[i].lat)
                    arrayOneCoordinte.push(res.data.payload[i].lon)
                    arrayAllCoordinates.push(arrayOneCoordinte)
                }
                setCoordinatesFromServ(arrayAllCoordinates)
                setVisibilityLoaderPage(false)
            }else {
                setServerError(res.data.error)
            }

        }).catch(e=>{
            setVisibilityLoaderPage(false)
            setServerError(e.message)

        })
        console.log(serverError)
    }, [addedAccounts])


    const mapData = {
        center: [55.751574, 37.573856],
        zoom: 11,
    };

    const coordinates = coordinatesFromServ;
    return (
        <div >
            {visibilityLoaderPage === true ? <div className={style.loader}
                                                  style={visibilityLoaderPage === true ? {display: 'block'} : {display: 'none'}}></div>
                :
                <div >
                    <ErrorOnLoadPage serverError={serverError} setAddedAccouts={setAddedAccouts} setVisibilityLoaderPage={setVisibilityLoaderPage}/>
                    <div className={styles.ATMs__container} style={serverError !== '' ? {display: 'none'} : {display: 'flex'}}>
                        <h2 className={styles.ATMs__heading}>Карта банкоматов</h2>
                        <div className={styles.ATMs__mapContainer}>
                            <YMaps >
                                <Map defaultState={mapData} style={{width:'100%', height: '100%'}}>
                                    {coordinates.map(coordinate => <Placemark geometry={coordinate}/>)}
                                </Map>
                            </YMaps>
                        </div>

                    </div>
                </div>
               }
        </div>



    );
}

export default ATMsPage;