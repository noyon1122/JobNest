
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import carousel1 from '../images/carousel1.jpg'
import carousel2 from '../images/carousel2.jpg'
import carousel3 from '../images/carousel3.jpg'


// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Slider from './Slider';

export default function Carousel() {
  return (
    <div className='container px-2 py-6 mx-auto'>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide  ><Slider image={carousel1} text="Get Your Webdevelopment done in minutes"></Slider></SwiperSlide>
        <SwiperSlide><Slider image={carousel2} text="Get Your digital Marketing done in minutes"></Slider></SwiperSlide>
        <SwiperSlide><Slider image={carousel2} text="Get Your Graphics Design done in minutes"></Slider></SwiperSlide>
       
       
      </Swiper>
    </div>
  );
}
