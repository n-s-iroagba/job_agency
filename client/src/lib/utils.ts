export const uploadFile = async (
    file: File,
    type: 'thumbnail' | 'video' | 'image'
) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'amafor');
        formData.append('folder', 'amafor');

        // Use 'auto' to allow Cloudinary to detect the file type (PDF vs Image)
        const cloudUrl = `https://api.cloudinary.com/v1_1/dh2cpesxu/auto/upload`;

        const uploadRes = await fetch(cloudUrl, { method: 'POST', body: formData });

        const data = await uploadRes.json();
        
        if (!uploadRes.ok) {
            console.error('[Cloudinary Upload Error]', data);
            throw new Error(data.error?.message || 'Cloudinary upload failed');
        }

        console.log('[Cloudinary Upload Success]', data.secure_url);
        return data.secure_url;
    } catch (error) {
        console.error('[uploadFile Utility Error]', error);
        throw error;
    }
};