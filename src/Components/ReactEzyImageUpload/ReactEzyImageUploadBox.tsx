import { forwardRef, HTMLAttributes, LegacyRef } from 'react';

export interface IReactEzyImageUploadImageBoxProps extends HTMLAttributes<HTMLDivElement>{
    input?: boolean;
    label?: string;
    src?: string | ArrayBuffer | null;
    alwayShowLabel:boolean;
    rounded?: boolean;
    onDelete?:()=>any;
    onDrop?:()=>any;
    // draggable?:boolean;
}

const ReactEzyImageUploadImageBox = forwardRef(({ input, rounded, draggable, alwayShowLabel = false,className, onDelete = () => { }, src = "", label, ...rest }: IReactEzyImageUploadImageBoxProps, ref: LegacyRef<HTMLDivElement>) => {

    return (
        <div draggable={draggable} ref={ref} className={['ReactEzyImageUploadImageBox',className].join(" ")} {...rest}>
            <div className={['ReactEzyImageUploadImageBox-Media', src && "hasMedia" , rounded && "rounded"].join(" ")} style={{backgroundImage: `url("${src}")`, backgroundSize: "cover" }} />
            {
                input && (
                    <div className='ReactEzyImageUploadImageBox-Plus'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} strokeDasharray={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                )
            }
            {
                src && (
                    <button className='ReactEzyImageUploadImageBox-Button' onClick={onDelete}>
                        <svg className='ReactEzyImageUploadImageBox-Bin' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )
            }
            {label !== null && (
                <p hidden={!!(src && !alwayShowLabel)} className={['ReactEzyImageUploadImageBox-Label', src && "isUploaded"].join(" ")}>{label}</p>
            )}
        </div>
    );
})

export default ReactEzyImageUploadImageBox
