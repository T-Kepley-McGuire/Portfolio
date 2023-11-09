const API_BASE_URL: string =
  process.env.BACKEND_URL || "http://localhost:5001";

const headers = new Headers();
headers.append("Content-type", "application/json");

async function fetchJson(
  url: URL,
  options: object,
  onCancel: any
): Promise<Error | any> {
  try {
    const response = await fetch(url);

    if (response.status === 204) return null;

    const payload = await response.json();
    if (payload.error) return Promise.reject({ message: payload.error });
    return payload.data;
  } catch (error: any) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

export async function listAbout(signal: AbortSignal) {
    const url = new URL(`${API_BASE_URL}/about`);
    
    return await fetchJson(url, { headers, signal, method: "GET"}, []);
}

export async function listProjects(signal: AbortSignal) {
    const url = new URL(`${API_BASE_URL}/projects`);
    
    return await fetchJson(url, { headers, signal, method: "GET"}, []);
}