import styles from './home.module.css'

import { FormEvent, useState,useEffect } from 'react'

import {BsSearch} from 'react-icons/bs'

import { Link ,useNavigate} from 'react-router-dom'


export interface CoinProps{
    id:string;
    name:string;
    symbol:string;
    priceUsd:string;
    vwap24Hr:string;
    changePercent24Hr:string;
    rank: string;
    supply:string;
    maxSupply:string;
    marketCapUsd: string;
    volumeUsd24Hr:string;
    explore:string;
    formatedPrice?:string;
    formatedMarket?:string;
    formateVolume?:string;
}


interface DataProps{
    data:CoinProps[]
}

export function Home(){

        const [search,setSearch] = useState('')
        const [coins,setCoins] = useState<CoinProps[]>([])
        const [offSet, setOffSet] = useState(0)

        const navigate = useNavigate();


        function handleSubmit(e:FormEvent){
                    e.preventDefault();
            if(!search){
                return
            }
            navigate(`/details/${search}`)
        }

        function handleGetMore(){
            if(offSet === 0){
                setOffSet(10)
                return
            }
            setOffSet(offSet + 10)
        }

        //&offset e uma propiredade que faz o corte da paginacao de acordo com o que a gente passa
        async function getData(){
            fetch(`https://api.coincap.io/v2/assets?limit=10&offset=${offSet}`).then((response) => response.json()).then((data:DataProps) => {
                const coinsData = data.data;


                //Inlt 
                const  price = Intl.NumberFormat('en-US' , {
                    style: 'currency',
                    currency:'USD'
                })


                const  priceCopact = Intl.NumberFormat('en-US' , {
                    style: 'currency',
                    currency:'USD',
                    notation: 'compact'
                })

                const formatedResult = coinsData.map((item) => {
                    const formated = {
                        ...item,
                        formatedPrice: price.format(Number(item.priceUsd)),
                        formatedMarket: priceCopact.format(Number(item.marketCapUsd)),
                        formateVolume: priceCopact.format(Number(item.volumeUsd24Hr))

                    }
                    return formated
                })


                const listCoins = [...coins,...formatedResult]
                
                setCoins(listCoins)
                //console.log(formatedResult)
            })
        }

        useEffect(() => {
            getData();

        }, [offSet])
    return(
            <main className={styles.container}>
                <form 
                onSubmit={handleSubmit}
                className={styles.form}>
                    <input
                    type="text"
                    placeholder='Search for a cripto'
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    
                    />
                    <button
                    type='submit'
                    >
                    <BsSearch size={30} color='#FFF' />  
                    </button>
                </form>

                <table>
                    <thead>
                        <tr>
                            <th scope='col'>Coin</th>
                            <th scope='col'>Market</th>
                            <th scope='col'>Price</th>
                            <th scope='col'>Volume</th>
                            <th scope='col'>Change 24h</th>
                        </tr>
                    </thead>

                    <tbody id='tbody'>
                        {
                            coins.length > 0 && coins.map((coin) => (

                                <tr className={styles.tr} key={coin.id}>
                                <td
                                 className={styles.tdLabel} data-label='Coin'
                                 >
                                  <div className={styles.name}>
                                    <img 
                                    className={styles.logo}
                                    src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLocaleLowerCase()}@2x.png`} alt="cripto coin img" />    
                                     <Link to={`/details/${coin.id}`}>
                                      <span>{coin.name}</span>
                                        | {coin.symbol}
                                      </Link>
                                  </div>
                                </td>
    
                                <td
                                 className={styles.tdLabel} data-label='Market'
                                >
                                    {coin.formatedMarket}
                                </td>
    
                                <td
                                 className={styles.tdLabel} data-label='Price'
                                >
                                {coin.formatedPrice}
                                </td>
    
                                <td
                                 className={styles.tdLabel} data-label='Volume'
                                >
                                {coin.formateVolume}
                                </td>
    
                                <td
                                 className={Number(coin.changePercent24Hr) > 0 ? styles.tdProfit : styles.tdLoss} data-label='Change 24h'
                                >
                                <span>{Number(coin.changePercent24Hr).toFixed(3)}</span>
                                </td>
                                
                            </tr>

                            ))
                        }

                    </tbody>

                </table>

                <button
                onClick={handleGetMore}
                className={styles.loadMore}
                >Load more</button>
            </main>
    )
}