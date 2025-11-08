'use client';

import { Plant } from "@/types/contracts";

// Asumsi fungsi pembantu (getNftName, getNftDesc, getNftImage) didefinisikan di file yang sama

export const uploadNftMetadata = async (
    plant: Plant
): Promise<string | undefined> => {
    try {
        const metadataJson = {
            name: getNftName(plant.quantity),
            description: getNftDesc(plant.quantity),
            image: getNftImage(plant.quantity),
            attributes: [
                { trait_type: "Quantity Tier", value: getNftName(plant.quantity).split(' ').pop() }
            ]
        };

        const jsonString = JSON.stringify(metadataJson, null, 2);
        const metadataBlob = new Blob([jsonString], { type: 'application/json' });

        const formData = new FormData();
        const fileName = `${metadataJson.name.toLowerCase().replace(/\s/g, '_')}_metadata.json`;

        formData.set("file", metadataBlob, fileName);

        const uploadRequest = await fetch("/api/pinata", {
            method: "POST",
            body: formData,
        });

        if (!uploadRequest.ok) {
            const errorData = await uploadRequest.json();
            throw new Error(errorData.error || `Upload gagal dengan status: ${uploadRequest.status}`);
        }

        // Asumsi server mengembalikan { cid } lalu mengonversinya menjadi URL
        const result = await uploadRequest.json();

        // Asumsi server mengembalikan URL penuh (seperti dari pinata.gateways.public.convert(cid))
        const metadataUrl = result.cid;

        console.log(`Metadata berhasil diunggah! URL: ${metadataUrl}`);
        alert(`Metadata berhasil diunggah! URL: ${metadataUrl}`);

        return metadataUrl;

    } catch (e) {
        console.error("Gagal mengunggah metadata NFT:", e);
        alert(`Trouble uploading NFT metadata. Check console for details. ${e}`);
        return undefined;
    }
};

// --- Fungsi Pembantu (Sesuai dengan yang Anda berikan) ---

const getNftName = (qty: number) => {
    if (qty <= 5) {
        return "DOMAIN DONATUR BRONZE"
    } else if (qty > 5 && qty <= 10) {
        return "DOMAIN DONATUR SILVER"
    } else {
        return "DOMAIN DONATUR GOLD"
    }
}

const getNftDesc = (qty: number): string => {
    if (qty <= 5) {
        return "Tier donatur Bronze. Mewakili dukungan awal Anda terhadap pengembangan domain ini. Terima kasih atas kontribusi Anda!";
    } else if (qty > 5 && qty <= 10) {
        return "Tier donatur Silver. Menandakan tingkat dukungan yang signifikan terhadap proyek kami. Kontribusi Anda sangat berarti!";
    } else {
        return "Tier donatur Gold. Simbol dari komitmen tertinggi dan dukungan berkelanjutan Anda. Anda adalah bagian vital dari keberhasilan domain ini!";
    }
}

const getNftImage = (qty: number): string => {
    if (qty <= 5) {
        return "https://img.freepik.com/free-photo/gold-aesthetic-wallpaper-with-plant_23-2149872235.jpg?ga=GA1.1.1471941365.1762528201&semt=ais_hybrid&w=740&q=80"
    } else if (qty > 5 && qty <= 10) {
        return "https://img.freepik.com/free-psd/black-white-minimal-still-life_23-2150634220.jpg?ga=GA1.1.1471941365.1762528201&semt=ais_hybrid&w=740&q=80";
    } else {
        return "https://img.freepik.com/premium-photo/loral-minimalist-style-concept-exotic-summer-trends-golden-tropical-fern-leaves-pastel_512343-89.jpg?ga=GA1.1.1471941365.1762528201&semt=ais_hybrid&w=740&q=80";
    }
}