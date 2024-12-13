"use client"

/* eslint-disable  @typescript-eslint/no-explicit-any */

import 'swiper/css';
import 'swiper/css/effect-cards';

import path from "path";
import { useEffect, useState } from "react"

const PickImage = () => {
	const [images, setImages] = useState<string[]>([])
	const [loading, setLoading] = useState<any>(false)
	const [pickedLength, setPickedLength] = useState<number>(1)
	const [pickedTemp, setPickedTemp] = useState<string>('')
	const [picked, setPicked] = useState<string[]>([])
	const [pickedItems, setPickedItems] = useState<string[]>([])

	const shuffle = (interval: number) => {
		return setInterval(() => {
			setPickedTemp(images[Math.floor(Math.random() * images.length)]);
			// swiperRef.current?.swiper.slideTo(Math.floor(Math.random() * images.length));
		}, interval);
	};

	const stopShuffle = () => {
		clearInterval(loading)
		setLoading(null)
		if (pickedLength == 1) {
			const picked = pickedTemp
			setPicked([picked])
			pickedItems.push(picked.split('/')[picked.split('/').length - 1])
			localStorage.setItem('pickedItems', JSON.stringify(pickedItems))
		} else {
			const pickeds: string[] = []
			for (let i = 0; i < pickedLength; i++) {
				const picked = images[Math.floor(Math.random() * images.length)]
				pickeds.push(picked);
				pickedItems.push(picked.split('/')[picked.split('/').length - 1])
			}
			setPicked([...new Set(pickeds)])
			localStorage.setItem('pickedItems', JSON.stringify([...new Set(pickedItems)]))
		}
		getImages()
		getPickedItems()
	}

	const handleStart = () => {
		setPicked([])
		setLoading(shuffle(50))
	}

	const handleStop = () => {
		stopShuffle()
	}

	const handleClose = () => {
		setPicked([])
		getImages()
		getPickedItems()
	}

	const handleClearSelected = () => {
		setPicked([])
		localStorage.removeItem('pickedItems')
		getImages()
		getPickedItems()
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
		const keyDownHandler = (event: KeyboardEvent) => {
			if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(event.key)) {
				setPickedLength(Number(event.key) > 6 ? 6 : Number(event.key))
			} else if (picked.length > 0 && event.key == 'Escape') {
				handleClose()
			} else {
				if (loading) {
					handleStop()
				} else {
					handleStart()
				}
			}
		}

		document.addEventListener('keydown', keyDownHandler)

		return () => {
			document.removeEventListener('keydown', keyDownHandler)
		}
	}, [loading])

	return (
		<>
			<div className="relative" style={{ background: 'url(/bg.jpg)', backgroundSize: 'cover' }}>
				<div className="flex flex-col justify-center items-center w-screen h-screen gap-10">
					{images && <img src={pickedTemp || images[0]} width={700} className="shadow-lg rounded-lg" />}
					<div className="flex flex-col gap-2">
						<button className="px-10 py-3 bg-violet-700 hover:bg-violet-900 rounded-full font-bold shadow-md" onClick={loading ? handleStop : handleStart}>{loading ? 'Stop' : `(${pickedLength}) Start`}</button>
						{/* <button className="px-8 py-2 text-sm hover:bg-white hover:text-black rounded-full font-bold shadow-md" onClick={handleClearSelected}>Clear Selected</button> */}
					</div>
				</div>
				<div className={`flex-col gap-10 justify-center items-center bg-black bg-opacity-80 absolute z-50 h-dvh w-dvw left-0 top-0 transition-all duration-1000 ${picked.length > 0 ? 'opacity-1 flex' : 'opacity-0 hidden'}`}>
					<div className="flex flex-wrap justify-center items-center gap-10">
						{picked.map(item => (
							<img key={item} src={item} alt="picked image" width={800 / (pickedLength > 2 ? 2 : pickedLength)} className={`object-contain shadow-lg rounded-lg transition-all duration-5000 delay-1000 ${picked ? 'opacity-1 scale-100' : 'opacity-0 scale-0'}`} />
						))}
					</div>
					<button className="px-10 py-3 bg-violet-700 hover:bg-violet-900 rounded-full font-bold shadow-md" onClick={handleClose}>Close</button>
				</div>
			</div>
		</>
	)
}

export default PickImage