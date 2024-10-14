import styles from './header.module.css'


import { Link } from 'react-router-dom'


import logoImg from '../../assets/logo.svg'

export function Header(){

    return(
        <header className={styles.container}>
            <Link to='/'>
                <img src={logoImg} alt="Logo cripto currency" />
            </Link>
        </header>
    )

}