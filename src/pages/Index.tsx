import InfiniteGrid from "../components/InfiniteGrid";
import { sources } from "../data/sources";



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
