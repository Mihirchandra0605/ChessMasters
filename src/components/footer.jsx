import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-[#012010] to-[#023020] text-[#E4EfE9] py-6">
            <div className="w-full h-[8vh] px-6 flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center mb-4 md:mb-0">
                    <img 
                        src="/public/pngtree-chess-rook-front-view-png-image_7505306-2460555070.png" 
                        alt="Chess Website Logo" 
                        className="w-12 h-12 rounded-full mr-4"
                    />
                    <span className="text-2xl font-bold text-[#1BFFFF]">ChessMasters</span>
                </div>
                <div className="text-sm">
                    © {new Date().getFullYear()} ChessMasters. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
