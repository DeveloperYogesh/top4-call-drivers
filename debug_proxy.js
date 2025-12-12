// Use native fetch (Node 18+)

async function testProxy() {
    try {
        console.log("Testing Proxy...");
        const res = await fetch("http://localhost:3000/api/proxy/booking/sendOTP", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mobileno: "7845950289" })
        });
        console.log("Status:", res.status);
        console.log("Text:", await res.text());
    } catch (e) {
        console.error("Proxy Test Failed:", e);
    }
}

testProxy();
