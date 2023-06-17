import { useCallback, useEffect, useRef, useState } from "react";
import ReactEzyImageUploadContainer, {
  IReactEzyImageUploadContainerProps,
} from "./ReactEzyImageUploadContainer";
import ReactEzyImageUploadImageBox, {
  IReactEzyImageUploadImageBoxProps,
} from "./ReactEzyImageUploadBox";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";
import humanFileSize from "./humanFileSize";
import ReactEzyImageUploadCaption from "./ReactEzyImageUploadCaption";

import "./reactEzyImageUpload.css";

export interface IReactEzyImageUploadProps
  extends Pick<
      IReactEzyImageUploadContainerProps,
      | "disabled"
      | "borderless"
      | "error"
      | "width"
      | "maxWidth"
      | "imageBoxPerRow"
    >,
    Pick<IReactEzyImageUploadImageBoxProps, "rounded" | "draggable" | "label"> {
  id?: any;
  name?: any;
  label?: any;
  value?: Partial<ResultFile>[];
  fixedSlot?: boolean;
  maxFileSize?: number;
  maxFileUpload?: number;
  labels?: string[];
  showCaption?: boolean;
  onEachChange?: (file: ResultFile) => any;
  onChange?: (files: ResultFile[]) => any;
}

export type ResultFile = {
  name: string;
  dataURL: string | ArrayBuffer | null;
  aspectRatio: number;
};

export type RejectFile = {
  name: string;
  size: string;
};

export default function ReactEzyImageUpload(props: IReactEzyImageUploadProps) {
  let {
    rounded,
    showCaption = true,
    disabled,
    onEachChange = (file) => file,
    onChange,
    draggable = true,
    borderless,
    error,
    label,
    labels,
    fixedSlot = false,
    maxWidth = "100%",
    width = "640px",
    imageBoxPerRow = 4,
    maxFileUpload = 12,
    maxFileSize = 10485760,
    value = [],
  } = props;

  const selectedRef = useRef<number | null>(null);
  const targetRef = useRef<number | null>(null);
  const [isDisabled, setIsDisabled] = useState(disabled);
  const [currentValue, setCurrentValue] = useState<ResultFile[] | any[]>(value);

  const containerRef = useRef<HTMLDivElement | any>();
  const rows = Math.ceil(maxFileUpload / imageBoxPerRow);

  function handleFileDrop(e?: Event) {
    e?.preventDefault();
    if (selectedRef.current !== null && targetRef.current !== null) {
      let temp = currentValue[targetRef.current];
      currentValue[targetRef.current] = currentValue[selectedRef.current];
      currentValue[selectedRef.current] = temp;

      selectedRef.current = 0;
      return setCurrentValue([...currentValue]);
    }
  }

  const handleDelete = (index: number) => {
    setCurrentValue((prev) => {
      if (fixedSlot && index !== null) {
        prev[index].dataURL = "";
      } else {
        prev = [...prev.filter((item, _index) => _index !== index)];
      }

      onChange?.(prev);

      return [...prev];
    });
  };

  const getAspectRatio = (dataUrl: string) => {
    return new Promise((resolve) => {
      let image = new Image();

      image.onload = () => {
        resolve(image.width / image.height);
      };

      image.src = dataUrl;
    });
  };

  const onDrop = useCallback(
    async <T extends File>(
      acceptedFiles: T[],
      fileRejections: FileRejection[],
      event: DropEvent
    ) => {
      let currentUploaded = currentValue.length;
      let rejectFiles: RejectFile[] = [];

      let remainingUploadAmount = maxFileUpload - currentUploaded;

      if (currentUploaded > maxFileUpload) {
        return console.log("reach limit max file upload");
      } else if (!fixedSlot) {
        acceptedFiles = acceptedFiles.slice(0, remainingUploadAmount);
      }

      for (let index = 0; index < acceptedFiles.length; index++) {
        let file = acceptedFiles[index];

        if (file.size > maxFileSize) {
          rejectFiles.push({ name: file.name, size: humanFileSize(file.size) });
          continue;
        }

        await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onabort = () => console.log("file reading was aborted");
          reader.onerror = () => console.log("file reading has failed");
          reader.onload = async () => {
            setIsDisabled(true);

            let result: ResultFile = file as unknown as any;
            result.dataURL = reader.result;

            let aspectRatio = (await getAspectRatio(
              reader.result as string
            )) as number;
            result.aspectRatio = aspectRatio;

            let _result = await new Promise(
              async (inner_resolve, inner_reject) => {
                let respone = false;
                if (onEachChange) {
                  respone = await onEachChange(result);
                }
                return inner_resolve(respone);
              }
            );

            if (_result) {
              let result = _result;
              setCurrentValue((prev) => {
                if (fixedSlot && selectedRef.current !== null) {
                  prev[selectedRef.current] = result;
                } else {
                  prev = [...prev, result];
                }

                onChange?.(prev);

                return [...prev];
              });
            }
            setIsDisabled(false);
            resolve(1);
          };

          reader.readAsDataURL(file);
        });
      }

      if (rejectFiles.length) {
        let alertMsg = rejectFiles.map(
          (file, index) => `\n${index + 1}) name:${file.name} size:${file.size}`
        );
        alert(
          `ไม่สามารถอัพโหลด ${
            rejectFiles.length
          } ไฟล์ดังต่อไปนี้ เพราะมีขนาดไฟล์เกิน ${humanFileSize(
            maxFileSize
          )} ${alertMsg}`
        );
      }
    },
    [
      currentValue,
      maxFileSize,
      maxFileUpload,
      fixedSlot,
      onEachChange,
      onChange,
    ]
  );

  const { getRootProps } = useDropzone({
    onDrop,
    multiple: !fixedSlot,
    accept: "image/*",
  });

  useEffect(() => {
    setCurrentValue(
      fixedSlot
        ? Array.from({ length: maxFileUpload }, () => ({
            path: "",
            lastModified: "",
            lastModifiedDate: "",
            name: "",
            size: "",
            type: "",
            webkitRelativePath: "",
            dataURL: "",
          }))
        : []
    );
  }, [fixedSlot, maxFileUpload]);

  useEffect(() => {
    if (value) {
      setCurrentValue([...value]);
    }
  }, [value]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        let width = containerRef.current.getBoundingClientRect().width;
        let eachBoxWidth = width / imageBoxPerRow;
        containerRef.current.style.height = rows * eachBoxWidth + "px";
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [
    width,
    imageBoxPerRow,
    rows,
    maxFileSize,
    borderless,
    error,
    draggable,
    fixedSlot,
    labels,
  ]);

  return (
    <ReactEzyImageUploadContainer
      disabled={isDisabled}
      ref={containerRef}
      borderless={borderless}
      rows={rows}
      maxWidth={maxWidth}
      width={width}
      imageBoxPerRow={imageBoxPerRow}
      error={error}
      {...getRootProps()}
    >
      {currentValue.map((item, index) => (
        <ReactEzyImageUploadImageBox
          key={index}
          src={item?.dataURL}
          rounded={rounded}
          draggable={draggable}
          label={!fixedSlot ? label : labels?.[index]}
          alwayShowLabel={fixedSlot}
          onDragStart={() => (selectedRef.current = index)}
          onDragOver={() => (targetRef.current = index)}
          onDelete={() => handleDelete(index)}
          onDrop={handleFileDrop}
          {...(fixedSlot &&
            !item?.dataURL && {
              input: !item?.dataURL,
              ...getRootProps({
                onClick: () => (selectedRef.current = index),
              }),
            })}
        />
      ))}
      {!!(currentValue.length < maxFileUpload && !fixedSlot) && (
        <ReactEzyImageUploadImageBox
          rounded={rounded}
          label={label}
          input
          {...getRootProps()}
        />
      )}
      {showCaption && (
        <ReactEzyImageUploadCaption
          maxFileSize={maxFileSize}
          maxFileUpload={maxFileUpload}
          values={currentValue}
        />
      )}
      {}
    </ReactEzyImageUploadContainer>
  );
}
