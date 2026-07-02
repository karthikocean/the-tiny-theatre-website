import React from "react";

const Gallery = () => {
    return (
        <section className="py-24 bg-[#0B0B0B]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <p className="uppercase tracking-[4px] text-[#FFC512] text-sm">
                        Moments of Magic
                    </p>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mt-3">
                        A Glimpse Into Our World
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                        <div
                            key={item}
                            className="aspect-[4/3] rounded-2xl border border-[#2B2B2B] bg-[#181818] flex items-center justify-center text-gray-500"
                        >
                            Gallery Image {item}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Gallery;