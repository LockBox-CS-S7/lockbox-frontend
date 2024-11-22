import axios from "axios";
import { UserFile } from "src/models/user-file";
import { encryptAES, decryptAES } from "src/utils/AES-encryption";

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
    
    /**
     * Encrypts a file and then sends it to the backend.
     * @param userId - The ID of the user that wants to upload the file.
     * @param password - The encryption password.
     * @param file - The file that will be encrypted and uploaded.
     * @returns `true` if the proces was successfull, `false` otherwise.
     */
    async encryptAndUploadFile(userId: string, password: string, file: File): Promise<boolean> {
        // Read file contents
        const fileContents = await this.readFileToString(file);
        if (!fileContents) return false;
        
        // encrypt the file
        const encryptedContents = encryptAES(fileContents, password);
        const encryptedFile = new File([encryptedContents], file.name, {
            type: "text/plain", // Adjust type as needed
        });
        
        // create FormData, since backend expects it
        const postForm = new FormData();
        postForm.append('user_id', userId);
        postForm.append('file', encryptedFile);
        
        try {
            await axios.postForm(this.apiBaseUrl, postForm);
            return true;
        } catch {
            console.error('Failed to send file to backend.');
            return false;
        }
    }
    
    async getAndDecryptFileBlobById(fileId: string | null, password: string): Promise<Blob | undefined> {
        if (!fileId) {
            console.error('No file id was given.');
            return;
        }
        
        try {
            const res = await axios.get(this.apiBaseUrl + fileId, { responseType: 'blob' });
            const fileContents: string = res.data;
            const decryptedContents = decryptAES(fileContents, password);
            
            return new Blob([decryptedContents], { type: 'text/plain' });
            
        } catch {
            console.error('Failed to get file from server with the given id.');
            return;
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
    
    private readFileToString(file: File): Promise<string | undefined> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsText(file);
            
            reader.onload = () => resolve(reader.result?.toString());
            reader.onerror = () => reject(reader.error);
        });
    }
}

export default new FileService();
