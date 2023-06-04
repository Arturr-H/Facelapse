/* Imports */
import * as FileSystem from "expo-file-system";

/* Constants */
const fileName = "onionskin.jpg";

/* Save image */
export default async function saveImage(uri: string, callback: () => void): Promise<void> {
    const newPath = FileSystem.documentDirectory + fileName;

    const fileData = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
    });

    await FileSystem.writeAsStringAsync(newPath, fileData, {
        encoding: FileSystem.EncodingType.Base64,
    }).then(() => {
        callback();
    });
}

export async function getImageB64(): Promise<string | null> {
    const newPath = FileSystem.documentDirectory + fileName;

    try {
        const fileData = await FileSystem.readAsStringAsync(newPath, {
            encoding: FileSystem.EncodingType.Base64,
        });

        return `data:image/jpeg;base64,${fileData}`;
    }catch {
        return null;
    }
}
