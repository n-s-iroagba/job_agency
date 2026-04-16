export const uploadFile = async (
    file: File,
    type: 'thumbnail' | 'video' | 'image'
) => {


    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'amafor');
    formData.append('folder', 'amafor');

    const resourceType = type === 'video' ? 'video' : 'image';
    const cloudUrl = `https://api.cloudinary.com/v1_1/dh2cpesxu/${resourceType}/upload`;

    const uploadRes = await fetch(cloudUrl, { method: 'POST', body: formData });

    const data = await uploadRes.json();
    return data.url;
};