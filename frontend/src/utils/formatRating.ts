export function formatRating(score: number): string {
    return score > 0 ? `⭐ ${score.toFixed(1)}` : 'Henüz değerlendirilmedi';
}