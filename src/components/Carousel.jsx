import "swiper/css";
import "swiper/css/effect-fade";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import Image from 'astro/components/Image.astro';

/**
 * Componente Carousel
 * @param {Object} props
 * @param {Array} props.images - Array de imágenes importadas (Astro/Vite assets)
 */

export default function Carousel({ images = [] }) {
    return (
        <Swiper
            modules={[EffectFade, Autoplay]}
            effect="fade"
            autoplay={{ delay: 3000, disableOnInteraction: false, }}
            //   className="w-full h-96",
            loop={true}
            className="w-full h-[87.5vh] m-0 p-0"
        >
            {/* <SwiperSlide>
                <img src="src/assets/carousel/1.png" alt="Slide 1" className="object-cover w-full h-full" />
            </SwiperSlide>
            <SwiperSlide>
                <img src="src/assets/carousel/2.jpg" alt="Slide 2" className="object-cover w-full h-full" />
            </SwiperSlide>
            <SwiperSlide>
                <img src="src/assets/carousel/3.png" alt="Slide 2" className="object-cover w-full h-full" />
            </SwiperSlide>
            <SwiperSlide>
                <img src="src/assets/carousel/4.jpg" alt="Slide 2" className="object-cover w-full h-full" />
            </SwiperSlide>
            <SwiperSlide>
                <img src="src/assets/carousel/5.jpg" alt="Slide 2" className="object-cover w-full h-full" />
            </SwiperSlide>
            <SwiperSlide>
                <img src="src/assets/carousel/6.jpg" alt="Slide 2" className="object-cover w-full h-full" />
            </SwiperSlide> */}
            {images.map((img, i) => (
                <SwiperSlide key={i}>
                    <img
                        src={img.src}
                        alt={img.alt}
                        className="object-cover w-full h-full"
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
