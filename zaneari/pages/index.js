import React from "react";
import Image from 'next/image'
import img1 from "../img/img-1.png"
import img2 from "../img/img-2.png"
import p1 from "../img/0.png"
import p2 from "../img/1.png"
import p3 from "../img/2.png"
import p4 from "../img/3.png"
import Link from 'next/link';



const Home = () => {

    return (
        <div className='Main'>
            <div className='Header'>
                <div className='Nav'>
                    <a href="" class="logo"><image src=""></image></a>
                    <ul class="Nav">
                        <Link href="/login">
                            <li><a href="">Iniciar Sesión</a></li>
                        </Link>
                        <Link href="/registro">
                            <li> <a href="">Registro</a></li>
                        </Link>


                    </ul>
                </div>
            </div>

            <div className='Container'>
                <div className='Container-Izquierdo'>
                    <div className='Container-Interior'>
                        <h1>Encuentra a un profesional que te ayude</h1>
                        <span>La plataforma preferida de los profesionistas</span>
                        <div className='Campos'>
                            <select id='sector'>
                                <option value="" disabled selected>Sector</option>
                                <option value="salud">Salud</option>
                                <option value="juridico">Jurídico</option>
                            </select>
                            <select id='profesion'>
                                <option value="" disabled selected>Profesión</option>
                                <option value="">Lic. en Derecho</option>
                            </select>
                            <select id='profesion'>
                                <option value="" disabled selected>Buscar</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className='Container-Derecho'>
                    <div className='Container-Img'>
                        <Image src={img1} className="img-style " />
                        <Image src={img2} className="img-style " />
                    </div>
                </div>
            </div>
            <div>
                <h1 className='titulo'>SECTORES EN (PLATAFORMA) </h1>
            </div>
            <div className='container-profesionalistas'>
                <div className='container-info'>
                    <div className="circulo-div"><Image src={p1} className="img-perfil" /></div>
                    <span className="info-texto">Lic.Susan Ponce</span>
                    <span className="info-texto2">Abogado</span>
                </div>
                <div className='container-info'>
                    <div className="circulo-div"><Image src={p2} className="img-perfil" /></div>
                    <span className="info-texto">Lic.Ricardo Rioda</span>
                    <span className="info-texto2">Abogado</span>
                </div>
                <div className='container-info'>
                    <div className="circulo-div"><Image src={p3} className="img-perfil" /></div>
                    <span className="info-texto">Lic Yael Gonzalez</span>
                    <span className="info-texto2">Abogado</span>
                </div>
                <div className='container-info'>
                    <div className="circulo-div"><Image src={p4} className="img-perfil" /></div>
                    <span className="info-texto">Lic Manuerl Turizo</span>
                    <span className="info-texto2">Abogado</span>
                </div>
            </div>
        </div>
    );
};

export default Home;

