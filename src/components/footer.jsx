import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-[#012010] to-[#023020] text-[#E4EfE9] 
                         py-4 sm:py-5 md:py-6">
            <div className="w-full min-h-[8vh] px-4 sm:px-6 lg:px-8 
                          flex flex-col sm:flex-row justify-between items-center 
                          max-w-7xl mx-auto gap-4 sm:gap-0">
                <div className="flex items-center justify-center sm:justify-start">
                    <img 
                        src="/public/pngtree-chess-rook-front-view-png-image_7505306-2460555070.png" 
                        alt="Chess Website Logo" 
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 
                                 rounded-full mr-2 sm:mr-3 md:mr-4
                                 transition-transform duration-300 hover:scale-110"
                    />
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#1BFFFF]
                                   tracking-wide hover:text-opacity-80 transition-colors duration-300">
                        ChessMasters
                    </span>
                </div>
                <div className="text-xs sm:text-sm md:text-base text-center sm:text-right
                              opacity-90 hover:opacity-100 transition-opacity duration-300">
                    © {new Date().getFullYear()} ChessMasters. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
