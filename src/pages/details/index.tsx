
import styles from './detail.module.css'
import { useState,useEffect } from "react"

import { useParams, useNavigate } from "react-router-dom"


import { CoinProps } from "../home";


interface ResponseData{
    data: CoinProps
}

interface EroorData{
    error: string;
}

type DataProps = ResponseData | EroorData;

export function Details(){

    const [coin, setCoin] = useState<CoinProps>()
    const [loading,setLoading] = useState(true);

    const {cripto} = useParams()

    const navigate = useNavigate();

    useEffect(() => {

        async function getCoin(){
            try{
                fetch(`https://api.coincap.io/v2/assets/${cripto}`).then((response) => response.json()).then((data:DataProps) => {

                    if('error' in data){
                        navigate('/')
                        return;
                    }

                    const  price = Intl.NumberFormat('en-US' , {
                        style: 'currency',
                        currency:'USD'
                    })
    
    
                    const  priceCopact = Intl.NumberFormat('en-US' , {
                        style: 'currency',
                        currency:'USD',
                        notation: 'compact'
                    })

                    const resultData = {
                        ...data.data,
                        formatedPrice: price.format(Number(data.data.priceUsd)),
                        formatedMarket: priceCopact.format(Number(data.data.marketCapUsd)),
                        formateVolume: priceCopact.format(Number(data.data.volumeUsd24Hr))
                    }

                    setCoin(resultData);
                    setLoading(false);
                })
            }catch(error){
                console.log(error)
                navigate('/')
            }
        }
        
        getCoin()

        
    } , [cripto])
    
    if(loading){
    return(

     <div>
        <h4>Loading details...</h4>
    </div>
    )   
    }

    return(
        <div className={styles.container}>
            <h1 
            className={styles.center}
            >{coin?.name}</h1>
            <h1 
            className={styles.center}
            >{coin?.symbol}</h1>

            <section
            className={styles.content}
            >
                <img 
                className={styles.logo}
                src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLowerCase()}@2x.png`} alt="Logo da moeda" />


                <h1>{coin?.name} | {coin?.symbol}</h1>

                <p><strong>Price: </strong>{coin?.formatedPrice}</p>

                <a>
                    <strong>Market: </strong>{coin?.formatedMarket}
                </a>

                <a>
                    <strong>Volume: </strong>{coin?.formateVolume}
                </a>
                <a>
                    <strong>Change 24h: </strong>
                    <span
                    className={
                        Number(coin?.changePercent24Hr) > 0 ? styles.profit : styles.loss
                    }
                    
                    >{Number(coin?.changePercent24Hr).toFixed(3)}</span>
                </a>
            </section>
        </div>
)

}