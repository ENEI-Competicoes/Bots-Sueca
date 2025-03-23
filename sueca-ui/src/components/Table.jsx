import React from "react";
import TableCards from "./TableCards";
import { getImagePathChair } from '../util/getImagePath';

const Table = ({ roundPoints, overallPoints, roundID, p1Name, p2Name, p3Name, p4Name }) => {
    const imagePath = getImagePathChair();

    return (
        <div className="w-1/4 aspect-square bg-green-700 border-4 border-yellow-600 rounded-full flex items-center justify-center relative">
            {/* Cadeiras em torno da mesa */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-0 w-14 h-14" style={{ top: "-10%" }}>
                <p className="absolute inset-0 flex items-top justify-center text-white font-bold text-sm mt-3">{p4Name}</p>
                <img src={imagePath} alt="Cadeira" className="w-full h-full" />
                <p className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm mt-3">P4</p>
            </div>
            
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-180 w-14 h-14" style={{ bottom: "-10%" }}>
                <p className="absolute inset-0 flex items-bottom justify-center text-white rotate-180 font-bold text-sm mt-3">{p2Name}</p>
                <img src={imagePath} alt="Cadeira" className="w-full h-full" />
                <p className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm mt-3">P2</p>
            </div>
            
            <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-90 w-14 h-14" style={{ left: "-10%" }}>
                <p className="absolute inset-0 flex items-left justify-center text-white font-bold text-sm mt-3">{p1Name}</p>
                <img src={imagePath} alt="Cadeira" className="w-full h-full" />
                <p className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm mt-3">P1</p>
            </div>
            
            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 rotate-90 w-14 h-14" style={{ right: "-10%" }}>
                <p className="absolute inset-0 flex items-right justify-center text-white font-bold text-sm mt-3">{p3Name}</p>
                <img src={imagePath} alt="Cadeira" className="w-full h-full" />
                <p className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm mt-3">P3</p>
            </div>


            {/* Placeholder para as cartas dos jogadores */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/6 border-2 border-white rounded-lg w-12 h-16" />
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/6 border-2 border-white rounded-lg w-12 h-16" />
            <div className="absolute left-0 top-1/2 transform -translate-x-1/6 -translate-y-1/2 border-2 border-white rounded-lg w-12 h-16" />
            <div className="absolute right-0 top-1/2 transform translate-x-1/6 -translate-y-1/2 border-2 border-white rounded-lg w-12 h-16" />

            {/* Cartas na mesa */}
            <div className="absolute inset-0 flex items-center justify-center">
                <TableCards />
            </div>

            <div className="flex flex-col items-center opacity-75">
                <p className="text-md font-bold pb-2">Nº ronda: {roundID}</p>
                <p>Pontos:</p>
                <p className="text-md text-gray-900 font-bold flex flex-col">
                    <strong className="text-gray-950">Equipa 1 (P1, P3)</strong>Ronda: {roundPoints["1"]}, Total: {overallPoints["1"]}
                    <strong className="text-gray-950">Equipa 2 (P2, P4)</strong>Ronda: {roundPoints["2"]}, Total: {overallPoints["2"]}
                </p>
            </div>
        </div>
    );
};

export default Table;