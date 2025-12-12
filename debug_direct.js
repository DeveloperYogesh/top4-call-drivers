// Use native fetch (Node 18+)

async function testDirect() {
    try {
        console.log("Testing Direct Backend...");
        const REMOTE_BASE = "http://top4mobileapp.vbsit.in";
        const REMOTE_AUTH = "Basic dG9wNHdlYnNpdGU6eFRrVzY0OFc=";

        const res = await fetch(`${REMOTE_BASE}/api/V1/booking/sendOTP`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": REMOTE_AUTH
            },
            body: JSON.stringify({ mobileno: "7845950289" })
        });
        console.log("Status:", res.status);
        console.log("Text:", await res.text());
    } catch (e) {
        console.error("Direct Test Failed:", e);
    }
}

testDirect();
