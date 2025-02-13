import supabase, { supabaseUrl } from "./supabase";

// Funcția pentru obținerea tuturor cabanelor
export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*"); // Selectăm toate înregistrările din tabelul "cabins"
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }
  return data;
}

// Funcția pentru crearea sau editarea unei cabine
export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl); // Verificăm dacă imaginea începe cu URL-ul Supabase, indicând că aceasta deja există în storage
  // Construim un nume unic pentru fișierul imaginii
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );
  // Construim URL-ul pentru imagine
  const imagePath = hasImagePath
    ? newCabin.image // Dacă imaginea există deja în Supabase, o păstrăm așa cum este
    : `${supabaseUrl}/storage/v1/object/public/cabin-images//${imageName}`; // Altfel, construim un URL nou pentru imagine

  let query = supabase.from("cabins"); // Inițializăm query-ul pentru tabelul "cabins"

  // 1. Crearea sau editarea cabanei
  // A) Creare
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);
  // B) Editare
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id); // Actualizăm cabana cu id-ul dat
  const { data, error } = await query.select().single(); // Executăm query-ul și obținem rezultatul
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be created"); // Aruncăm eroare dacă apare o problemă la creare sau editare
  }

  // 2. Uploadul imaginii doar dacă utilizatorul a încărcat un fișier nou
  if (newCabin.image && typeof newCabin.image !== "string") {
    const { error: storageError } = await supabase.storage
      .from("cabin-images")
      .upload(imageName, newCabin.image); // Încărcăm fișierul în storage-ul Supabase

    // 3. Ștergerea cabanei în cazul în care imaginea nu a putut fi încărcată
    if (storageError) {
      await supabase.from("cabins").delete().eq("id", data.id); // Dacă upload-ul imaginii a eșuat, ștergem cabana creată
      console.error(storageError);
      throw new Error(
        "Cabin image could not be uploaded and the cabin was not created"
      );
    }
  }

  return data;
}

// Funcția pentru ștergerea unei cabane
export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id); // Ștergem cabana cu ID-ul dat
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be deleted");
  }
  return data;
}
