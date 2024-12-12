"use client"

import { useRouter } from "next/navigation";
import path from "path";
import { useEffect, useState } from "react";

const Home = () => {
  const router = useRouter()
  const [images, setImages] = useState<string[]>([])

  const handleReset = async () => {
    await fetch("/api/images", {
      method: "DELETE"
    }).then(() => {
      setImages([])
    })
  }

  const handleUploadImages = async (files: FileList | null) => {
    if (files) {
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
      }

      await fetch("/api/images", {
        method: "POST",
        body: formData
      }).then(() => getImages())
    }
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
      <label className="m-10">
        <span className="sr-only">Choose Images</span>
        <input type="file" accept="image/*" onChange={e => handleUploadImages(e.target.files)} multiple className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-200 file:cursor-pointer
    "/>
      </label>
      {images?.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-5">
          {images?.map((image: string) => (
            <img key={image} src={image} width={200} />
          ))}
        </div>
      )}
      <div className={`flex flex-col item-center fixed bottom-10 gap-2 transition-all duration-500 ${images.length > 0 ? 'opacity-1' : 'opacity-0 translate-y-10'}`}>
        <button className="px-10 py-3 bg-violet-700 hover:bg-violet-900 rounded-full font-bold shadow-md" onClick={() => router.push('pick-image')}>CONTINUE</button>
        <button className="px-5 py-1 bg-violet-50 hover:bg-violet-200 text-violet-700 rounded-full shadow-md" onClick={handleReset}>Clear</button>
      </div>
    </div>
  );
}

export default Home
