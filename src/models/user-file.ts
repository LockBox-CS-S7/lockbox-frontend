export interface UserFile {
    id: string | null,
    user_id: string,
    file_name: string,
    file_type: string,
    contents: Blob,
}
