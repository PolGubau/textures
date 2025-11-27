import InfiniteGrid from "../components/InfiniteGrid";

export type Source = {
    src: string;
    caption: string;
    x: number;
    y: number;
    w: number;
    h: number;
};
const sources: Source[] = [
    {
        caption:
            "Fire Force Collection <br>Manga volumes & Anime figure <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 270,
        src: "0.JPG",
        w: 400,
        x: 0,
        y: 0,
    },
    {
        caption:
            "Mogok Village, Myanmar <br>Scenic Landscape View <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 150,
        src: "1.JPG",
        w: 350,
        x: 2020,
        y: 0,
    },
    {
        caption:
            "Anime Ema at Kanda Myojin Shrine <br>Traditional wooden prayer plaque <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 230,
        src: "2.JPG",
        w: 120,
        x: 560,
        y: 430,
    },
    {
        caption:
            "White Chrysanthemums <br>Digital Photograph <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 270,
        src: "3.JPG",
        w: 360,
        x: 680,
        y: 890,
    },
    {
        caption:
            "Shibuya Street Scene <br>Digital Photograph <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 220,
        src: "4.JPG",
        w: 360,
        x: 810,
        y: 320,
    },
    {
        caption:
            "Anime Prints <br>Various sizes, digital prints <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 270,
        src: "5.JPG",
        w: 300,
        x: 150,
        y: 640,
    },
    {
        caption:
            "ComicSense Pin <br>Illustrated Pin <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 250,
        src: "6.JPG",
        w: 200,
        x: 460,
        y: 23,
    },
    {
        caption:
            "My Neighbor Totoro Figurine <br>Display piece for fans <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 120,
        src: "7.JPG",
        w: 120,
        x: 800,
        y: 600,
    },
    {
        caption:
            "Amusement Park Swings <br>Digital Photograph <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 240,
        src: "8.JPG",
        w: 300,
        x: 1060,
        y: 660,
    },
    {
        caption:
            "Sunset Over Mountains <br>Digital Photograph <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 120,
        src: "9.JPG",
        w: 100,
        x: 2300,
        y: 400,
    },
    {
        caption:
            "Fire Force Collection <br>Manga volumes & Anime figure <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 200,
        src: "10.JPG",
        w: 150,
        x: 1300,
        y: 360,
    },
    {
        caption:
            "Mogok Village, Myanmar <br>Scenic Landscape View <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 200,
        src: "11.JPG",
        w: 120,
        x: 1200,
        y: 0,
    },
    {
        caption:
            "Anime Ema at Kanda Myojin Shrine <br>Traditional wooden prayer plaque <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 170,
        src: "12.JPG",
        w: 100,
        x: 250,
        y: 368,
    },
    {
        caption:
            "White Chrysanthemums <br>Digital Photograph <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 160,
        src: "13.JPG",
        w: 300,
        x: 850,
        y: 58,
    },
    {
        caption:
            "Shibuya Street Scene <br>Digital Photograph <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 200,
        src: "14.JPG",
        w: 200,
        x: 1400,
        y: 1000,
    },

    {
        caption:
            "ComicSense Pin <br>Illustrated Pin <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 270,
        src: "16.JPG",
        w: 300,
        x: 1700,
        y: 889,
    },
    {
        caption:
            "My Neighbor Totoro Figurine <br>Display piece for fans <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 370,
        src: "17.JPG",
        w: 200,
        x: 1600,
        y: 300,
    },
    {
        caption:
            "Amusement Park Swings <br>Digital Photograph <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 270,
        src: "18.JPG",
        w: 400,
        x: 1200,
        y: 1400,
    },
    {
        caption:
            "Sunset Over Mountains <br>Digital Photograph <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 200,
        src: "19.JPG",
        w: 300,
        x: 0,
        y: 1000,
    },
    {
        caption:
            "Fire Force Collection <br>Manga volumes & Anime figure <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 270,
        src: "20.JPG",
        w: 100,
        x: 400,
        y: 1000,
    },

    {
        caption:
            "Anime Ema at Kanda Myojin Shrine <br>Traditional wooden prayer plaque <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 270,
        src: "22.JPG",
        w: 300,
        x: 0,
        y: 1400,
    },
    {
        caption:
            "White Chrysanthemums <br>Digital Photograph <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 170,
        src: "23.jpg",
        w: 300,
        x: 400,
        y: 1500,
    },
    {
        caption:
            "Shibuya Street Scene <br>Digital Photograph <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 150,
        src: "24.JPG",
        w: 200,
        x: 650,
        y: 1300,
    },
    {
        caption:
            "Anime Prints <br>Various sizes, digital prints <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 270,
        src: "25.JPG",
        w: 200,
        x: 950,
        y: 1300,
    },
    {
        caption:
            "ComicSense Pin <br>Illustrated Pin <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 270,
        src: "26.JPG",
        w: 400,
        x: 700,
        y: 1700,
    },
    {
        caption:
            "My Neighbor Totoro Figurine <br>Display piece for fans <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 270,
        src: "27.JPG",
        w: 160,
        x: 1800,
        y: 0,
    },
    {
        caption:
            "Amusement Park Swings <br>Digital Photograph <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 270,
        src: "28.JPG",
        w: 200,
        x: 1660,
        y: 1360,
    },
    {
        caption:
            "Sunset Over Mountains <br>Digital Photograph <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 160,
        src: "29.JPG",
        w: 350,
        x: 1500,
        y: 1700,
    },
    {
        caption:
            "Fire Force Collection <br>Manga volumes & Anime figure <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 70,
        src: "30.JPG",
        w: 200,
        x: 0,
        y: 1790,
    },
    {
        caption:
            "Anime Ema at Kanda Myojin Shrine <br>Traditional wooden prayer plaque <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 150,
        src: "32.JPG",
        w: 150,
        x: 350,
        y: 1720,
    },
    {
        caption:
            "White Chrysanthemums <br>Digital Photograph <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 220,
        src: "33.JPG",
        w: 300,
        x: 1400,
        y: 2100,
    },
    {
        caption:
            "Shibuya Street Scene <br>Digital Photograph <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 370,
        src: "34.JPG",
        w: 300,
        x: 2000,
        y: 2000,
    },
    {
        caption:
            "Anime Prints <br>Various sizes, digital prints <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 250,
        src: "35.JPG",
        w: 250,
        x: 2000,
        y: 250,
    },
    {
        caption:
            "ComicSense Pin <br>Illustrated Pin <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 270,
        src: "36.JPG",
        w: 400,
        x: 2100,
        y: 760,
    },
    {
        caption:
            "My Neighbor Totoro Figurine <br>Display piece for fans <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 300,
        src: "37.JPG",
        w: 300,
        x: 1990,
        y: 1260,
    },
    {
        caption:
            "Amusement Park Swings <br>Digital Photograph <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 80,
        src: "38.JPG",
        w: 200,
        x: 2100,
        y: 1650,
    },
    {
        caption:
            "Sunset Over Mountains <br>Digital Photograph <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 270,
        src: "39.JPG",
        w: 300,
        x: 850,
        y: 2110,
    },
    {
        caption:
            "Sunset Over Mountains <br>Digital Photograph <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 270,
        src: "40.JPG",
        w: 400,
        x: 2400,
        y: 2000,
    },
    {
        caption:
            "Sunset Over Mountains <br>Digital Photograph <br>Personal Collection, captured by Marcos Rayo, 2025",
        h: 250,
        src: "41.JPG",
        w: 250,
        x: 500,
        y: 2090,
    },
];

const Index = () => {
    return (
        <section
            className="w-full h-screen box-border overflow-hidden select-none cursor-grab touch-none"
            id="hero"
        >
            <InfiniteGrid originalSize={{ h: 2500, w: 2500 }} sources={sources} />
        </section>
    );
};

export default Index;
