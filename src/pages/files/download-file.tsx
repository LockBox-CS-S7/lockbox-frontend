import { FormEvent, useState } from 'react';
import { PageLayout } from "../../components/page-layout";
import fileService from 'src/services/file-service';
import downloadBlob from 'src/utils/download-file-blob';
import './download-file.css';


function DownloadFile() {
    
    const [isLoading, setIsLoading] = useState(false);
    
    return (
        <PageLayout>
            <div className='container'>
                <h2 className='title'>Download file</h2>
                <form className='download-form' onSubmit={onSubmit}>
                    <label>file id:</label>
                    <input id='file_id' type='text' name='file_id'/>
                    
                    <input type='submit' value='find'/>
                </form>
            </div>
        </PageLayout>
    );
    
    
    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        setIsLoading(true);
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        const fileId = formData.get('file_id') as string | null;
        await downloadFileById(fileId);
    }
    
    async function downloadFileById(fileId: String | null) {
        const blob = await fileService.getFileBlobById(fileId);
        if (!blob) {
            console.error("Failed to get file blob");
            return;
        }
        
        downloadBlob(blob, null);
    }
}


export default DownloadFile;
