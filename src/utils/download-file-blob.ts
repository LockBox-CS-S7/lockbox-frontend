function downloadBlob(blob: Blob, fileName: string | null) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName ? fileName : 'temp-name.txt';
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

export default downloadBlob;
