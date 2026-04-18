export const uploadFile = async (
    file: File,
    type: 'thumbnail' | 'video' | 'image'
) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'amafor');
        // Removed folder: 'amafor' to test if folder permissions are causing 401
        
        // Explicitly request public access and standard upload delivery type
        formData.append('type', 'upload');
        formData.append('access_mode', 'public');

        // Determine resource type: images as image, documents as raw for direct public download
        const isImage = file.type.startsWith('image/');
        const resourceType = isImage ? 'image' : 'raw';
        const cloudUrl = `https://api.cloudinary.com/v1_1/dh2cpesxu/${resourceType}/upload`;

        const uploadRes = await fetch(cloudUrl, { method: 'POST', body: formData });
        const data = await uploadRes.json();
        
        if (!uploadRes.ok) {
            console.error('[Cloudinary Upload Error]', data);
            throw new Error(data.error?.message || 'Cloudinary upload failed');
        }

        console.log('[Cloudinary Public Upload Success]', {
            public_url: data.url,
            secure_url: data.secure_url,
            access_mode: data.access_mode,
            resource_type: data.resource_type
        });

        // Return the standard Public URL (HTTP) as requested for maximum accessibility
        return data.url;
    } catch (error) {
        console.error('[uploadFile Utility Error]', error);
        throw error;
    }
};