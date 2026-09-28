const CUBE_URL = "http://localhost:4000";

export async function loadCubeData(query) {
  const response = await fetch(
    `${CUBE_URL}/cubejs-api/v1/load?query=${encodeURIComponent(
      JSON.stringify(query)
    )}`
  );

  const result = await response.json();

  if (!response.ok) {
    console.error("Cube API response:", result);

    throw new Error(
      result.error ||
      result.message ||
      `Cube API error: ${response.status}`
    );
  }

  return result.data;
}