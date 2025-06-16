import { backendAPI } from "@/contexts/GlobalContext";

export async function fetchHeaderData() {
    try {
        const res = await fetch(`${backendAPI}header`);
        if (!res.ok) throw new Error("Failed to fetch header data");
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching header data:", error.message);
        return {};
    }
}

export async function fetchFooterData() {
    try {
        const res = await fetch(`${backendAPI}footer`);
        if (!res.ok) throw new Error("Failed to fetch footer data");
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching footer data:", error.message);
        return {};
    }
}
