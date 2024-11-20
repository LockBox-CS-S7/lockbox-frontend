import axios from "axios";
import { UserFile } from "src/models/user-file";

class FileService {
    private apiBaseUrl = 'http://localhost:8080/api/';
    
    
    async uploadFile(userId: String, file: File) {
        const postForm = new FormData();
        postForm.append('user_id', String(userId)); // TypeScript error requires explicit string casting here...
        postForm.append('file', file);
        
        try {
            await axios.postForm(this.apiBaseUrl, postForm);
        } catch {
            console.error('Failed to send file to backend.');
        }
    }
    
    async getFileBlobById(fileId: String | null) {
        if (!fileId) {
            console.error('entered file id was "null"');
            return;
        }
        
        try {
            const res = await axios.get(this.apiBaseUrl + fileId, { responseType: 'blob' });
            const fileContents = res.data;
            const fileBlob = new Blob([fileContents], { type: 'text/plain' });
            
            return fileBlob;
            
        } catch {
            console.error('Failed to get file from server');
            return;
        }
    }
    
    async getFilesByUserId(userId: String) {
        const res = await axios.get(this.apiBaseUrl + '/user-files/' + userId);
        return res.data.map((item: any) => this.mapToUserFile(item));
    }
    
    private mapToUserFile(item: any): UserFile {
        return {
            id: item.id,
            user_id: item.user_id,
            file_name: item.file_name,
            file_type: item.file_type,
            contents: item.contents,
        };
    }
}

export default new FileService();
