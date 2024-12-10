"use client"

import 'swiper/css';
import 'swiper/css/effect-cards';

import path from "path";
import { useEffect, useRef, useState } from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';

const PickImage = () => {
	const [images, setImages] = useState<string[]>([])
	const [loading, setLoading] = useState<any>()
	const [picked, setPicked] = useState<string>('')
	const [pickedItems, setPickedItems] = useState<string[]>([])

	const swiperRef = useRef<any>(null)

	const shuffle = (interval: number) => {
		return setInterval(() => {
			swiperRef.current?.swiper.slideTo(Math.floor(Math.random() * images.length));
		}, interval);
	};

	const stopShuffle = () => {
		const picked = images[swiperRef.current?.swiper.activeIndex]
		clearInterval(loading)
		setLoading(null)
		setPicked(picked)
		pickedItems.push(picked.split('/')[picked.split('/').length - 1])
		localStorage.setItem('pickedItems', JSON.stringify(pickedItems))
		getImages()
		getPickedItems()
	}

	const handleStart = () => {
		setPicked('')
		setLoading(shuffle(100))
	}

	const handleStop = () => {
		stopShuffle()
	}

	const getImages = async () => {
		await fetch("/api/images", {
			method: "GET"
		})
			.then(res => res.json())
			.then(res => {
				if (res.data?.length > 0) {
					setImages(res.data.filter((item: string) => !pickedItems.includes(item)).map((item: string) => path.join('/uploaded/', item)))
				}
			})
	}

	const getPickedItems = () => {
		const items = localStorage.getItem('pickedItems')
		setPickedItems(items ? JSON.parse(items) : [])
	}

	useEffect(() => {
		getImages()
		getPickedItems()
	}, [])


	useEffect(() => {
	}, [])

	useEffect(() => {
		const keyDownHandler = (event: KeyboardEvent) => {
			if (event.code === 'Enter') {
				handleStart()
			} else if (event.code === 'Space') {
				handleStop()
			}
		}

		document.addEventListener('keydown', keyDownHandler)

		return () => {
			document.removeEventListener('keydown', keyDownHandler)
		}
	}, [])

	return (
		<>
			<div className="min-h-dvh flex flex-col justify-center items-center space-x-6 gap-5" style={{ background: 'url(/bg.jpg)', backgroundSize: 'cover' }}>
				<div className="h-full w-full px-96">
					<Swiper
						ref={swiperRef}
						modules={[EffectCards]}
						effect="cards"
						grabCursor={true}
						width={600}
						onClick={loading ? handleStop : handleStart}
					>
						{images?.map(image => (
							<SwiperSlide key={image}>
								<img src={image} className="shadow-lg rounded-lg" />
							</SwiperSlide>
						))}
					</Swiper>
				</div>
				<img src={picked || 'empty'} alt="picked image" width={800} className={`absolute z-50 shadow-lg rounded-lg transition-all duration-500 ${picked ? 'opacity-1 scale-100' : 'opacity-0 scale-0'}`} />
				{/* <div className="flex flex-col item-center fixed bottom-10 gap-2 transition-all duration-500">
					<button className="px-10 py-3 bg-violet-700 hover:bg-violet-900 rounded-full font-bold shadow-md" onClick={loading ? handleStop : handleStart}>{loading ? 'Stop' : 'Start'}</button>
				</div> */}
			</div>
		</>
	)
}

export default PickImage