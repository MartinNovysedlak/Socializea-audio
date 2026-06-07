// Mock equipment service for image management
export const equipmentService = {
  uploadImage: async (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  },
  deleteImage: async (url: string): Promise<boolean> => {
    console.log('Deleting image:', url);
    return true;
  }
};
