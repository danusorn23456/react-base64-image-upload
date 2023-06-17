import { forwardRef, LegacyRef, ReactNode } from "react";

export interface IReactEzyImageUploadContainerProps {
  children: ReactNode;
  height?: string | number;
  width?: string | number;
  maxWidth?: string | number;
  imageBoxPerRow?: number;
  rows?: number;
  error?: boolean;
  disabled?: boolean;
  borderless?: boolean;
}

const ReactEzyImageUploadContainer = forwardRef(
  (
    {
      children,
      borderless,
      disabled,
      height = "auto",
      width = "100%",
      maxWidth = "100%",
      imageBoxPerRow = 5,
      rows = 1,
      error,
      ...rest
    }: IReactEzyImageUploadContainerProps,
    ref: LegacyRef<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        className={[
          "ReactEzyImageUploadContainer",
          disabled && "isDisabled",
          error && "isError",
        ].join(" ")}
        style={{
          position: "relative",
          ...(borderless && { borderWidth: "0px" }),
          height,
          width,
          maxWidth,
          gridTemplateColumns: `repeat(${imageBoxPerRow},1fr)`,
          gridTemplateRows: `repeat(${rows},1fr)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            inset: 0,
          }}
          {...rest}
        ></div>
        {children}
      </div>
    );
  }
);

export default ReactEzyImageUploadContainer;
