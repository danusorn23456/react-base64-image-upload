import { useEffect, useRef, useState } from 'react';
import './App.css';
import { ReactEzyImageUpload } from './Components/ReactEzyImageUpload';
import { ResultFile } from './Components/ReactEzyImageUpload/ReactEzyImageUpload';
import { ImageCrop } from './Components/ImageCrop';

function App() {
  const promiseRef = useRef<any>(null)
  const [value] = useState<Partial<ResultFile>[]>([
    {
      dataURL: "https://picsum.photos/seed/1/200/300"
    },
    {
      dataURL: "https://picsum.photos/seed/2/200/300"
    },
  ])
  const [imgSrc, setImgSrc] = useState<string | ArrayBuffer | null>(null)
  const [width, setWidth] = useState<number | string>(480)
  const [maxFileUpload, setMaxFileUpload] = useState(8)
  const [imageBoxPerRow, setImageBoxPerRow] = useState(4)
  const [fixedSlot, setFixedSlot] = useState(false)
  const [labels, setLabels] = useState([''])
  const [label, setLabel] = useState("upload")
  const [borderless, setBorderLess] = useState(false)
  const [error, setError] = useState(false)
  const [rounded, setRounded] = useState(false)
  const [showCaption, setShowCaption] = useState(true)
  const [maxFileSize, setMaxFileSize] = useState(10485760)
  const [draggable, setDraggable] = useState(true)

  const handleEachChange = async (file: ResultFile) => {
    // if (file.aspectRatio !== 1 / 1) {
      setImgSrc(file.dataURL)
      
      return await new Promise((resolve, reject) => {
        promiseRef.current = { resolve, reject, file }
        return promiseRef.current.file
      })
    // }
    // return file
  }

  const handleChange = (files: ResultFile[]) => {

    console.log(files.map(file => file.dataURL?.slice(0,64)+"..."), "@@send to backend !!!")
  }

  const handleCropped = (file: any) => {
    let newFile = promiseRef.current.file = file
    promiseRef.current.resolve(newFile)
    setImgSrc(null)
  }

  const handleCroppedCancel = () => {
    setImgSrc(null)
    promiseRef.current.resolve(false)
  }

  useEffect(() => {
    let array: any = Array.from({ length: maxFileUpload })
    for (let i = 0; i < maxFileUpload; i++) {
      array[i] = i
    }
    setLabels(array)
  }, [fixedSlot, maxFileUpload])

  return (
    <div className="App">
      <div className='Component'>
        <h2 style={{ textAlign: "left" }}>React Ezy Image Upload</h2>
        <ReactEzyImageUpload value={value} maxFileSize={maxFileSize} rounded={rounded} showCaption={showCaption} onEachChange={file => handleEachChange(file)} onChange={files => handleChange(files)} label={label} labels={labels} fixedSlot={fixedSlot} draggable={draggable} error={error} borderless={borderless} imageBoxPerRow={imageBoxPerRow} maxFileUpload={maxFileUpload} width={width} />
        {!!imgSrc && <ImageCrop src={imgSrc} aspectRatio={1/1} onCropped={handleCropped} onCancel={handleCroppedCancel} />}
      </div>
      <div className='Setting'>
        <form>
          <div className='inputControl'>
            <label>
              width
            </label>
            <input type="text" name="width" defaultValue={width} onChange={event => setWidth(["%","px","rem","em","vw","vh"].some(t=>event.target.value.includes(t)) ? event.target.value : event.target.value+"px")} />
          </div>
          <div className='inputControl InputControl-CheckBox'>
            <label htmlFor="fixedSlot">
              fixedSlot
            </label>
            <input type="checkbox" name="fixedSlot" defaultChecked={fixedSlot} onChange={event => setFixedSlot(event.target.checked)} />
          </div>
          <div className='inputControl'>
            <label htmlFor="label">
              label
            </label>
            <input disabled={fixedSlot} type="text" name="label" defaultValue={label} onChange={event => setLabel(event.target.value)} />
          </div>
          <div className='inputControlX'>
            {labels?.map((item, index) => (
              <div key={index} className='inputControl'>
                <label>
                  {`labels[${index}]`}
                </label>
                <input disabled={!(fixedSlot && maxFileUpload)} type="text" style={{ width: 50 }} name={`labels[${index}]`} defaultValue={index} onChange={event => setLabels(prev => {
                  prev[index] = event.target.value

                  return [...prev]
                })} />
              </div>
            ))}
          </div>
          <div className='inputControl InputControl-CheckBox'>
            <label htmlFor="draggable">
              dragable
            </label>
            <input type="checkbox" name="draggable" defaultChecked={draggable || true} onChange={event => setDraggable(event.target.checked)} />
          </div>
          <div className='inputControl InputControl-CheckBox'>
            <label htmlFor="draggable">
              rounded
            </label>
            <input type="checkbox" name="rounded" defaultChecked={rounded || false} onChange={event => setRounded(event.target.checked)} />
          </div>
          <div className='inputControl InputControl-CheckBox'>
            <label htmlFor="error">
              showCaption
            </label>
            <input type="checkbox" name="showCaption" defaultChecked={showCaption || true} onChange={event => setShowCaption(event.target.checked)} />
          </div>
          <div className='inputControl InputControl-CheckBox'>
            <label htmlFor="error">
              error
            </label>
            <input type="checkbox" name="error" defaultChecked={error || false} onChange={event => setError(event.target.checked)} />
          </div>
          <div className='inputControl InputControl-CheckBox'>
            <label htmlFor="borderless">
              borderless
            </label>
            <input type="checkbox" name="borderless" defaultChecked={borderless || false} onChange={event => setBorderLess(event.target.checked)} />
          </div>
          <div className='inputControl'>
            <label htmlFor="maxFileUpload">
              maxFileUpload
            </label>
            <input type="number" name="maxFileUpload" defaultValue={maxFileUpload || 8} onChange={event => setMaxFileUpload(event.target.valueAsNumber)} />
          </div>
          <div className='inputControl'>
            <label htmlFor="imageBoxPerRow">
              imageBoxPerRow
            </label>
            <input type="number" name="imageBoxPerRow" defaultValue={imageBoxPerRow || 4} onChange={event => setImageBoxPerRow(event.target.valueAsNumber)} />
          </div>
          <div className='inputControl'>
            <label htmlFor="imageBoxPerRow">
              maxFileSize
            </label>
            <input type="number" name="imageBoxPerRow" defaultValue={maxFileSize || 10485760} onChange={event => setMaxFileSize(event.target.valueAsNumber)} />
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
