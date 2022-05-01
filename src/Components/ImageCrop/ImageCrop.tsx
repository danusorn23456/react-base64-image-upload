import { useState, useEffect, useCallback } from 'react'

import Cropper from 'react-easy-crop'
import { Area, Point } from 'react-easy-crop/types';
import "./imageCrop.css"
import getCroppedImg from './cropImage'

export interface IImageCropProps {
    label?:string;
    aspectRatio?:number;
    src?: string | ArrayBuffer | null;
    onCropped?: (newFile: ResultFile) => void;
    onCancel?: () => void;
    saveText?: string;
    cancelText?: string;
}

export interface ResultFile {
    name: string,
    dataURL: string
}

export default function ImageCrop(props: IImageCropProps) {

    const {
        aspectRatio,
        label = "Image Cropper",
        saveText = "save",
        cancelText = "cancel",
        src,
        onCropped,
        onCancel
    } = props

    const [imgSrc, setImgSrc] = useState<string | null>(null)
    const [crop, setCrop] = useState<Point>({ x: 64, y: 64 })
    const [rotation, setRotation] = useState(0)
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleCropped = useCallback(async () => {
        if (!imgSrc) {
            return "imgSrc not exist"
        }

        try {
            const croppedImage = await getCroppedImg(
                imgSrc,
                croppedAreaPixels,
                rotation
            )
            let newFile: ResultFile = new File([croppedImage as BlobPart], "new file") as unknown as ResultFile
            newFile.dataURL = croppedImage || ""
            onCropped?.(newFile)
            setImgSrc(null)
        } catch (e) {
            console.error(e)
        }
    }, [croppedAreaPixels, rotation, imgSrc, onCropped])

    const handleCancel = () => {
        onCancel?.()
    }

    useEffect(() => {
        src && setImgSrc(src as string)
    }, [src])

    useEffect(()=>{
        document.getElementsByTagName('body')[0].style.overflow = 'hidden';
        return ()=>{
            document.getElementsByTagName('body')[0].style.overflow = 'visible'
        }
    })

    return (
        <div className="ImageCrop">
            <div className='ImageCrop-Overlay'/>
            <div className='ImageCrop-Modal'>
                <div className='ImageCrop-Header'>
                    <h2 className='ImageCrop-Label'>{label}</h2>
                </div>
                <div className='ImageCrop-Media'>
                    {
                        imgSrc !== null && (
                            <Cropper
                                image={imgSrc}
                                crop={crop}
                                rotation={rotation}
                                zoom={zoom}
                                aspect={aspectRatio}
                                onCropChange={setCrop}
                                onRotationChange={setRotation}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        )
                    }
                </div>
                <div className='ImageCrop-Controls'>
                    <div className='ImageCrop-Ajustment'>
                        <svg className='ImageCrop-Svg' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            className='ImageCrop-Range'
                            id="scale-input"
                            type="range"
                            min={1}
                            max={10}
                            step="0.1"
                            value={zoom}
                            disabled={!imgSrc}
                            onChange={(e) => setZoom(Number(e.target.value))}
                        />
                    </div>
                    <div className='ImageCrop-Ajustment'>
                        <svg className='ImageCrop-Svg' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <input
                            className='ImageCrop-Range'
                            id="rotate-input"
                            type="range"
                            min={0}
                            max={180}
                            value={rotation}
                            disabled={!imgSrc}
                            onChange={(e) =>
                                setRotation(Math.min(180, Math.max(-180, Number(e.target.value))))
                            }
                        />
                    </div>
                </div>
                <div className='ImageCrop-Actions'>
                    <button className='ImageCrop-Button' onClick={handleCancel}>{cancelText}</button>
                    <button autoFocus className='ImageCrop-Button Save' onClick={handleCropped}>{saveText}</button>
                </div>
            </div>
        </div>
    )
}
