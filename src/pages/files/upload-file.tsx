import { FormEvent } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import { PageLayout } from "../../components/page-layout";
import './upload-file.css';


function UploadFile() {
    const { user, isAuthenticated, isLoading } = useAuth0();
    
    if (isLoading) return <div>Loading...</div>
    if (!isAuthenticated) return <div>You need to be authenticated for this page.</div>
    
    
    async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        console.log(formData);
        const userId = user?.sub;
        const file = formData.get('file') as File | null;
        
        
        if (!userId) {
            console.error('no user id found');
            return;
        }
        if (!file) {
            console.error('no file selected');
            return;
        }
        
        const fileContents = getFileContents(file);
        //ToDo: encrypt fileContents before sending
        
        const postForm = new FormData();
        postForm.append('user_id', userId);
        postForm.append('file', file);
        
        try {
            await axios.postForm('http://localhost:8080/api/', postForm);
        } catch {
            console.error('Failed to send file to backend.');
        }
    }
    
    
    return (
        <PageLayout>
            <div className="file-upload-container">
                <h2 className='title'>Upload a file</h2>
                
                <form className="upload-form" onSubmit={handleFormSubmit}>
                    <label>select file</label>
                    <input id="file" name="file" type="file"/>
                    
                    <input type="submit" value="upload" className='submit-btn'/>
                </form>
            </div>
        </PageLayout>
    );
}


function getFileContents(file: File) {
    let fileContents: string | ArrayBuffer = '';
    const reader = new FileReader();
    
    reader.onload = (e) => {
        if (!e.target?.result) {
            console.error('failed to read file contents');
            return;
        }
        
        fileContents = e.target?.result;
    }
    
    reader.readAsText(file);
    
    if (fileContents.length < 1) {
        console.error('file content length is less than 1');
        return;
    }
    
    console.log('file contents:\n' + fileContents);
    return fileContents;
}



export default UploadFile;
