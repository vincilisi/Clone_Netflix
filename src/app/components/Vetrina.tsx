'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Vetrina() {
    const film = [
        { id: 1, title: 'Film 1', img: 'https://via.placeholder.com/150x220?text=Film+1' },
        { id: 2, title: 'Film 2', img: 'https://via.placeholder.com/150x220?text=Film+2' },
        { id: 3, title: 'Film 3', img: 'https://via.placeholder.com/150x220?text=Film+3' },
        { id: 4, title: 'Film 4', img: 'https://via.placeholder.com/150x220?text=Film+4' },
    ];


    return (
        <div className="w-full px-4">
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={5}
                navigation
                pagination={{ clickable: true }}
            >
                {film.map((f) => (
                    <SwiperSlide key={f.id}>
                        <div className="bg-gray-800 rounded-lg overflow-hidden">
                            <img src={f.img} alt={f.title} className="w-full h-48 object-cover" />
                            <div className="p-2 text-white">{f.title}</div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
