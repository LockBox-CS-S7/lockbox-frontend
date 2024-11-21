import React, { useState, useEffect } from "react";
import { PageLayout } from "../../components/page-layout";
import fileService from "src/services/file-service";
import downloadBlob from "src/utils/download-file-blob";
import { useAuth0 } from "@auth0/auth0-react";
import { UserFile } from "src/models/user-file";
import './files-page.css';


const FilesPage: React.FC = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [fileList, setFileList] = useState<UserFile[]>([]);
    
    
    useEffect(() => {
        const fetchUserFiles = async () => {
            try {
                const userId = user?.sub;
                if (userId) {
                    const files = await fileService.getFilesByUserId(userId);
                    setFileList(files);
                }
            } catch (error) {
                console.error('Encountered an error when fetching files: ' + error);
            }
        }
        
        fetchUserFiles();
    }, []);
    
    
    async function handleFileDownload(file: UserFile) {
        const blob = await fileService.getFileBlobById(file.id);
        if (!blob) return
        downloadBlob(blob, `${file.file_name}.${file.file_type}`); 
    }
    
    
    if (isLoading) return <div>Loading...</div>
    if (!isAuthenticated) return <div>You need to be authenticated for this page.</div>
    
    
    return (
        <PageLayout>
            <div className="files-container">
                <h2 className='title'>my files</h2>
                
                {fileList.length === 0 ? (
                    <p>You currently don't have any files stored in LockBox.</p>
                ) : (
                    <div className="file-list">
                        {fileList.map((item, index) => (
                            <div className="file-row">
                                <p>{item.file_name}.{item.file_type}</p>
                                <button onClick={() => handleFileDownload(item)}>download</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PageLayout>
    );
}


export default FilesPage;
