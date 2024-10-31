import { FormEvent, useState } from 'react';
import axios from 'axios';
// import './download-style.css';


function DownloadFile() {
    
    const [isLoading, setIsLoading] = useState(false);
    
    return (
        <div className='container'>
            <h1>Download file</h1>
            <form className='download-form' onSubmit={onSubmit}>
                <label>file id:</label>
                <input id='file_id' type='text' name='file_id'/>
                
                <input type='submit' value='find'/>
            </form>
        </div>
    );
    
    
    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        setIsLoading(true);
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        const fileId = formData.get('file_id') as string | null;
        if (!fileId) {
            console.error('entered file id was "null"');
            return;
        }
        
        try {
            const res = await axios.get('http://localhost:8080/api/' + fileId, { responseType: 'blob' });
            const fileContents = res.data;
            const fileBlob = new Blob([fileContents], { type: 'text/plain' });
            
            downloadBlob(fileBlob);
            
        } catch {
            console.error('Failed to get file from server');
        } finally {
            setIsLoading(false);
        }
    }
    
    function downloadBlob(blob: Blob) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'temp-name.txt';
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
}


export default DownloadFile;
