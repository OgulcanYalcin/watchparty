export function getCategoryIcon(categoryName: string): string {
    switch (categoryName.toLowerCase()) {
        case 'dizi/film':
            return '🎬';
        case 'spor':
            return '⚽';
        case 'konser':
            return '🎤';
        case 'e-spor':
            return '🎮';
        default:
            return '🎉';
    }
}