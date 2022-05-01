import { IReactEzyImageUploadProps } from './ReactEzyImageUpload';
import humanFileSize from './humanFileSize';

export interface IReactEzyImageUploadCaptionProps extends Pick<IReactEzyImageUploadProps, "maxFileSize" | "maxFileUpload">{
    values?:any[]
}

export default function ReactEzyImageUploadCaption({maxFileSize,maxFileUpload,values = []}: IReactEzyImageUploadCaptionProps) {
    return (
        <div className='ReactEzyImageUploadCaption'>
            <span className='ReactEzyImageUploadSizeLimit'>file size limit {humanFileSize(maxFileSize as number)}</span>
            <span className='ReactEzyImageUploadLength'>{values.filter(i => i?.dataURL).length}/{maxFileUpload}</span>
        </div>
    );
}
