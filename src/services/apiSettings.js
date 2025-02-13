import supabase from "./supabase"; // Importăm instanța Supabase

// Funcția pentru obținerea setărilor din baza de date
export async function getSettings() {
  // Realizăm o interogare către tabelul "settings" pentru a selecta toate câmpurile
  const { data, error } = await supabase.from("settings").select("*").single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }
  return data;
}

// Funcția pentru actualizarea setărilor
// Parametrul newSetting ar trebui să fie un obiect de forma { setting: newValue }
export async function updateSetting(newSetting) {
  // Realizăm o interogare către tabelul "settings" pentru a actualiza setările
  const { data, error } = await supabase
    .from("settings")
    .update(newSetting) // Actualizăm setările cu obiectul newSetting
    .eq("id", 1) // Setările sunt stocate într-o singură linie cu ID=1
    .single(); // Avem doar un singur rând de setări, așadar folosim `.single()`

  if (error) {
    console.error(error);
    throw new Error("Settings could not be updated");
  }
  return data;
}
