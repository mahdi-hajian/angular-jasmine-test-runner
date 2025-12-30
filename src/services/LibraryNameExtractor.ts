import * as path from 'path';

export class LibraryNameExtractor {
    public static extractFromPath(filePath: string): string {
        const pathParts = filePath.split(path.sep);
        if (pathParts.length > 0 && pathParts[0]) {
            return pathParts[0];
        }
        return '';
    }
}

