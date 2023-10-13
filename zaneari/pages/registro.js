import React, { useState, useEffect } from "react";
import Link from 'next/link';

import {
    Connection,
    SystemProgram,
    Transaction,
    PublicKey,
    LAMPORTS_PER_SOL,
    clusterApiUrl,
    SendTransactionError,
} from "@solana/web3.js";
import { useStorageUpload } from "@thirdweb-dev/react";

import axios from "axios";

const SOLANA_NETWORK = "devnet";
import { useRouter } from "next/router"
import app from "../settings/ConfigFirebase"

import { getFirestore, collection, addDoc } from "firebase/firestore"

const db = getFirestore(app);

function registro() {
    const [publicKey, setPublicKey] = useState(null);
    const [balance, setBalance] = useState(0);
    const [receiver, setReceiver] = useState("Gw53ogQ1353gE1bKahaLqxSJm7m3N2rYysojgHFEy2Hc");
    //const [amount, setAmount] = useState(null);
    const [amount, setAmount] = useState(0.001);
    const [explorerLink, setExplorerLink] = useState(null);

    const [uploadUrl, setUploadUrl] = useState(null);
    const [url, setUrl] = useState(null);
    const [statusText, setStatusText] = useState("");
    useEffect(() => {
        let key = window.localStorage.getItem("publicKey"); //obtiene la publicKey del localStorage
        setPublicKey(key);
        //if (key) getBalances(key);
        //if (explorerLink) setExplorerLink(null);
    }, []);

    const handleReceiverChange = (event) => {
        setReceiver(event.target.value);
    };

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const handleSubmit = async () => {
        console.log("Este es el receptor", receiver);
        console.log("Este es el monto", amount);
        sendTransaction();
    };

    const handleUrlChange = (event) => {
        setUrl(event.target.value);
        console.log("Si se esta seteando la URL", url);
    };


    const signIn = async () => {
        //Si phantom no esta instalado
        const provider = window?.phantom?.solana;
        const { solana } = window;

        if (!provider?.isPhantom || !solana.isPhantom) {
            toast.error("Phantom no esta instalado");
            setTimeout(() => {
                window.open("https://phantom.app/", "_blank");
            }, 2000);
            return;
        }
        //Si phantom esta instalado
        let phantom;
        if (provider?.isPhantom) phantom = provider;

        const { publicKey } = await phantom.connect(); //conecta a phantom
        console.log("publicKey", publicKey.toString()); //muestra la publicKey
        setPublicKey(publicKey.toString()); //guarda la publicKey en el state
        window.localStorage.setItem("publicKey", publicKey.toString());
    };

    //Funcion para obtener el balance de nuestra wallet

    const getBalances = async (publicKey) => {
        try {
            const connection = new Connection(
                clusterApiUrl(SOLANA_NETWORK),
                "confirmed"
            );

            const balance = await connection.getBalance(
                new PublicKey(publicKey)
            );

            //const balancenew = balance / LAMPORTS_PER_SOL;
            const balancenew = balance;
            setBalance(balancenew);
        } catch (error) {
            console.error("ERROR GET BALANCE", error);
            toast.error("Something went wrong getting the balance");
        }
    };

    //Funcion para enviar una transaccion
    const sendTransaction = async () => {
        try {
            //Consultar el balance de la wallet
            getBalances(publicKey);
            console.log("Este es el balance", balance);

            //Si el balance es menor al monto a enviar
            /*
            if (balance < amount) {
                console.log("No tienes suficiente balance");
                return;
            }
            */

            const provider = window?.phantom?.solana;
            const connection = new Connection(
                clusterApiUrl(SOLANA_NETWORK),
                "confirmed"
            );

            //Llaves

            const fromPubkey = new PublicKey(publicKey);
            const toPubkey = new PublicKey(receiver);

            //Creamos la transaccion
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey,
                    toPubkey,
                    lamports: amount * LAMPORTS_PER_SOL,
                })
            );
            console.log("Esta es la transaccion", transaction);

            //Traemos el ultimo blocke de hash
            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = fromPubkey;

            //Firmamos la transaccion
            const transactionsignature = await provider.signTransaction(
                transaction
            );

            //Enviamos la transaccion
            const txid = await connection.sendRawTransaction(
                transactionsignature.serialize()
            );
            console.info(`Transaccion con numero de id ${txid} enviada`);

            //Esperamos a que se confirme la transaccion
            const confirmation = await connection.confirmTransaction(txid, {
                commitment: "singleGossip",
            });

            const { slot } = confirmation.value;

            console.info(
                `Transaccion con numero de id ${txid} confirmado en el bloque ${slot}`
            );

            const solanaExplorerLink = `https://explorer.solana.com/tx/${txid}?cluster=${SOLANA_NETWORK}`;
            setExplorerLink(solanaExplorerLink);

            console.log("Transaccion enviada con exito :D ");
            

            //Actualizamos el balance
            getBalances(publicKey);
            setAmount(null);
            setReceiver(null);

            return solanaExplorerLink;
        } catch (error) {
            console.error("ERROR SEND TRANSACTION", error);
        }
    };


    const router = useRouter()

    const valorInicial = {
        sector: "",
        profesion: "",
        nombre: "",
        apellidos: "",
        cedula: "",
        walletAddress: "",
        password: "",
        phone: "",
        email: "",
        ciudad: ""
    }

    const [dato, setDato] = useState(valorInicial)

    //capturar los inputs
    const obtenerInputs = (e) => {
        const { name, value } = e.target;
        setDato({ ...dato, [name]: value })
    }


    //esta funcion es para guardar la info en firebase
    const enviarInfo = async (e) => {
        e.preventDefault();
        //console.log(dato);
        try {
            await addDoc(collection(db, 'users'), {
                ...dato
            })
        } catch (error) {
            console.log(error);
        }
        //setDato({...valorInicial})

        //que esta funcion lo que hace es una redireccion
        //pago
        handleSubmit(()=>router.push('/login'));
    }


    return (
        <div className='Container'>
            <div className='Container-datos'>
                <h1> Cree su perfil de profesionista</h1> <br></br>
                <span>{`Wallet: ${publicKey}`}</span>
                <button
                    type="submit"
                    className="inline-flex h-8 w-52 justify-center bg-purple-500 font-bold text-white"
                    onClick={() => {
                        signIn();
                    }}
                >
                    Conecta tu wallet
                </button>
                <form onSubmit={enviarInfo}>
                    <div className='Campos'>
                        <div>
                            <label for="walletAddress"></label> <br></br>
                            <input type='hidden' id='walletAddress' name='walletAddress' value={dato.walletAddress = publicKey} onChange={obtenerInputs}></input>
                        </div>

                        <div>
                            <label for="sector">Sector *</label> <br></br>
                            <select id='sector' name='sector' value={dato.sector} onChange={obtenerInputs}>
                                <option value="Salud" onChange={obtenerInputs}>Salud</option>
                                <option value="Juridico" onChange={obtenerInputs}>Juridico</option>
                            </select>
                        </div>

                        <div>
                            <label for="profesion">Profesión *</label> <br></br>
                            <select id='profesion' name='profesion' value={dato.profesion} onChange={obtenerInputs}>
                                <option value="Doctor" onChange={obtenerInputs}>Doctor</option>
                                <option value="Abogado" onChange={obtenerInputs}>Abogado</option>
                            </select>
                        </div>
                    </div>

                    <div className='Campos'>
                        <div>
                            <label for="nombre">Nombre(s) *</label> <br></br>
                            <input type='text' id='nombre' name='nombre' value={dato.nombre} onChange={obtenerInputs}></input>
                        </div>

                        <div>
                            <label for="apellidos">Apellido(s) *</label> <br></br>
                            <input type='text' id='apellidos' name='apellidos' value={dato.apellidos} onChange={obtenerInputs}></input>
                        </div>
                    </div>

                    <div className='Campos'>
                        <div>
                            <label for="cedula">No. De Cédula *</label><br></br>
                            <input className='grande' type='text' id='cedula' name='cedula' value={dato.cedula} onChange={obtenerInputs}></input>
                        </div>
                    </div> <br></br>

                    <div className='Campos'>
                        <div>
                            <label for="ciudad">Ciudad *</label>  <br></br>
                            <input type='text' id='ciudad' name='ciudad' value={dato.ciudad} onChange={obtenerInputs}></input>
                        </div>

                        <div>
                            <label for="phone">Número de celular *</label>  <br></br>
                            <input type='text' id='phone' name='phone' value={dato.phone} onChange={obtenerInputs}></input>
                        </div>
                    </div>

                    <div className='Campos'>
                        <div>
                            <label for="email">Email *</label> <br></br>
                            <input className='grande' type='text' id='email' name='email' value={dato.email} onChange={obtenerInputs}></input>
                        </div>
                    </div>

                    <div className='Campos'>
                        <div>
                            <label for="password">Contraseña *</label>  <br></br>
                            <input className='grande' type='password' id='password' placeholder='Contraseña' name='password' value={dato.password} onChange={obtenerInputs}></input>
                        </div>
                    </div>

                    <div className='Campos'>
                        <div>
                            <button type='submit' onClick={() => router.push('/login')}> Registrarse </button>
                        </div>
                    </div>
                </form>
            </div>

            <div className='Container-fondo'>

            </div>
        </div>
    );
}



export default registro;

/*
 <div>
            <h1>Registro</h1>
            <form onSubmit={enviarInfo}>
                <label htmlFor="walletAddress">Wallet Key:</label>
                <input
                    type="text"
                    id="walletAddress"
                    name="walletAddress"
                    value={dato.walletAddress}
                    onChange={obtenerInputs}
                    required
                />
                <br />
                <label htmlFor="password">Contraseña:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={dato.password}
                    onChange={obtenerInputs}
                    required
                />
                <br />
                <button type="submit" onClick={() => router.push('/')}>Registrarse</button>
            </form>
        </div>
 */