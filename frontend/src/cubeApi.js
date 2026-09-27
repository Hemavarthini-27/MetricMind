const CUBE_URL = "http://localhost:4000";

export async function loadCubeData(query) {
  const response = await fetch(
    `${CUBE_URL}/cubejs-api/v1/load?query=${encodeURIComponent(
      JSON.stringify(query)
    )}`
  );

  if (!response.ok) {
    throw new Error(`Cube API error: ${response.status}`);
  }

  const result = await response.json();

  return result.data;
}