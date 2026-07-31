const PURPLE = 'rgb(232 121 249)';
const BLUE = 'rgb(96 165 250)';
const GREEN = 'rgb(94 234 212)';

const COLOR_COMBOS = [
    [PURPLE, BLUE, GREEN],
    [PURPLE, GREEN, BLUE],
    [GREEN, PURPLE, BLUE],
    [GREEN, BLUE, PURPLE],
    [BLUE, GREEN, PURPLE],
    [BLUE, PURPLE, GREEN],
];

const LENGTH = 25;
const ANIMATION_TIME = 45;

export function RainbowBackground() {
    const rainbows = Array.from({ length: LENGTH }, (_, index) => {
        const i = index + 1;
        const [c1, c2, c3] = COLOR_COMBOS[index % COLOR_COMBOS.length];
        const duration = ANIMATION_TIME - (ANIMATION_TIME / LENGTH / 2) * i;
        const delay = -(i / LENGTH) * ANIMATION_TIME;
        const boxShadow = `-130px 0 80px 40px white, -50px 0 50px 25px ${c1}, 0 0 50px 25px ${c2}, 50px 0 50px 25px ${c3}, 130px 0 80px 40px white`;
        return (
            <div
                key={i}
                className="rainbow-streak"
                style={{
                    boxShadow,
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`,
                }}
            />
        );
    });

    return (
        <div className="rainbow-container">
            {rainbows}
            <div className="rainbow-h" />
            <div className="rainbow-v" />
        </div>
    );
}