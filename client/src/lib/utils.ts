export const uploadFile = async (
    file: File,
    type: 'thumbnail' | 'video' | 'image'
) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'amafor');
        
        // Explicitly determine resource type to bypass image-specific security filters
        const isImage = file.type.startsWith('image/');
        const resourceType = isImage ? 'image' : 'raw';
        const cloudUrl = `https://api.cloudinary.com/v1_1/dh2cpesxu/${resourceType}/upload`;
        
        const uploadRes = await fetch(cloudUrl, { method: 'POST', body: formData });
        const data = await uploadRes.json();
        
        if (!uploadRes.ok) {
            console.error('[Cloudinary Upload Error Details]', {
                status: uploadRes.status,
                statusText: uploadRes.statusText,
                data
            });
            throw new Error(data.error?.message || 'Cloudinary upload failed');
        }

        console.log('[Cloudinary Smart Upload Success]', {
            url: data.url,
            resource_type: data.resource_type,
            format: data.format
        });

        // Return the standard Public URL (HTTP) for compatibility
        return data.url;
    } catch (error) {
        console.error('[uploadFile Utility Error]', error);
        throw error;
    }
};