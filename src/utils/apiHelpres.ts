const url = "http://top4mobileapp.vbsit.in/";
export async function POST(api: string, payload: any) {
  try {
    const res = await fetch(`${url}${api}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic dG9wNHdlYnNpdGU6eFRrVzY0OFc=",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Proxy error: ${res.status} ${text}`);
    }

    const text = await res.text();
    return JSON.parse(text)
  } catch (e) {
    throw new Error("Proxy returned non-JSON response: " + e);
  }
}

export async function GET(api: string) {
  try {
      const res = await fetch(`${url}${api}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic dG9wNHdlYnNpdGU6eFRrVzY0OFc=",
      },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Proxy error: ${res.status} ${text}`);
    }

    const text = await res.text();
    return JSON.parse(text)
  } catch (e) {
    throw new Error("Proxy returned non-JSON response: " + e);
  }
}

export async function PUT(api: string, payload: any) {
  try {
     try {
    const res = await fetch(`${url}${api}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic dG9wNHdlYnNpdGU6eFRrVzY0OFc=",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Proxy error: ${res.status} ${text}`);
    }

    const text = await res.text();
    return JSON.parse(text)
  } catch (e) {
    throw new Error("Proxy returned non-JSON response: " + e);
  }
  } catch (e) {
    throw new Error("Proxy returned non-JSON response: " + e);
  }
}
