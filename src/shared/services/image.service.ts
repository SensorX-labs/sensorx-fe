import api from "@/shared/configs/axios-config";

const imageService = {
    /**
     * Upload ảnh lên server
     */
    upload: (file: File, folder: string = "products") => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        return api.data.post<FormData, string>('/image/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    /**
     * Xóa ảnh trên server
     */
    deleteImage: (imageUrl: string) => {
        return api.data.delete<string, boolean>('/image/delete', { data: imageUrl });
    },
    /**
     * Xóa nhiều ảnh trên server
     */
    deleteImages: (imageUrls: string[]) => {
        return api.data.delete<string, boolean>('/image/delete-multiple', { data: imageUrls });
    }
};

export default imageService;