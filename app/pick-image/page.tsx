"use client"

import path from "path";
import { useEffect, useState } from "react"

const timeout = [3000, 4000, 5000];

const PickImage = () => {
	const [images, setImages] = useState<string[]>([])
	const [picked, setPicked] = useState<string>('')

	const shuffle = () => {
		const pickedItem = images[Math.floor(Math.random() * images.length)];

		const loading = setInterval(() => {
			setPicked(images[Math.floor(Math.random() * images.length)]);
		}, 100);

		setTimeout(() => {
			setPicked(pickedItem);
			// setSelectedList(temp);
			// setList(list.filter(l => l != pickedItem));
			clearInterval(loading);
		}, timeout[Math.floor(Math.random() * timeout.length)]);
	};

	const handleStart = () => {
		shuffle()
	}

	const getImages = async () => {
		await fetch("/api/images", {
			method: "GET"
		})
			.then(res => res.json())
			.then(res => {
				if (res.data?.length > 0) {
					setImages(res.data.map((item: string) => path.join('/uploaded/', item)))
				}
			})
	}

	useEffect(() => {
		getImages()
	}, [])

	return (
		<div className="min-h-dvh flex flex-col justify-center items-center space-x-6 gap-5">
			{/* {images?.map(image => (
                <img key={image} src={image} width={300} />
            ))} */}
			{picked && <img src={picked} alt="picked image" width={300} />}
			<div className="flex flex-col item-center fixed bottom-10 gap-2 transition-all duration-500">
				<button className="px-10 py-3 bg-violet-700 hover:bg-violet-900 rounded-full font-bold shadow-md" onClick={handleStart}>Start</button>
				{/* <button className="px-5 py-1 bg-violet-50 hover:bg-violet-200 text-violet-700 rounded-full shadow-md" onClick={handleStop}>Stop</button> */}
			</div>
		</div>
	)
}

export default PickImage