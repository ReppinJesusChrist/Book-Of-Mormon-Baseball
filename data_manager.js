export async function fetchScriptures(volume){
    const response = await fetch(volume);
    return await response.json();
}