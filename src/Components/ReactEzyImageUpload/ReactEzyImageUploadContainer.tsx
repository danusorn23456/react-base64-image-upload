import { forwardRef, LegacyRef, ReactNode } from 'react';

export interface IReactEzyImageUploadContainerProps {
    children: ReactNode,
    height?: string | number;
    width?: string | number;
    maxWidth?: string | number;
    imageBoxPerRow?: number;
    rows?: number;
    error?: boolean;
    disabled?: boolean;
    borderless?: boolean;
}

const ReactEzyImageUploadContainer = forwardRef(({ children, borderless, disabled, height = "100%", width = "100%", maxWidth = "100%", imageBoxPerRow = 5, rows = 1, error }: IReactEzyImageUploadContainerProps, ref: LegacyRef<HTMLDivElement>) => {

    return (
        <div ref={ref} className={['ReactEzyImageUploadContainer', disabled && "isDisabled",error && "isError"].join(" ")} style={{ ...borderless && { borderWidth: '0px' }, height, width, maxWidth, gridTemplateColumns: `repeat(${imageBoxPerRow},1fr)`, gridTemplateRows: `repeat(${rows},1fr)` }}>
            {children}
        </div>
    );
})

export default ReactEzyImageUploadContainer
